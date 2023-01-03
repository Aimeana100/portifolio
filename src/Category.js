
// ***************************************************
// BLOG API
//****************************************************/

  
    // Add category
  
     export default Category = (fn, colRef, data, resFn) => {
      fn(colRef, {
        title: data.title,
        status: data.status,
      }).then(() => {

        // addBlogForm.reset();
        // document.getElementById("imagePreview").innerText = "";
        // document.getElementById("description").value = "";
        
         console.log("Blog Posted successfuly");

        resFn();
        
      });


    };
  
  //   update Category
  
  obj.update = ((id, title) => {
      for(let item in categories){
          if(categories[item].id == id){
              categories[item].title = title;
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
  