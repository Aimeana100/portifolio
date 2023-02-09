
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

 const isValidToken = (token) => {
  cTs=Math.floor(Date.now() / 1000);
  return (token>=cTs);
}
