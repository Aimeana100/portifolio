
      let nameError = document.getElementById("name__error");
      let emailError = document.getElementById("email__error");
      let messageError = document.getElementById("message__error");


      let formSubmitted = false;

      // name validation
       const validateName = () => {
        let name = document.getElementById("contact__name").value;

        if (name.length == 0) {
          nameError.innerHTML = "Name is required";
          return false;
        }
   
        nameError.innerHTML = "<i class='fas fa-check-circle' ></i>";
        return true;
      };

      const validateEmail = () => {
        let email = document.getElementById("contact__email").value;

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



       const validateMessage = () => {

        let message = document.getElementById("contact__message").value;
        let required = 10;
        let left = required - message.length;

        if (left > 0) {
          messageError.innerHTML = " minimum 10 characters";
          return false;
        }
        messageError.innerHTML = "<i class='fas fa-check-circle' ></i>";
        return true;
      };

      
    
       const validateForm = () => {

        let valid = true;
        formSubmitted = true;

        if (!validateName()) {
          valid = false;
        }

        if (!validateEmail()) {
          valid = false;
        }

        if (!validateMessage()) {
          valid = false;
        }

        return (valid);

      };



// Add a contact from front end
let formError = document.getElementById("form__error");
let contact__me__form = document.getElementById("contact__me__form");

contact__me__form &&
  contact__me__form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      // ===========SAVE The Contact FORM =======

      let name = document.getElementById("contact__name").value;
      let email = document.getElementById("contact__email").value;
      let description = document.getElementById("contact__message").value;

      contact(name, email, description);

    }
  });



const contact = async ( name,email,description ) => {

  let mesg = document.querySelector(".add__message");
  mesg.style.padding = "10px";

  await axios
    .post(`${baseUrl}/api/contacts/add`, {
      names : name,
      email: email,
      description: description,
    })
    .then((response) => {

      contact__me__form.reset();
      let mesg = document.querySelector(".add__message");
      mesg.style.padding = "10px";
      mesg.style.color = "green";
      mesg.innerText = "Thank you, we will reply via the email asp";
      contactForm.reset();

      setTimeout(() => {
        mesg.innerText = "";
        mesg.style.padding = "0px";
      }, 10000);

    })
    .catch(async (error) => {

        if(error.response){
            let resCode = error;
            console.log(resCode);
            mesg.innerText = `Error: ${await contactError(resCode)}`;
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
const contactError = async (errorCode) => {
  return errorCode.response.data.message;
};


// List all contacts queries in dashboard

const listContacts = async () => {
  let contacts = [];

  await axios({
    method: "post",
    url: `${baseUrl}/api/contacts/all`,
    headers: { 
      "token": localStorage.getItem("token"),
   },
  })
    .then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });


let contacts_container = document.querySelector(".contacts .contact__row");

if (contacts_container) {
  contacts_container.innerHTML = buildContactsList(contacts);
}

let cantct = document.getElementById("card__number__contacts");
if (cantct) {
  cantct.innerText = contacts.length;
}

}

listContacts();


