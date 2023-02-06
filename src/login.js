
// Login form validation

var username__error = document.getElementById('username__error');
var passowrd__error = document.getElementById('passowrd__error');
var login_form = document.getElementById('login__form');
var login__error = document.getElementById('login__error');

var username = document.getElementById('login__username');
var passowrd = document.getElementById('login__password');


  const validateUsername = () => {
    if(username.value.length == 0){
      username__error.innerHTML = "Plese enter your username";
      return false;
    }
    else{
  // username__error.innerHTML = "<i class='fas fa-check-circle' ></i>";

    username__error.innerHTML = "h";
    return true;
    }


  }

  const validatePassoword = () => {

    if(passowrd.value.length == 0){
      password__error.innerHTML = "Plese enter your Password";
      return false;
    }
    else{
    // password__error.innerHTML = "<i class='fas fa-check-circle' ></i>";
    password__error.innerHTML = "h";
    return true;
    }

  }


  const auth = (username, passowrd) => {
    var message = "";
    var submit = true;
    if(username != "Anathole"){
      message += " <p> username is : Anathole </p> ";
      submit = false;
    }
    

    if(passowrd != "12345"){
      message += " <p> pass is : 12345 </p> ";
      submit = false;

    }

    console.log(message, submit, "auth");

    if(!submit){
      login__error.innerHTML = message;
      return false;
    }

    else{ 
      return true;
    }

  }


login_form.addEventListener('submit', function(e){
  e.preventDefault();

  var valid = true;
  // console.log(validateUsername(),validatePassoword(),auth(username.value, passowrd.value), valid  )

  if(validateUsername() === false){
    valid = false;
    
  }
  if(validatePassoword() === false){
    valid = false;
  }
  // console.log(validateUsername(),validatePassoword(),auth(username.value, passowrd.value), valid )

  if(!auth(username.value, passowrd.value)){

    valid = false;

  }

  console.log(valid);

  if(valid){
    window.location.href = "dashboard/index.html";
  }
});