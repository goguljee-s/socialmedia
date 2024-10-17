import React, { Children, createContext, useState } from 'react'
const DataContext = createContext();
function ContextProvider({children}) {
  const [showCmt, setShowCmt] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [check, setCheck] = useState(false);
  const [darkMode, setMode] = useState(true);
  const [postID, setPostID] = useState(null);
  const [showPostModel, SetShowPostModel] = useState(false);
  const [position, setPoSition] = useState({ top: 100, left: 0 });
  const [isPostfeed, setPostFeed] = useState(true);
  const [viewUser, setUser] = useState(null);
  const [AId, SetAId] = useState();
  const [loginStatus, setLoginStatus] = useState(
    JSON.parse(sessionStorage.getItem("authenticated"))
  );
  const [menuItems, setMenuItems] = useState([
    {
      name:"Mode",
      function: () => {
        setMode((prev) => (!prev));
    
      }
    },
    {
      name: "Log out",
      function: () => {
        console.log("log out")
        setLoginStatus(false);
        sessionStorage.removeItem("user");
      },
    }
  ])
  const [Auser, setAuser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  function visitUser(user) {
    setUser(user);
    setPostFeed(false);
  }
  function close(type) {
    if (type == "menu") {
      setShowMenu(false);
    }
    else if (type === "cmt") {
      setShowCmt(false);
      document.body.style.overflow = "auto";
    } else {
      SetShowPostModel(false);
    }
  }
  function show(pos, type, postID,likeCount) {
    if (type == "menu") {
      setPoSition(pos);
      setShowMenu(true);
    }
    else if (type === "cmt") {
      SetAId(Auser.userId);
      setPostID(postID);
      setPoSition(pos);
      setShowCmt(true);
      document.body.style.overflow = "hidden";
    } else {
      setPoSition(pos);
      SetShowPostModel(true);
    }
  }
  return (
    <DataContext.Provider
      value={{
        showMenu,
        showCmt,
        setShowCmt,
        show,
        close,
        position,
        isPostfeed,
        setPostFeed,
        visitUser,
        viewUser,
        showPostModel,
        SetShowPostModel,
        Auser,
        postID,
        AId,
        menuItems,
        darkMode,
        loginStatus
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export { ContextProvider, DataContext };