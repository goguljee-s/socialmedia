import { useContext, useEffect, useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import CommentLayout from "./CommentLayout";
import { DataContext } from "../../../contexts/ContextProvider";
import { createFilterOptions } from "@mui/material";
function Post({ Posts}) {
  const [postLikes, setPostLike] = useState(false);
  const [Likes, setLikes] = useState(Posts.likeCount);
  const { show, visitUser, viewUser } = useContext(DataContext);
  const [user, setUser] = useState({});
  

  useEffect(() => {
    fetchUser();
  },[Posts.userId])
  async function fetchUser() {
    if (Posts.userId) {
      try {
        const res = await fetch(`http://localhost:8000/users/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: Posts.userId }),
        });
        if (res.status == 200) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (e) {
        console.log(e);
      }
    }
   }
  function handleClickCmt(event, postId,likeCount) {
    const rect = event.target.getBoundingClientRect();
    const pos = {
      top:window.scrollY+1,
      left: 0
    };
    show(pos,"cmt",postId,likeCount);
  }

  function like() {
    if (postLikes) {
       setLikes(Likes - 1);
       setPostLike(false);
     } else {
       setLikes(Likes+1);
       setPostLike(true);
     }
  }

  return (
    <div className="post-container">
      <article className="post">
        <div
          className="post-head"
          onClick={async () => {
            visitUser(user);
          }}
        >
          <div className="profile">
            <img src={user.profileImage!= "" ? user.profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"}id="avatar" />
            <div>
              <div className="pt-name">{user.name}</div>
              <div className="time">2hrs</div>
            </div>
            <div className="post-menu">
              <MoreHorizIcon />
            </div>
          </div>
        </div>
        <div className="post-body">
          <div className="caption">{Posts.caption}</div>
          <img
            src={ Posts.postImage}
            width="100%"
          ></img>
        </div>
        <div className="post-foot">
          <div className="interaction">
            <div className="pt-ints">
              <button
                onClick={() => {
                  like("post");
                }}
                className="likes"
              >
                {postLikes ? (
                  <div className="liked">
                    <FavoriteRoundedIcon />
                  </div>
                ) : (
                  <div>
                    <FavoriteBorderRoundedIcon />
                  </div>
                )}
              </button>
              <div className="ints-val">{Likes}</div>
            </div>
            <div className="pt-ints">
              <button
                onClick={(event) => {
                  handleClickCmt(event, Posts.postId, Likes);
                }}
              >
                <CommentIcon />
              </button>
              <div className="ints-val"></div>
            </div>
            <div className="pt-ints">
              <button>
                <SendIcon />
              </button>
              <div className="ints-val">{}</div>
            </div>
            <div className="save">
              <button>
                <StarBorderIcon />
              </button>
            </div>
          </div>
          <div className="comment">
            <input
              type="text"
              name="comment"
              id="cmnt"
              placeholder="Add Comment"
            />
          </div>
        </div>
      </article>
    </div>
  );
}

export default Post ;