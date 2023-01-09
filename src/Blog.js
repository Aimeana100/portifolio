
// ***************************************************
// BLOG API
//****************************************************/



export const Blog =  () => {
  // ===============================
  // Private methods and properties
  //================================

  var data = [];

  // Constructor
  function Item(
    id,
    title,
    image,
    description,
    category,
    views,
    created_at,
    status
  ) {
    this.id = id;
    this.title = title;
    this.image = image;
    this.description = description;
    this.category = category;
    this.views = views;
    this.created_at = created_at,
    this.status = status;
  }

  // save blogs to storage
  function saveBlog() {
    window.localStorage.setItem("blogs", JSON.stringify(data));
  }

  // load blogs from storage
  function loadBlogs() {

      data = JSON.parse(window.localStorage.getItem("blogs"));
    
  }

  if (window.localStorage.getItem("blogs") != null) {
    loadBlogs();
  }

  //================================
  // public methods and properties
  //================================

  var obj = {};

  // Add blog

  obj.addBlog = (
    id,
    title,
    image,
    description,
    category,
    views,
    created_at,
    status,
  ) => {
    // if(data.filter(el => {return el.id == id}).length != 0){
    //     return;
    // }
    var item = new Item(
      id,
      title,
      image,
      description,
      category,
      views,
      created_at,
      status
    );

    data.push(item);
    saveBlog();

    return true;
  };

//   update Blog

obj.update = ((id, title, image, category, description) => {
    for(let item in data){
        if(data[item].id == id){
            data[item].title = title;
            image && (data[item].image = image);
            data[item].category = category;
            data[item].description = description;
        }
    }
    saveBlog();
    return true;  
  })

  //get a single blog
  obj.getBlog = (id) => {
    var blog = data.filter((blog, index) => {
      return blog.id == id;
    });
    return blog;
  };

  obj.getAllBlogs = () =>{
    return data;
  }

  //   remove a single blog
  obj.delete = (id) => {
    data = data.filter((blog,index) => {
      return blog.id != id;
    })
    saveBlog();
  }

 //   clear all blogs
 obj.clear = ()=>{
     data = [];
     saveBlog();
 }

  //  burn blog
  obj.burn = (id)=> {
    for(let item in data){

      if(data[item].id == id){
        data[item].status = !data[item].status;
        saveBlog();
        return true;
      }
    }
    
}

// View a blog  || = Increament Views

 obj.addView = (blog_id) =>{
  for(let item in data){
    if(data[item].id == blog_id){
      data[item].views = Number(data[item].views) + 1;
      saveBlog();
      return true;
    }
  }
  
}

return obj;

}

// Blog.addBlog(123, "title", "imageURL", "description ..", "category ..", 12, [{}], true);
// Blog.clear();
// console.log(Blog.getAllBlogs());
