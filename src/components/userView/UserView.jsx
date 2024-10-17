import React, { useContext, useEffect, useState } from 'react'
import Post from '../timeLine/post/post'
import UeserPost from './UeserPost';
import CollectionsIcon from "@mui/icons-material/Collections";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { DataContext } from '../../contexts/ContextProvider';

function UserView() {
  const { show, viewUser } = useContext(DataContext);
  const [posts, setPost] = useState([]);
  const [page, setPage] = useState(0);
  function handleClick(event, postId) {
    setPage(0);
    console.log("clicked");
    const rect = event.target.getBoundingClientRect();
    const pos = {
      top: window.scrollY + 1,
      left: 0,
    };
    show(pos,"cmt",postId);
  }
  useEffect(() => {
    if (viewUser) {
      fetchUserPost();
    }
    return (() => {
      setPost([]);
      setPage(0);
    })
  },[viewUser])

   
  useEffect(() => {
    function scrollEvent() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 100
      ) {
        setPage(page + 1);
      }
    }
    window.addEventListener("scroll", scrollEvent);
    return () => window.removeEventListener("scroll", scrollEvent);
  }, []);
  async function fetchUserPost() {
    const url = `http://localhost:8000/userposts/${viewUser.userId}/${page}`;
      const res = await fetch( url);
      if (res.status == 200) {
        const postData = await res.json();
        setPost((post) => [...post, ...postData]);
        console.log(postData,"true")
      } else {
      
        console.log("error in fetching post")
      }
    
  }
  if (viewUser) {
    return (
      <div className="us-container">
        <div className="us-header">
          <div className="us-profile">
            <img
              src={viewUser.profileImage}
              alt=""
              className="rounded-us-pic"
            />
            <div className="us-pname">{viewUser.name}</div>
          </div>
          <div className="us-details">
            <div className="us-name">
              <button className='edit'>Edit Profile</button>
              <button className='setting'>Setting</button>
            </div>
            <div className="us-content">
              <div>Followers 300</div>
              <div>Folowing 500</div>
            </div>
          </div>
        </div>
        <div className="us-post-container">
          <div className="tab-containers">
            <div className="tab active-tab">
              <CollectionsIcon />
            </div>
            <div className="tab">
              <VideoLibraryIcon />
            </div>
          </div>
          <div className="us-posts">
            {posts.map((post) => (
              <div className="us-flex-item" onClick={(event) => { handleClick(event,post.postId)}}>
                <UeserPost  post={post.postImage} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default UserView