import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import MessageIcon from "@mui/icons-material/Message";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { DataContext } from '../../contexts/ContextProvider';
function Bottom() {
  const { isPostfeed, setPostFeed,visitUser,Auser } = useContext(DataContext);

  function handleUser() {
    visitUser(Auser.user);
    if (isPostfeed) {
      setPostFeed(false);
    }
  }

  function HandleHome() {
    if (!isPostfeed) {
      setPostFeed(true);
    }
  }
  return (
    <div className="bottom-nav">
      <nav>
        <div>
          <div className="itemss">
            <button className="item-button" onClick={HandleHome}>
              <Link to={`/home?active=${isPostfeed}`} >
                <HomeIcon />
              </Link>
            </button>
            <button className="item-button">
              <Link to="">
                <ExploreIcon />
              </Link>
            </button>
            <button className="item-button">
              <Link to="">
                <VideoLibraryIcon />
              </Link>
            </button>
            <button className="item-button">
              <Link to="">
                <AddBoxIcon />
              </Link>
            </button>
            <button className="item-button">
              <Link to="">
                <MessageIcon />
              </Link>
            </button>
            <button className="item-button" onClick={handleUser}>
              <Link to={`/home?active=${isPostfeed}`} >
                <AccountBoxIcon />
              </Link>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Bottom