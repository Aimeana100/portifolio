// ***************************************************
// BLOG API
//****************************************************/



var Comment =  (function() {
    // ===============================
    // Private methods and properties
    //================================
  
    comments = [];
  
    // Constructor
    function Item(
      id,
      name,
      email,
      description,
      blog_id,
      comment_date,
      status
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.description = description;
      this.blog_id = blog_id;
      this.comment_date = comment_date;
      this.status = status;
    }
  
    // save comments to storage
    function saveComment() {
      window.localStorage.setItem("comments", JSON.stringify(comments));
    }
  
    // load comments from storage
    function loadComments() {
  
      comments = JSON.parse(window.localStorage.getItem("comments"));
      
    }
  
    if (window.localStorage.getItem("comments") != null) {
      loadComments();
    }
  
    //================================
    // public methods and properties
    //================================
  
    var obj = {};
  
    // Add Comment
  
    obj.addComment = (
      id,
      name,
      email,
      description,
      comment_date,
      status,
      blog_id,
    ) => {
      if(comments.filter(el => {return el.id == id}).length != 0){
          return;
      }
      var item = new Item(
        id,
        name,
        email,
        description,
        comment_date,
        status,
        blog_id,
      );
  
      comments.push(item);
  
      saveComment();
      return true;
    };
  
  //   update Comment
  
  obj.update = ((id, description) => {
      for(let item in comments){
          if(comments[item].id == id){
              comments[item].description = description;
              saveComment();
              return true;
          }
      }
  })
  
    //get a single Comment
    obj.getComment = (id) => {
      var comment = comments.filter((ele, index) => {
        return ele.id == id;
      });
      return comment;
    };
  
    obj.getAllComments = (blog_id)=>{
      return comments.filter((el, id)=> {
        return el.blog_id == blog_id;
      });
    }
    
  
    //   remove a single Comment
    obj.delete = (id) => {
      comments = comments.filter((comment,index) => {
        return comment.id != id;
      })
    }
  
   //   clear all comments
   obj.clear = ()=>{
    comments = [];
       saveComment();
   }

  //  
  //  burn Comment
  obj.burn = (id)=> {
    for(let item in comments){
      if(comment[item].id == id){
        comment[item].status = !comment[item].status;
        saveComment();
        return true;
      }
    }
    
}
  
  return obj;
  
  })();
  
  // Comment.addComment(123, "name", "email", "description", "blog_id" , new Date(),true);
  // Blog.clear();
  console.log(Comment.getAllComments("blog_id"));
  