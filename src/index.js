import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  buildBlogCategoryList,
  buildBlogList,
  buildCategoriesList,
  buildComments,
  buildContactsList,
  buildLatestBlogs,
  buildProjects,
  convertDateToString,
  fileValidation,
  mostViewedBlogs,
  populateCategory,
  populateEditCategory,
  populateEditForm,
} from "./functions";

// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";

import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy,
  getDoc,
  updateDoc,
  collectionGroup,
  Timestamp,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { validateForm } from "./Contact";

const firebaseConfig = {
  apiKey: "AIzaSyB-Zt1GfiH3rjQbPMITywFeU-NZdRFG5vw",
  authDomain: "portifoilio.firebaseapp.com",
  projectId: "portifoilio",
  storageBucket: "portifoilio.appspot.com",
  messagingSenderId: "963289524335",
  appId: "1:963289524335:web:f5f2c0d4404c457d36859a",
  measurementId: "G-1V3GVQ4HZB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// init analitics
const analytics = getAnalytics(app);

// init services
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

// ==========================================================
//======================= Get DOM variabels =================
//===========================================================

const addCategoryFrm = document.getElementById("addCategoryFrm");

// |======================Blog Category ===============|
// |  |||||||||||||||||||||||       |||||||||||||||||| |
// |===================================================|

// collection reff
const colRef_category = collection(db, "categories");
const colRef_blog = collection(db, "blogs");
const colRef_project = collection(db, "projects");

// ADD a CATEGORY
addCategoryFrm &&
  addCategoryFrm.addEventListener("submit", (e) => {
    e.preventDefault();
    var title = addCategoryFrm.title.value;
    var status = true;

    addDoc(colRef_category, {
      title: title,
      status: status,
    }).then(() => {

      addCategoryFrm.reset();
      var mesg = document.querySelector(".add__message");
      mesg.style.padding = "10px";
      mesg.innerText = "Category created successfully";
      setTimeout(() => {
        mesg.innerText = "";
        mesg.style.padding = "0px";
      }, 3000);
    });

  });

// Populate CATEGORIES in drop downs
// real time collecction data
let categories = [];
const cat_query = query(colRef_category);
onSnapshot(cat_query, (snapshot) => {
   categories = [];
  snapshot.docs.forEach((doc) => {
    categories.push({ ...doc.data(), id: doc.id });
  });

  //
  var categ = document.getElementById("category");
  categ && populateCategory(categories, "");

  // list categories in dashboard
  var tblBody = document.querySelector("table#categories tbody");
  if (tblBody) {
    tblBody.innerHTML = buildBlogCategoryList(categories);
  }

  // handle status change in dashboard
  var statusBtnCat = document.querySelectorAll("table#categories  td .status");
  statusBtnCat.forEach(function (ele, index) {
  ele.addEventListener("click", function (e) {


    var Bid = this.getAttribute("cat_id");
    var statusI = this.getAttribute("status");
    var newStatus = statusI == "true" ? false : true;

    console.log(Bid, newStatus , statusI);

    const docCategRef = doc(db, "categories", Bid);
    updateDoc(docCategRef, {
      status: newStatus,
    })
  });
});

if(tblBody){

  new MutationObserver( (mutationList, observer) => {
    for(const mutation of mutationList ){
      if(mutation.type === 'childList'){

        var statusBtnCat = document.querySelectorAll("table#categories  td .status");
          statusBtnCat.forEach(function (ele, index) {
          ele.addEventListener("click", function (e) {
          
            var Bid = this.getAttribute("cat_id");
            var statusI = this.getAttribute("status");
            var newStatus = statusI == "true" ? false : true;
            const docCategRef = doc(db, "categories", Bid);
            updateDoc(docCategRef, {
              status: newStatus,
            })
          });
        });

      }
    }
  }).observe(tblBody, { childList: true, subtree: true});
  
}


  // list categories on blogs and single blog page
  var all__category_container = document.querySelector(
    ".right__summary .categories"
  );

  if (all__category_container) {
    all__category_container.innerHTML = buildCategoriesList(categories);
  }

  // =========== Edit CATEGORY ===============
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has("category_id")) {
    const id = urlParams.get("category_id");
    populateEditCategory(
      categories.filter((ele) => {
        return ele.id == id;
      })[0]
    );
  }

  // counts card in dashbord
  var catgr = document.getElementById("card__number__categories");
  if (catgr) {
    catgr.innerText = categories.length;
  }
});

