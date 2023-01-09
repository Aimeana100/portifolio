const mobile__nav__toggle = document.getElementById('desktop-nav-toggle');
const desktop__nav__toggle = document.getElementById('mobile-nav-toggle');
const navbar = document.getElementById('navbar');

mobile__nav__toggle.addEventListener('click', e => {

  e.target.style.display = "none";
  navbar.style.display = "none";
  desktop__nav__toggle.style.display = "flex";
});

desktop__nav__toggle.addEventListener('click', e =>{

  e.target.style.display = "none";
  navbar.style.display = "flex";
  navbar.style.transition = "0.5 ease";
  mobile__nav__toggle.style.display = "flex";
});


// scroll && header background

// const scrollDemo = document.querySelector("#contact__me");

// scrollDemo.addEventListener("scroll", event => {
//    console.log(scrollDemo.scrollTop);
// }, { passive: true });



