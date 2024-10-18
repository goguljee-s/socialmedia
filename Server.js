const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
const url = "mongodb://localhost:27017";

// Function to connect to MongoDB
async function connect() {
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  await client.connect();
  return client;
}

// User view endpoint
app.post("/users/user", async (req, res) => {
  const client = await connect();
  const userCol = client.db("socialmedia").collection("users");
  const id = req.body.id;

  try {
    const users = await userCol.findOne(
      { userId: id },
      {
        projection: {
          name: 1,
          profileImage: 1,
          _id: 0,
          userId: 1,
        },
      }
    );

    if (!users) {
      return res.status(400).json({
        status: 400,
        text: "Bad request",
      });
    } else {
      return res.status(200).json(users);
    }
  } catch (error) {
    console.log(error, "error in userEndview");
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Authentication process
app.post("/authenticate", async (req, res) => {
  const client = await connect();
  const userCol = client.db("socialmedia").collection("users");
  const { email, pass } = req.body;

  try {
    const user = await userCol.findOne(
      { email, pass },
      { projection: { posts: 0, _id: 0, pass: 0, email: 0, mobile: 0 } }
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid credential" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Specific user posts
app.get("/userposts/:id/:page", async (req, res) => {
  const client = await connect();
  const userCol = client.db("socialmedia").collection("users");
  const id = req.params.id;
  const page = parseInt(req.params.page);
  const limit = 5;

  try {
    const posts = await userCol
      .find(
        { userId: id.toString() },
        {
          projection: {
            posts: { $slice: [(page-1)*limit,limit] },
            email: 0,
            pass: 0,
            darkMode: 0,
            id: 0,
            mobile: 0,
            _id: 0,
            userId: 0,
          },
        }
      )
      .sort({ date: -1 })
      .toArray();
    if (!posts || posts.length === 0) {
      return res.status(400).json({ message: "Invalid Data" });
    } else {
      return res.status(200).json(posts[0].posts);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 400, text: "Fetching error post" });
  } finally {
    await client.close();
  }
});

// Fetching posts for home feed
app.get("/posts/:page", async (req, res) => {
  const client = await connect();
  const postCol = client.db("socialmedia").collection("posts");
  const page = parseInt(req.params.page);
  const limit = 2;

  try {
    const pipeLine = [
      { $sort: { date: -1 } },
      { $skip: (page - 1) * limit},
      { $limit: limit },
      {
        $project: {
          caption: 1,
          postId: 1,
          postImage: 1,
          likeCount: 1,
          date: 1,
          userId: 1,
          _id: 0,
        },
      },
    ];
    const posts = await postCol.aggregate(pipeLine).toArray();
    if (!posts || posts.length === 0) {
      return res.status(500).json({ message: "Error fetching post" });
    } else {
      return res.json(posts);
    }
  } catch (e) {
    console.log("Error in post fetching:", e);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Fetching specific post by postID
app.post("/posts/getpost/", async (req, res) => {
  const client = await connect();
  const postCol = client.db("socialmedia").collection("posts");
  const userCol = client.db("socialmedia").collection("users");
  const { postId, userId } = req.body;
  try {
    const user = await userCol.findOne(
      { userId: userId },
      { projection: { userId: 1, _id: 0 } }
    );
      const post = await postCol.findOne(
        { postId: postId},
        { projection: { _id: 0, userId: 0, comments: 0 } }
      );
    if (!post) {
      return res.status(400).json({
        message: "Error in fetching post",
      });
    } else {
      return res.status(200).json(post);
    }
  } catch (error) {
    console.log("Error fetching post:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Fetching specific post comments
app.get("/posts/:postId/:page", async (req, res) => {
  const client = await connect();
  const postCol = client.db("socialmedia").collection("posts");
  const id = req.params.postId;
  const page = parseInt(req.params.page) || 1;
  const limit = 5;
  try {
    const comment = await postCol
      .find(
        { postId: id },
        {
          projection: {
            comments: {
              $slice: [
                {
                  $sortArray: {
                    input: "$comments",
                    sortBy: { date: -1 },
                  },
                },
                (page - 1) * limit,
                limit,
              ],
            },
            _id: 0,
          },
        }
      )
      .sort({ date: -1 })
      .toArray();
    if (comment.length > 0) {
      if (comment[0].comments.length > 0) {
        return res.status(200).json(comment[0].comments);
      } else {
        return res.status(400).json({ message: "No comments found" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// API to add post data
app.post("/addposts/", async (req, res) => {
  const client = await connect();
  const userCol = client.db("socialmedia").collection("users");
  const postCol = client.db("socialmedia").collection("posts");
  const { data, id } = req.body;
  try {
    await userCol.updateOne(
      { userId: id },
      {
        $push: {
          posts: {
            caption: data.caption,
            postId: data.postId,
            postImage: data.postImage,
            likeCount: 0,
            date: data.date,
            comments: [],
          },
        },
      }
    );

    const addpost = await postCol.insertOne({
      caption: data.caption,
      userId: id,
      postId: data.postId,
      postImage: data.postImage,
      likeCount: 0,
      date: data.date,
      comments: [],
    });

    return res.json(addpost);
  } catch (error) {
    console.log("Error adding post:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Delete the post
app.post("/deletePost/", async (req, res) => {
  const client = await connect();
  const postCol = client.db("socialmedia").collection("posts");
  const userCol = client.db("socialmedia").collection("users");
  const { postId, userId } = req.body;

  try {
    const deletePost = await postCol.deleteOne({
      postId: postId,
      userId: userId,
    });
    const userPostDelete = await userCol.updateOne(
      { userId: userId },
      {
        $pull: {
          posts: {
            postId: postId,
          },
        },
      }
    );

    if (!deletePost.deletedCount && !userPostDelete.modifiedCount) {
      return res.status(400).json({ status: 400, text: "Error deleting post" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error deleting post:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Add user in users collection
app.post("/users/add/user", async (req, res) => {
  const client = await connect();
  const userCol = client.db("socialmedia").collection("users");
  const data = req.body;
   console.log(data)
  try {
    const userExist = await userCol.findOne({ email: data.email });

    if (!userExist) {
      const len = (await userCol.countDocuments({})) + 1;
      const userAdd = await userCol.insertOne({
        name: data.input.name,
        userId: len.toString(),
        email: data.input.mail,
        pass: data.input.pass,
        mobile: data.input.phone,
        posts: [],
        profileImage: "",
        darkMode: false,
      });
      return res.json({ message: "Sign-up process done successfully" });
    } else {
      return res.json({ message: "User email already found, try to login" });
    }
  } catch (error) {
    console.log("Error adding user:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Add comments
app.post("/posts/add/comments", async (req, res) => {
  const client = await connect();
  const postCol = client.db("socialmedia").collection("posts");
  const userCol = client.db("socialmedia").collection("users");
  const { postId, data, userId } = req.body;
  console.log(req.body," true");
  try {
    const user = await userCol.findOne(
      { userId: userId },
      { projection: { name: 1, profileImage: 1 } }
    );
    const CmtData = {
      userId: userId,
      username: user.name,
      profileImage: user.profileImage,
      comment: data,
      cmtID: formatDate(new Date()) + "" + userId,
      date: new Date().toISOString(),
    };
    if (!user) {
      return res.json({ message: "No user found" });
    } else {
      const cmt = await postCol.updateOne(
        { postId: postId },
        {
          $push: {
            comments: CmtData
          },
        }
      );
      return res.status(200).json(CmtData);
    }
  } catch (error) {
    console.log("Error adding comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Delete comment
app.post("/posts/delete/comments", async (req, res) => {
  const client = await connect();
  const postCol = client.db("socialmedia").collection("posts");
  const { postID, data, userId } = req.body;

  try {
    const deleteComment = await postCol.updateOne(
      { postId: postID },
      {
        $pull: {
          comments: {
            userId: userId,
            comment: data,
          },
        },
      }
    );

    if (!deleteComment.modifiedCount) {
      return res.status(400).json({ message: "Comment not found" });
    }

    return res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Update the post
app.post("/updatePost/", async (req, res) => {
  const client = await connect();
  const postCol = client.db("socialmedia").collection("posts");
  const { postId, newCaption, userId } = req.body;

  try {
    const updatePost = await postCol.updateOne(
      { postId: postId, userId: userId },
      { $set: { caption: newCaption } }
    );

    if (updatePost.matchedCount === 0) {
      return res.status(400).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.log("Error updating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Utility function for date formatting
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}