// ===== Update  blog category form ====
const updateCategoryForm = document.getElementById("editCategoryFrm");
updateCategoryForm &&
  updateCategoryForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var title = updateCategoryForm.title.value;
    var id = updateCategoryForm.id.value;
    var status = true;

    const docRef_categories = doc(db, "categories", id);
    updateDoc(docRef_categories, {
      title: title,
    }).then(() => updateCategoryForm.reset());

    var mesg = document.querySelector(".add__message");
    mesg.style.padding = "10px";
    mesg.innerText = "Blog Category Updated successfully";
    updateCategoryForm.reset();
    setTimeout(() => {
      mesg.innerText = "";
      mesg.style.padding = "0px";
      window.location.href = "category.html";
    }, 3000);
  });


// |======================Blog=========================|
// |  |||||||||||||||||||||||       |||||||||||||||||| |
// |===================================================|

// List blogs in dashboard

// real time collecction data
const blogs_query = query(colRef_blog, orderBy("created_at"));

// document.addEventListener("DOMSubtreeModified", (evnt) => {

onSnapshot(blogs_query, (snapshot) => {
  let blogs = [];
  snapshot.docs.forEach((doc) => {
    let comm = [];
    onSnapshot(query(collection(db, `blogs/${doc.id}/comments`)), (snapshot) =>{
      snapshot.docs.forEach(doc => {
        comm.push({...doc.data(), id: doc.id});
      })
    })

    blogs.push({ ...doc.data(), id: doc.id , comments : comm});
  });

  var tblBody = document.querySelector("table#blogs tbody");
  if (tblBody) {
    tblBody.innerHTML = buildBlogList(blogs);
  }


  var categoriesList = document.querySelector(".form-content #category");
  // console.log(categoriesList, populateCategory(categories, ""));
  if (categoriesList) {
    categoriesList.innerHTML = populateCategory(categories, "");
  }

  // dashboard blogs counts
  var blg = document.getElementById("card__number__blogs");
  if (blg) {
    blg.innerText = blogs.length;
  }

  // render latest blog
  var latest__blog = document.querySelector(".latest__blog.blogs_container");

  if (latest__blog) {
    latest__blog.innerHTML = buildLatestBlogs(blogs, 6);

  }

  // most viewed blogList on single blog
  var all__most_viewd_container = document.querySelector(
    ".right__summary .most_viewed_blogs"
  );
  if (all__most_viewd_container) {
    all__most_viewd_container.innerHTML = mostViewedBlogs(blogs);
  }

  // List all blogs in blogs page
  var all__blog_container = document.querySelector(
    ".all__blogs .blogs_container"
  );
  if (all__blog_container) {
    all__blog_container.innerHTML = buildLatestBlogs(blogs, 8);

  }

  // change status b
  var statusBtn = document.querySelectorAll("table#blogs td .status");
  statusBtn.forEach(function (ele, index) {
    ele.addEventListener("click", function (e) {
      e.preventDefault();
      var Bid = this.getAttribute("blog_id");
      var statusI = this.getAttribute("status");
      var newStatus = statusI == "true" ? false : true;

      const docRef = doc(db, "blogs", Bid);

      updateDoc(docRef, {
        status: newStatus,
      })
    });
  });

  if(tblBody){
    new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
  
          var statusBtn = document.querySelectorAll("table#blogs td .status");
          statusBtn.forEach(function (ele, index) {
            ele.addEventListener("click", function (e) {
            
              var Bid = this.getAttribute("blog_id");
              var statusI = this.getAttribute("status");
              var newStatus = statusI == "true" ? false : true;
              const docRef = doc(db, "blogs", Bid);
              updateDoc(docRef, {
                status: newStatus,
              })
            });
          });
        }
      }
    }).observe(tblBody, { attributes: true, childList: true, subtree: true });
  
  }


