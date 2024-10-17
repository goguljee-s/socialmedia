import React, { useContext, useRef, useState } from 'react'
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { DataContext } from '../../../contexts/ContextProvider';
function CreatePost({ show, close, position }) {
  const form = useRef();
  const { Auser } = useContext(DataContext);
  const [postForm, setPostForm] = useState({
    userId:(Auser!=undefined)?Auser.user.userId:"",
    date: new Date().toISOString(),
    postId:(Auser!=undefined)?formatDate(new Date())+""+Auser.user.userId:"",
    caption: "",
    postImage: "",
    likeCount: 0,
    comments: [],
  });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  function handleChange(e) {
    console.log(postForm);
    if (e.target.name == "url") {
      setPostForm((form) =>( { ...form, postImage: e.target.value }))
    }
    if (e.target.name == 'caption') {
      setPostForm((form) => (
        { ...form, caption: e.target.value })
       );
    }
  }
  async function postData(Data) {
    console.log(Data)
    try {
      const res = await fetch(`http://localhost:8000/addposts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: Data ,id:Auser.user.userId}),
      });

      if (!res.ok) {
        alert("Error posting the data")
      }
    } catch (e) {
      console.log(e);
    }
  }
  function post(e) {
    e.preventDefault();
    console.log(Auser)
    if (Auser.user.userId) {
      if (postForm.postImage != "" && postForm.caption != "") {
        postData(postForm);
        close("cp");
        form.current.reset();
      }
    } else {
      console.error("Auser.userId is ", Auser.userId);
    }
  }
    return (
      <div
        className={show ? "create-post cp" : "create-post"}
        style={{
          top: position.top,
          left: position.left
        }}

       
      >
        <div className="create" >
          <div className="close-cp">
            <button className="cls-cpbtn" onClick={() => close("cp")}>
              <CloseSharpIcon />
            </button>
          </div>
          <form action="" onSubmit={post} className="cp-form" ref={form}>
            <div className="inputfield">
              <label htmlFor="Image">Image URL</label>
              <input type="text" name="url" id="" onChange={handleChange}/>
            </div>
            <div className="inputfield">
              <label htmlFor="caption">Caption</label>
              <textarea name="caption" id="" onChange={handleChange}></textarea>
            </div>
            <div className="inputfield">
              <input type="submit" value="Post" id="post-btn" />
            </div>
          </form>
        </div>
      </div>
    );
  }

export default CreatePost