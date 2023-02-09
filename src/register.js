// Contact Formvalidati
let nameError = document.getElementById("name__error");
let emailError = document.getElementById("email__error");
let passwordError = document.getElementById("password__error");

let formError = document.getElementById("form__error");
let register__form = document.getElementById("register__form");

let formSubmitted = false;

// name validation
const validateName = () => {
  let name = document.getElementById("names").value;

  if (name.length == 0) {
    nameError.innerHTML = "Name is required";
    return false;
  }

  nameError.innerHTML = "<i class='fas fa-check-circle' ></i>";
  return true;
};

const validateEmail = () => {
  let email = document.getElementById("email").value;
  if (email.length == 0) {
    emailError.innerHTML = "Email is required";

    return false;
  }

  if (!email.match(/^[A-Za-z\._\-[0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
    emailError.innerHTML = "Email Invalid";
    return false;
  }

  emailError.innerHTML = "<i class='fas fa-check-circle' ></i>";
  return true;
};

const validatePassoword = () => {
  let passowrd = document.getElementById("password").value;
  let confirm__passowrd = document.getElementById("confirm__password").value;

  if (passowrd != confirm__passowrd) {
    passwordError.innerHTML = "Password does not match";
    return false;
  }
  passwordError.innerHTML = "<i class='fas fa-check-circle' ></i>";
  return true;
};

register__form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (validateForm()) {
    // ===========SAVE The User FORM =======
    let name = document.getElementById("names").value;
    let email = document.getElementById("email").value;
    let passowrd = document.getElementById("password").value;

    register(name, email, passowrd);
  }
});

const validateForm = () => {
  var valid = true;
  formSubmitted = true;

  if (!validateName()) {
    valid = false;
  }

  if (!validateEmail()) {
    valid = false;
  }

  if (!validatePassoword()) {
    valid = false;
  }

  return valid;
};

const register = async (name, email, passowrd) => {
  let mesg = document.querySelector(".add__message");
  mesg.style.padding = "10px";

  await axios
    .post(`${baseUrl}/api/auth/register`, {
      names: name,
      email: email,
      password: passowrd,
    })
    .then((response) => {
      mesg.innerText = "Successfully Registered";
      mesg.style.color = "#2DFA17";

      this.reset();
      setTimeout(() => {
        mesg.innerText = "";
        mesg.style.padding = "0px";
      }, 10000);
      setTimeout(() => {
        window.location.href = `${baseUrl}/auth/login`;
      }, 3000);
      return;
    })
    .catch(async (error) => {
      let resCode = error;
      console.log(resCode);

      mesg.innerText = `Error: ${await registerError(resCode)}`;
      mesg.style.color = "#D16D6A";

      setTimeout(() => {
        mesg.innerText = "";
        mesg.style.padding = "0px";
      }, 10000);

      return;
    });
};

// hundele unsuccessiful registration
const registerError = async (errorCode) => {
  return errorCode.response.data.message;
  // if(errorCode === 404){
  //   return "Invalid URL"
  // }
  // if(errorCode === 409){
  //   return "Email already exists in the system";
  // }
  // if(errorCode === 400){
  //   return 'chech all parameters are valid'
  // }

};
