// Login form validation

let username__error = document.getElementById("username__error");
let passowrd__error = document.getElementById("passowrd__error");
let login_form = document.getElementById("login__form");
let login__error = document.getElementById("login__error");

let username = document.getElementById("login__username");
let passowrd = document.getElementById("login__password");

const validateUsername = () => {
  if (username.value.length == 0) {
    username__error.innerHTML = "Plese enter your username";
    return false;
  } else {
    username__error.innerHTML = "<i class='fas fa-check-circle' ></i>";
    // return true;
  }
};

const validatePassoword = () => {
  if (passowrd.value.length == 0) {
    password__error.innerHTML = "Plese enter your Password";
    return false;
  } else {
    password__error.innerHTML = "<i class='fas fa-check-circle' ></i>";
    // return true;
  }
};

const auth = (username, passowrd) => {
  let message = "";
  let submit = true;

  if (username != "Anathole") {
    message += " <p> username is : Anathole </p> ";
    submit = false;
  }

  if (passowrd != "12345") {
    message += " <p> pass is : 12345 </p> ";
    submit = false;
  }

  console.log(message, submit, "auth");

  if (!submit) {
    login__error.innerHTML = message;
    return false;
  } else {
    return true;
  }
};

login_form.addEventListener("submit", function (e) {
  e.preventDefault();
  let valid = true;

  if (validateUsername() === false) {
    valid = false;
  }
  if (validatePassoword() === false) {
    valid = false;
  }

  if (!valid) {
    return valid;
  }

  //   valid = auth(username.value, passowrd.value);
  valid = login(username.value, passowrd.value);

  if (valid) {
    // window.location.href = "dashboard/index.html";
  }
});

const login = async (email, passowrd) => {
  let mesg = document.querySelector(".add__message");
  mesg.style.padding = "10px";

  await axios
    .post(`${baseUrl}/api/auth/login`, {
      email: email,
      password: passowrd,
    })
    .then((response) => {
      console.log(response);
      mesg.innerText = `${response.data.message}`;
      mesg.style.color = "#2DFA17";
      setTimeout(() => {
        mesg.innerText = "";
        mesg.style.padding = "0px";
        setTimeout(() => {
location.href = `./dashboard/index.html`;
        }, 2000);
      }, 4000);
      Token.saveToken(response.data.accessToken);
      this.reset();
    })
    .catch(async (error) => {

        if(error.response){
            let resCode = error;
      
            mesg.innerText = `Error: ${await loginError(resCode)}`;
            mesg.style.color = "#D16D6A";
      
            setTimeout(() => {
              mesg.innerText = "";
              mesg.style.padding = "0px";
            }, 10000);
      
            return;
        }

    });
};

// hundele unsuccessiful login
const loginError = async (errorCode) => {
  return errorCode.response.data.message;
};
