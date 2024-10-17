import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import MessageIcon from "@mui/icons-material/Message";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useContext, useState } from "react";
import { DataContext } from "../../contexts/ContextProvider";

function Nav() {
  const { setPostFeed, isPostfeed, show, visitUser, Auser, menuItems } =
    useContext(DataContext);
  function handleUser() {
   visitUser(Auser.user);
    if (isPostfeed) {
      setPostFeed(false);
    }
  }

  function showMenu() {
     const pos = {
       top: window.scrollY + 1,
       left: 0,
     };
    show(pos,"menu");
  }

  function HandleHome() {
    if (!isPostfeed) {
      setPostFeed(true);
    }
  }
  function handleCreate() {
    const pos = {
      top: window.scrollY + 1,
      left: 0
    };
    show(pos, "cp");
  }
  return (
    <div className="side-bar">
      <nav>
        <div>
          <div className="items">
            <button className="item-button" onClick={HandleHome}>
              <Link to={`/home?active=${isPostfeed}`}>
                <HomeIcon />
              </Link>{" "}
              <span className="info">Home</span>
            </button>
            <button className="item-button">
              <Link to="home">
                <SearchIcon />
              </Link>{" "}
              <span className="info">Search</span>
            </button>
            <button className="item-button">
              <Link to="home">
                <ExploreIcon />
              </Link>{" "}
              <span className="info">Explore</span>
            </button>
            <button className="item-button">
              <Link to="home">
                <VideoLibraryIcon />
              </Link>{" "}
              <span className="info">Clips</span>
            </button>
            <button className="item-button">
              <Link to="home">
                <MessageIcon />
              </Link>{" "}
              <span className="info">Interactions</span>
            </button>
            <button className="item-button">
              <Link to="home">
                <FavoriteBorderIcon />
              </Link>{" "}
              <span className="info">Notifications</span>
            </button>
            <button className="item-button" onClick={handleCreate}>
              <Link to="">
                <AddCircleIcon />
              </Link>{" "}
              <span className="info">Post+</span>
            </button>
            <button className="item-button" onClick={handleUser}>
              <Link to={`/home?active=${isPostfeed}`}>
                <AccountBoxIcon />
              </Link>{" "}
              <span className="info">View</span>
            </button>
            <button className="item-button nav-menu" onClick={showMenu}>
              <MenuIcon />
              <span className="info">More</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
