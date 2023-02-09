
// ***************************************************
// User API
//****************************************************/



var Auth =  (function() {
    // ===================================
    //|| Private methods and properties ||
    //====================================
  
    auth = [];
  
    // Constructor
    function Item(
      name,
      password,
      expires
    ) {
      this.name = name;
      this.password = password;
      this.expires = expires;
    }
  
    // save Login
    function saveAuth() {
      window.localStorage.setItem("auth", JSON.stringify(auth));
    }
  
    // load Auth from storage
    function loadAuth() {
        users = JSON.parse(window.localStorage.getItem("auth"));
    }
  
    if (window.localStorage.getItem("auth") != null) {
      loadAuth();
    }
  
    //================================
    // public methods and properties
    //================================
  
    var obj = {};
  
    // Add category
  
    obj.Login = (
        name,
        password,
        expires
    ) => {
        if(typeof auth[0] != "undefined"){
            return false;
        }
      var item = new Item(
        name,
        password,
        expires
      );

      auth[0] = item;
      saveAuth();
      return true;
    };
  
  //   getAuth
  obj.getUser = ((name, password) => {
      for(let item in auth){
          if(auth[item].name == name && auth[item].password == password ){
              return true;
          }
      }
      return false;
  })
  
    //get a single user
    obj.Logout = () => {
        auth = [];
        saveAuth();
      return true;
    };
  
    obj.authenticate = (loginId,loginValue ,expires)=>{
        const d = new Date();
        d.setTime(d.getTime() + (expires*60*60*1000));
        let exp = "expires="+ d.toUTCString();
        document.cookie = loginId + "=" + loginValue + ";" + exp + ";path=/";
      
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
  