
// ***************************************************
// Token API
//****************************************************/

const Token = {
     saveToken : (token) => {
      window.localStorage.setItem("tokenString", token);
    },
   loadToken : () => {
  
        return window.localStorage.getItem("tokenString");
    }
}