//////////////// Increment view number of a blog ///////////////////////////////


  var read__more = document.querySelectorAll(
    '#blogs .item .description .read__more, .latest__blog .item .description .read__more, .blog__item .description .read__more'
    );

  read__more && read__more.forEach((ele)=>{
  ele.addEventListener("click", function(e){
  e.preventDefault();

  var blog_id = this.getAttribute('blog_id');
  var views = this.getAttribute('views');

 const docRef_blog = doc(db, "blogs", blog_id);
 updateDoc(docRef_blog, {
  views: Number(views) + 1,
 }).then(() => {
  window.location.href = "blog-single.html?blog="+blog_id;
 })

})
})


  // =========== Edit Blog ===============
  // const queryString = window.location.search;
  // const urlParams = new URLSearchParams(queryString);

  if (urlParams.has("edit_blog")) {
    const edit_blog = urlParams.get("edit_blog");
    var blog = blogs.filter((ele) => {
      return ele.id == edit_blog;
    })[0];

    if(edit_blog) {
      if (categoriesList) {
        categoriesList.innerHTML = populateCategory(categories, blog.category);
      }
      populateEditForm(blog);
    }

  }
});


// real time collecction data
const projects_query = query(colRef_project, orderBy("created_at"));

// document.addEventListener("DOMSubtreeModified", (evnt) => {

onSnapshot(projects_query, (snapshot) => {
  let projects = [];
  snapshot.docs.forEach((doc) => {
    projects.push({ ...doc.data(), id: doc.id});
  });

  // render projects
var projects_container = document.querySelector('.form-content.projects-content');

projects_container.innerHTML = buildProjects(projects);





});







/// Render a single blog and comments
var comments_container = document.querySelector(
  ".comments__list .comment__content"
);
var date__published = document.querySelector(".blog__content .date__published");
var comments_counts = document.querySelector(".comments__list .comment__title");
var commentFrm = document.getElementById("commentFrm");

// =====Get single Doc =========
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has("blog")) {
  const blog_id = urlParams.get("blog");

  const docRef_single_blog = doc(db, "blogs", blog_id);

  // console.log(docRef);
  onSnapshot(docRef_single_blog, (doc) => {
    // populateEditForm({...doc.data(), id: doc.id});

    var title = document.querySelector(
      ".blog__single__container .blog__content .title"
    );
    var desc = document.querySelector(
      ".blog__single__container .blog__content .blog__content_text"
    );
    var img = document.querySelector(".blog__single__container .blog__img img");

    var single_blg = { ...doc.data(), id: doc.id };

    title.innerText = single_blg.title;
    desc.innerHTML = single_blg.description;
    img.setAttribute("src", single_blg.image);
    date__published.innerHTML = `<img src="assets/images/Alarm.svg" alt="" /> ${convertDateToString(
      single_blg.created_at
    )}`;

  });

  // retrive comments for a certain blog
  const docRef_single_blog_comments = collection(
    db,
    `blogs/${blog_id}/comments`
  );
  const blogs_query = query(
    docRef_single_blog_comments,
    orderBy("comment_date", "desc")
  );

  onSnapshot(blogs_query, (snapshot) => {
    let comments = [];
    snapshot.docs.forEach((doc) => {
      comments.push({ ...doc.data(), id: doc.id });
    });

    comments_container.innerHTML = buildComments(comments);
    comments_counts.innerHTML = `${comments.length} <span>Comment(s)</span>`;
  });

  // add a comments on a blog
  commentFrm &&
    commentFrm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = this.Names.value;
      var email = this.Email.value;
      var description = this.comment__description.value;
      const blog_id = urlParams.get("blog");

      addDoc(docRef_single_blog_comments, {
        name: name,
        email: email,
        description: description,
        comment_date: serverTimestamp(),
      }).then(() => {
        commentFrm.reset();
      });
    });
  }



// adding a blog
var image = document.getElementById("image");
var fileItem;
var fileName;
var uploadedImageURL;

function getFile(e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
}

