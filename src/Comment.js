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
      status
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.description = description;
      this.blog_id = blog_id;
      this.status = status;
    }
  
    // save comments to storage
    function saveComment() {
      window.localStorage.setItem("comments", JSON.stringify(comments));
    }
  
    // load comments from storage
    function loadComments() {
  
        data = JSON.parse(window.localStorage.getItem("comments"));
      
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
      blog_id,
      status
    ) => {
      if(data.filter(el => {return el.id == id}).length != 0){
          return;
      }
      var item = new Item(
        id,
        name,
        email,
        description,
        blog_id,
        status
      );
  
      comments.push(item);
  
      saveComment();
    };
  
  //   update Comment
  
  obj.update = ((id, name, email, description) => {
      for(let item in data){
          if(comments[item].id == id){
              comments[item].name = name;
              comments[item].email = email;
              comments[item].description = description;
          }
      }
      saveComment();
      
  })
  
    //get a single Comment
    obj.getComment = (id) => {
      var comment = comments.filter((ele, index) => {
        return ele.id == id;
      });
      return comment;
    };
  
    obj.getAllComments = (blog_id)=>{
      return data.filter((el, id)=> {
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
  
  return obj;
  
  })();
  
  // Comment.addComment(123, "title", "imageURL", "description ..", "category ..", 12, [{}], true);
  // Blog.clear();
  // console.log(Blog.getAllBlogs());
  