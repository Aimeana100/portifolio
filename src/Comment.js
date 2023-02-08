const loadComments = async (blog_id) => {
  let comments;

  await axios.get(`${baseUrl}/api/comments/all/${blog_id}`).then((res) => {
    console.log(res.data);
    comments = res.data.map((el) => ({ ...el, id: el._id }));
  });

}


const renderComments = (comments) => {
    comments_container.innerHTML = buildComments(comments);
    comments_counts.innerHTML = `${comments.length} <span>Comment(s)</span>`;
  
};

const createBlogComment = () => {

}