// on Image file selection from files
image &&
  image.addEventListener("change", (e) => {
    getFile(e);
    if (!fileValidation("image")) {
      return false;
    }
  });


// ===== Adding blog ====

const addBlogForm = document.getElementById("addBlogFrm");
addBlogForm &&
  addBlogForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var title = addBlogForm.title.value;
    var description = addBlogForm.description.value;
    var category = addBlogForm.category.value;
    var views = 0;
    var status = true;

    let storageRef = ref(storage, "images/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileItem);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
        alert("Some problem in upload");
        return false;
      },
      () => {
        // On successful image uploads
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          uploadedImageURL = downloadURL;

          //adding

          var res = addDoc(colRef_blog, {
            title: title,
            category: category,
            description: description,
            created_at: serverTimestamp(),
            image: uploadedImageURL,
            views: views,
            status: status,
            comments: "",
          }).then(() => {
            addBlogForm.reset();
            document.getElementById("imagePreview").innerText = "";
            document.getElementById("description").value = "";
            var mesg = document.querySelector(".add__message");
            mesg.style.padding = "10px";
            mesg.innerText = "Blog created successfully";
            addBlogForm.reset();
            setTimeout(() => {
              mesg.innerText = "";
              mesg.style.padding = "0px";
            }, 3000);
          });
        });
      }
    );
  });


// ===== Updating blog ====
const editBlogForm = document.getElementById("editBlogFrm");
editBlogForm &&
  editBlogForm.addEventListener("submit", (e) => {
    e.preventDefault();

    var id = editBlogForm.id.value;
    var title = editBlogForm.title.value;
    var description = editBlogForm.description.value;
    var category = editBlogForm.category.value;

    const reader = new FileReader();
    // fileItem : @an instance of selected file image,

    let storageRef = ref(storage, "images/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileItem);

    if (typeof fileItem != "undefined") {

      reader.readAsDataURL(fileItem);
      reader.addEventListener("load", function (ev) {

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log(error);
            alert("Some problem in upload");
            return false;
          },
          () => {
            // On successful image uploads
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              uploadedImageURL = downloadURL;

              console.log(downloadURL);

              // updating
              const docRef_blog = doc(db, "blogs", id);
              updateDoc(docRef_blog, {
                title: title,
                description: description,
                image: downloadURL,
                category: category,
              }).then(() => {
                editBlogForm.reset();
                var mesg = document.querySelector(".add__message");
                mesg.style.padding = "10px";
                mesg.innerText = "Blog Updated successfully";
                setTimeout(() => {
                  mesg.innerText = "";
                  mesg.style.padding = "0px";
                  window.location.href = "blogs.html";
                }, 4000);
              });

            });
          }
        );
      });
    } else {

        // adding
        const docRef_blog = doc(db, "blogs", id);
        updateDoc(docRef_blog, {
          title: title,
          description: description,
          category: category,
        }).then(() => {
          editBlogForm.reset();
          var mesg = document.querySelector(".add__message");
          mesg.style.padding = "10px";
          mesg.innerText = "Blog Updated successfully";
          setTimeout(() => {
            mesg.innerText = "";
            mesg.style.padding = "0px";
            window.location.href = "blogs.html";
          }, 4000);
        });
    }
  });





// ===== Adding Project  image is managed by the same fx ad blog ====

const addProjectFrm = document.getElementById("addProjectFrm");
addProjectFrm &&
  addProjectFrm.addEventListener("submit", (e) => {
    e.preventDefault();

    var title = addProjectFrm.title.value;
    var description = addProjectFrm.description.value;
    var web = addProjectFrm.web.value;
    var github = addProjectFrm.github.value;
    var status = true;

    let storageRef = ref(storage, "images/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileItem);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
        alert("Some problem in upload");
        return false;
      },
      () => {
        // On successful image uploads
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          uploadedImageURL = downloadURL;

          //adding

          var res = addDoc(colRef_blog, {
            title: title,
            webUrl: web,
            description: description,
            created_at: serverTimestamp(),
            image: uploadedImageURL,
            githubUrl: github,
            status: status,
          }).then(() => {
            addProjectFrm.reset();
            document.getElementById("imagePreview").innerText = "";
            document.getElementById("description").value = "";
            var mesg = document.querySelector(".add__message");
            mesg.style.padding = "10px";
            mesg.innerText = "Project Added successfully";
            setTimeout(() => {
              mesg.innerText = "";
              mesg.style.padding = "0px";
            }, 3000);
          });
        });
      }
    );
  });



