import React from 'react'

function UeserPost({post}) {
  return (
    <div className="post" key={post.postId}>
      <div className="post-body-us" >
        <img
          src={post}
        ></img>
      </div>
    </div>
  );
}

export default UeserPost