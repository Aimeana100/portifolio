
// ***************************************************
// User API
//****************************************************/



var User =  (function() {
    // ===================================
    //|| Private methods and properties ||
    //====================================
  
    users = [];
  
    // Constructor
    function Item(
      id,
      name,
      image,
      email,
      Password,
      status
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.Password = Password;
      this.status = status;
    }
  
    // save users to storage
    function saveUser() {
      window.localStorage.setItem("users", JSON.stringify(users));
    }
  
    // load Users from storage
    function loadUsers() {
  
        users = JSON.parse(window.localStorage.getItem("users"));
    }
  
    if (window.localStorage.getItem("users") != null) {
      loadUsers();
    }
  
    //================================
    // public methods and properties
    //================================
  
    var obj = {};
  
    // Add category
  
    obj.addUser = (
        id,
        name,
        email,
        image,
        Password,
        status
    ) => {
      if(users.filter(el => {return el.id == id}).length != 0){
          return;
      }
      var item = new Item(
        id,
        name,
        email,
        image,
        Password,
        status
      );
  
      users.push(item);
  
      saveUser();
  
      return true;
    };
  
  //   update User
  
  obj.update = ((id, name, email) => {
      for(let item in users){
          if(users[item].id == id){
              users[item].name = name;
              users[item].email = email;
              saveUser();
              return true;
          }
      }
  })
  
    //get a single user
    obj.getUser = (id) => {
      var category = users.filter((ele, index) => {
        return ele.id == id;
      });
      return category;
    };
  
    obj.getAllUsers = ()=>{
      return users;
    }
  
    //   remove a single user
    obj.delete = (id) => {
      users = users.filter((ele,index) => {
        return ele.id != id;
      })
    }
  
   //   clear all users
   obj.clear = ()=>{
       users = [];
       saveUser();
   }
  
  return obj;

  })();
  
  
  // User.addBlog(123, "name","email", "imageURL", "password", true);
  // User.clear();
  // console.log(User.getAllUsers());
  