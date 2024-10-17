import React, { useContext, useEffect, useRef, useState } from 'react'
import SendIcon from "@mui/icons-material/Send";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import VisibilitySharpIcon from "@mui/icons-material/VisibilitySharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import ReplyIcon from "@mui/icons-material/ReplyRounded";
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { DataContext } from '../../../contexts/ContextProvider';
function CommentLayout({ show, close, position, postId}) {
  const { Auser ,showCmt,AId} = useContext(DataContext);
  const [liked, setLiked] = useState(false);
  const [postLikes, setPostLike] = useState(false);
  const [CmtPg, setCmtPg] = useState(1);
  const [cmts, setCmts] = useState([]);
  const [data, setData] = useState({});
  const inpuTcmt = useRef();
  const cmtBodyRef = useRef();
  useEffect(() => {
      if (showCmt) {
        fetchComment(postId);
      }
  }, [showCmt,CmtPg]);
  useEffect(() => {
    if (showCmt) {
      fetchPost(postId);
    }
  },[showCmt])
   useEffect(() => {
     function scrollEvent() {
       const cmtBody = cmtBodyRef.current;
       if (showCmt) {
         if (cmtBody.scrollHeight > cmtBody.clientHeight) {
           if (
             cmtBody.scrollTop + cmtBody.clientHeight >=
             cmtBody.scrollHeight - 500
           ) {
             console.log("scroll");
             setCmtPg((cmtPage) => cmtPage + 1);
           }
         }
         console.log(cmtBody)
       }
     }
     window.addEventListener("scroll", scrollEvent);
     return () => window.removeEventListener("scroll", scrollEvent);
   }, []);
  
   async function fetchComment(postId) {
     try {
       const res = await fetch(
         `http://localhost:8000/posts/${postId}/${CmtPg}`,
         {}
       );
       if (res.status == 200) {
         const data = await res.json();
         console.log(true);
         setCmts((cmts) => [...cmts, ...data]);
       } else {
         console.log("Error Fetching comment");
       }
     } catch (error) {
       console.log(error);
       console.log("error in api call");
     }
   }
  async function fetchPost(postId) {
    console.log(postId)
    const res = await fetch("http://localhost:8000/posts/getpost/", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        postId: postId,
        userId: Auser.user.userId
      })
    });
    if (res.status == 200) {
      const resData = await res.json();
      setData(resData);
    } else {
      console.log("error fetching post");
    }
  }
  
  function like(type) {
    if (type === 'cmt') {
      if (liked) {
        setLiked(false);
      } else {
        setLiked(true);
      }
    } else {
      if (postLikes) {
        setPostLike(false);
      } else {
        setPostLike(true);
      }
    }
  }

  function addCmt(postId) {
    if (inpuTcmt.current.value.length) {
      addCmtToDB(inpuTcmt.current.value, postId);
      inpuTcmt.current.value = "";
    }
  }

  async function addCmtToDB(cmt, postId) {
    console.log(cmt, postId);
    console.log(Auser.user.userId);
    const res = await fetch("http://localhost:8000/posts/add/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        userId: Auser.user.userId,
        postId: postId,
        data:cmt
      })
    });
    if (res.status == 200) {
      const data = await res.json();
      setCmts((cmts) => ([...cmts, data]));
    }
  }
  return (
    <>
      {showCmt && (
        <div
          className="comment-view"
          style={{ top: position.top, left: position.left }}
        >
          <div className="close">
            <button
              className="cls-btn"
              onClick={() => {
                setData();
                close("cmt");
                setCmts([]);
                setCmtPg(1);
              }}
            >
              <CloseSharpIcon />
            </button>
          </div>
          <div className="pt-container mobile">
            {/* <div className="close-btn">X</div> */}
            <div className="post-image">
              <img
                src={data != undefined ? data.postImage : ""}
                alt=""
                width="100%"
                height="100%"
              />
            </div>
            <div className="comment-box">
              <div className="comment-header">
                <div className="comment-title">Comments</div>
                <div className="pt-ints">
                  <VisibilitySharpIcon />
                  <div>{cmts.length}</div>
                </div>
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
                  <div>{data != undefined ? data.likeCount :0}</div>
                </div>
                <div className="pt-ints">
                  <SendIcon />
                  <div>20k</div>
                </div>
              </div>
              <div className="comments-body" ref={cmtBodyRef}>
                {cmts.map((cmt) => (
                  <div className="ct-container">
                    <img
                      src={cmt.profileImage}
                      id="avatar"
                      className="cnt-pro"
                    />
                    <div className="cmnt-cnt">
                      <div>{cmt.name}</div>
                      <div className="cnt">
                        <p>{cmt.comment}</p>
                      </div>
                      <div className="reply">reply</div>
                    </div>
                    <div className="right">
                      <button
                        onClick={() => {
                          like("cmt");
                        }}
                        className="likes"
                      >
                        {liked ? (
                          <div className="liked">
                            <FavoriteRoundedIcon />
                          </div>
                        ) : (
                          <div>
                            <FavoriteBorderRoundedIcon />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="comments-footer">
                <div className="add-cmnt">
                  <div className="cmnt-in">
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Add comment"
                      ref={inpuTcmt}
                    />
                  </div>
                  <button
                    className="post-cmnt"
                    onClick={() => {
                      addCmt(postId);
                    }}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommentLayout