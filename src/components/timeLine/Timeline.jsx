import React, { useContext, useState,useEffect,useRef } from 'react'
import Post from './post/post';
import UserView from '../userView/UserView';
import { DataContext } from '../../contexts/ContextProvider';
function Timeline() {

  const { isPostfeed} = useContext(DataContext);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const callCountRef = useRef(0);
  useEffect(() => {
     async function fetchData() {
       try {
         const res = await fetch(`http://localhost:8000/posts/${page}`);
         if (res.status == 200) {
           const jsonData = await res.json();
             setData((Data) => [...Data, ...jsonData]);
         }
       } catch (e) {
         console.log(e);
       }
     }
     fetchData();
   }, [page]);
  
  useEffect(() => {
    function scrollEvent() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
         
            setPage((page) => (page + 1));
          
      }
    }
      window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent) 
      setPage(1);
      setData([]);
    };
  }, []);
  return (
    <div className="timeline">
      <div className={isPostfeed ? "post-timeline active" : "post-timeline"}>
        <div className="t-posts">
          <div className="post">
            {data.map((post) => (
              <div key={post.postId}>
                <Post Posts={post} />
              </div>
            ))}
          </div>
          <div className="suggestions">suggestions</div>
        </div>
      </div>
      <div className={!isPostfeed ? "user-timeline active" : "user-timeline"}>
        <UserView />
      </div>
    </div>
  );
}

export default Timeline