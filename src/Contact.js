
      var nameError = document.getElementById("name__error");
      var emailError = document.getElementById("email__error");
      var messageError = document.getElementById("message__error");

      var formSubmitted = false;

      // name validation
      export const validateName = () => {
        var name = document.getElementById("contact__name").value;

        if (name.length == 0) {
          nameError.innerHTML = "Name is required";
          return false;
        }

        // var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

        // if (format.test(name)) {
        //   nameError.innerHTML = "Invalid character";
        //   return false;
        // }

        nameError.innerHTML = "<i class='fas fa-check-circle' ></i>";
        return true;
      };

     export const validateEmail = () => {
        var email = document.getElementById("contact__email").value;

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



      export const validateMessage = () => {

        var message = document.getElementById("contact__message").value;
        var required = 10;
        var left = required - message.length;

        if (left > 0) {
          messageError.innerHTML = " minimum 10 characters";
          return false;
        }
        messageError.innerHTML = "<i class='fas fa-check-circle' ></i>";
        return true;
      };

      
    
      export const validateForm = () => {

        // console.log(formSubmitted);
        var valid = true;
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

        if (valid) {
          return true;
        } else {
          return false;
        }

      };
