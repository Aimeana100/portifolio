
const logout =  () => {

    let logout_user = document.getElementById("logout__user");
    console.log(logout_user);
  
    logout_user && logout_user.addEventListener("click", async (e) => {
      e.preventDefault();
      await axios({
        method: "get",
        url: `${baseUrl}/api/auth/logout`
      })
        .then((response) => {
          console.log(response);
          Token.saveToken('');
          Auth.saveUser({});
        })
        .catch(async (error) => {
          if (error.response) {
           console.log(error);
          }
        });
    });
  
  
  }

  document.addEventListener('DOMContentLoaded', () => {
    logout();
  })

