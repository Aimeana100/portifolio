
// ***************************************************
// BLOG API
//****************************************************/



var Category =  (function() {
    // ===================================
    //|| Private methods and properties ||
    //====================================
  
    categories = [];
  
    // Constructor
    function Item(
      id,
      title,
      status
    ) {
      this.id = id;
      this.title = title;
      this.status = status;
    }
  
    // save categorys to storage
    function saveCategory() {
      window.localStorage.setItem("categories", JSON.stringify(categories));
    }
  
    // load categorys from storage
    function loadCategories() {
  
        categories = JSON.parse(window.localStorage.getItem("categories"));
    }
  
    if (window.localStorage.getItem("categories") != null) {
      loadCategories();
    }
  
    //================================
    // public methods and properties
    //================================
  
    var obj = {};
  
    // Add category
  
    obj.addCategory = (
      id,
      title,
      status
    ) => {
      if(categories.filter(el => {return el.id == id}).length != 0){
          return;
      }
      var item = new Item(
        id,
        title,
        status
      );
  
      categories.push(item);
  
      saveCategory();
  
      return true;
    };
  
  //   update Category
  
  obj.update = ((id, title) => {
      for(let item in categories){
          if(categories[item].id == id){
              categories[item].title = title;
              console.log(categories[item].id,id);
          }
      }
      saveCategory();
      return true;
      
  })
  
    //get a single category
    obj.getCategory = (id) => {
      var category = categories.filter((ele, index) => {
        return ele.id == id;
      });
      return category;
    };
  
    obj.getAllCategories = ()=>{
      return categories;
    }
  
    //   remove a single category
    obj.delete = (id) => {
      categories = categories.filter((ele,index) => {
        return ele.id != id;
      })
    }
  
   //   clear all categorys
   obj.clear = ()=>{
       categories = [];
       saveCategory();
   }
  
  return obj;
  
  })();
  
  // Blog.addBlog(123, "title", "imageURL", "description ..", "category ..", 12, [{}], true);
  // Blog.clear();
  // console.log(Blog.getAllBlogs());
  