// ===== Updating Project ====
const editProjectFrm = document.getElementById("editProjectFrm");
editProjectFrm &&
  editProjectFrm.addEventListener("submit", (e) => {
    e.preventDefault();

    var id = editProjectFrm.id.value;
    var title = editProjectFrm.title.value;
    var description = editProjectFrm.description.value;
    var webUrl = editProjectFrm.web.value;
    var githubUrl = editProjectFrm.github.value;

    const reader = new FileReader();

    // fileItem : @an instance of selected file image,

    let storageRef = ref(storage, "images/" + fileName);
    const uploadTask = uploadBytesResumable(storageRef, fileItem);

    if (typeof fileItem != "undefined") {

      reader.readAsDataURL(fileItem);
      reader.addEventListener("load", function (ev) {

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log(error);
            alert("Some problem in upload");
            return false;
          },
          () => {
            // On successful image uploads
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              uploadedImageURL = downloadURL;

              console.log(downloadURL);

              // updating
              const docRef_blog = doc(db, "blogs", id);
              updateDoc(docRef_blog, {
                title: title,
                description: description,
                image: downloadURL,
                githubUrl: githubUrl,
                webUrl: webUrl
              }).then(() => {
                editProjectFrm.reset();
                var mesg = document.querySelector(".add__message");
                mesg.style.padding = "10px";
                mesg.innerText = "Blog Updated successfully";
                setTimeout(() => {
                  mesg.innerText = "";
                  mesg.style.padding = "0px";
                  window.location.href = "blogs.html";
                }, 4000);
              });

            });
          }
        );
      });
    } else {

        // updating

        const docRef_blog = doc(db, "blogs", id);
        updateDoc(docRef_blog, {
          title: title,
          description: description,
          category: category,
        }).then(() => {
          editProjectFrm.reset();
          var mesg = document.querySelector(".add__message");
          mesg.style.padding = "10px";
          mesg.innerText = "Blog Updated successfully";
          setTimeout(() => {
            mesg.innerText = "";
            mesg.style.padding = "0px";
            window.location.href = "blogs.html";
          }, 4000);
        });
    }
  });




  // -------------------------------------------------------------------------------------------------------------


// Add a contact from front end
var formError = document.getElementById("form__error");
var contact__me__form = document.getElementById("contact__me__form");
var colRef_contacts = collection(db, "contacts");

contact__me__form &&
  contact__me__form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      // ===========SAVE The Contact FORM =======

      var name = document.getElementById("contact__name").value;
      var email = document.getElementById("contact__email").value;
      var message = document.getElementById("contact__message").value;

      var res = addDoc(colRef_contacts, {
        name: name,
        email: email,
        description: message,
        created_at: serverTimestamp(),
      }).then(() => {
        contact__me__form.reset();
        var mesg = document.querySelector(".add__message");
        mesg.style.padding = "10px";
        mesg.style.color = "green";
        mesg.innerText = "Thank you, we will reply via the email asp";
        contactForm.reset();

        setTimeout(() => {
          mesg.innerText = "";
          mesg.style.padding = "0px";
        }, 10000);
      });
    }
  });

// List all contacts queries in dashboard

var contacts_container = document.querySelector(".contacts .contact__row");
var contact_query = query(colRef_contacts);

onSnapshot(contact_query, (snapshot) => {
  var contacts = [];
  snapshot.docs.forEach((doc) => {
    contacts.push({ ...doc.data(), id: doc.id });
  });

  if (contacts_container) {
    contacts_container.innerHTML = buildContactsList(contacts);
  }

  var cantct = document.getElementById("card__number__contacts");
  if (cantct) {
    cantct.innerText = contacts.length;
  }
});





 

 


