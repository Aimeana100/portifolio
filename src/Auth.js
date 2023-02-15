
const Auth = {
  saveUser : (user) => {
    window.localStorage.setItem("user", JSON.stringify(user) );
  }
  ,
  loadUser : () => {
   return JSON.parse(window.localStorage.getItem("user") );
  }
}

 const isValidToken = (token) => {
  cTs=Math.floor(Date.now() / 1000);
  return (token>=cTs);
}
