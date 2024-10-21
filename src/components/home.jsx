import Nav from "./sidenav/nav";
import "./home.css";
import Timeline from "./timeLine/Timeline";
import Bottom from "./sidenav/Bottom";
import CommentLayout from "./timeLine/post/CommentLayout";
import Dropdownmenu from "./utilities/Dropdownmenu";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../contexts/ContextProvider";
import Register from "./Register/Register";
import CreatePost from "./timeLine/post/CreatePost";
import { replace, useNavigate } from "react-router-dom";
function Home() {
  console.log(sessionStorage.getItem("authenticated"));
  const {
    showCmt,
    close,
    position,
    setPostFeed,
    showPostModel,
    postID,
    menuItems,
    showMenu,
  } = useContext(DataContext);
  const navigate = useNavigate();
  useEffect(() => {
    setPostFeed(true);
    if (!sessionStorage.getItem("authenticated")) {
      navigate("/", { replace: true });
    }
  },[]);

  return (
    <>
      <div>
        <div className="nav-bar">
          <div className=" header">
            <div className="brand">ConnectV</div>
            <input
              type="search"
              name="search"
              id="searchBar"
              placeholder="Search"
              className="search"
            />
            <button
              className="logOut"
              onClick={() => {
                sessionStorage.removeItem("authenticated");
              }}
            >
              Logout
            </button>
          </div>
        </div>
        <div className="container ">
          <CommentLayout
            show={showCmt}
            close={close}
            position={position}
            postId={postID}
          />
          <Dropdownmenu
            menuItems={menuItems}
            active={showMenu}
            position={position}
          />
          <CreatePost show={showPostModel} close={close} position={position} />
          <div className="navigation">
            <Nav />
          </div>

          <div className="post-feed">
            <Timeline />
          </div>
          <div className="footer">
            <Bottom />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
