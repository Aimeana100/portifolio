
// ***************************************************
// BLOG API
//****************************************************/

var Contact =  (function() {
    // ===============================
    // Private methods and properties
    //================================
  
    contacts = [];
  
    // Constructor
    function Item(
      id,
      name,
      email,
      description
    ) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.description = description;
    }
  
    // save blogs to storage
    function saveContact() {
      window.localStorage.setItem("contacts", JSON.stringify(contacts));
    }
  
    // load blogs from storage
    function loadBlogs() {
  
        contacts = JSON.parse(window.localStorage.getItem("contacts"));
      
    }
  
    if (window.localStorage.getItem("contacts") != null) {
      loadBlogs();
    }
  
    //================================
    // public methods and properties
    //================================
  
    var obj = {};
  
    // Add blog
  
    obj.addContact = (
      id,
      name,
      email,
      description,
    ) => {
      if(contacts.filter(el => {return el.id == id}).length != 0){
          return;
      }
      var item = new Item(
        id,
        name,
        email,
        description
      );
  
      contacts.push(item);
  
      saveContact();
  
      return true;
    };
  
  //   update Blog
  
  obj.update = ((id, name, email, description) => {
      for(let item in contacts){
          if(contacts[item].id == id){
              contacts[item].name = name;
              contacts[item].email = email;
              contacts[item].description = description;
          }
      }
      saveContact();
      
  })
  
    //get a single blog
    obj.getContact = (id) => {
      var contact = contacts.filter((ele, index) => {
        return ele.id == id;
      });
      return contact;
    };
  
    obj.getAllContacts = ()=>{
      return contacts;
    }
  
    //   remove a single blog
    obj.delete = (id) => {
      contacts = contacts.filter((ele,index) => {
        return ele.id != id;
      })
    }
  
   //   clear all blogs
   obj.clear = ()=>{
       contacts = [];
       saveContact();
   }
  
  return obj;
  
  })();
  

  console.log(Contact.getAllContacts());
  