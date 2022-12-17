import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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

// collection reff
const colRef = collection(db, "blogs");

// real time collecction data
const q = query(colRef, orderBy("created_at"));

onSnapshot(q, (snapshot) => {
  let blogs = [];

  snapshot.docs.forEach((doc) => {
    blogs.push({ ...doc.data(), id: doc.id });
  });
  console.log(blogs);
  var tblBody = document.querySelector("table#blogs tbody");
  if(tblBody){
    tblBody.innerHTML = buildBlogList(blogs);
  }


});

// ===== Adding blog ====
const addBlogForm = document.getElementById("addBlogFrm");

addBlogForm &&
  addBlogForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let imageURL = "";

    if (!fileValidation()) {
      return false;
    }
    uploadImage(e);
  });

// =====Deleting Blog======
const deleteBloog = document.querySelector(".deleteBlog");

deleteBloog &&
  deleteBloog.addEventListener("click", (e) => {
    e.preventDefault();
    const docRef = doc(db, "blogs", "id");

    deleteDoc(docRef).then(() => {
      console.log("deleted");
    });
  });

  

// =====Get single Doc=========
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if(urlParams.has("id")){

  const id = urlParams.get('id')
  const docRef = doc(db, "blogs", id);
  
  // console.log(docRef);
  onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
    populateEditForm({...doc.data(), id: doc.id});
  });
}



// ====Update a Doc======
const updateForm = document.querySelector(".updateForm");
updateForm &&
  updateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const docRef = doc(db, "blogs", "wmYz18Ww1L59AhHDEMAd");

    updateDoc(docRef, {
      title: "updated title",
    }).then(() => updateForm.reset());
  });

// =======Submit Blog form =======

var fileItem = document.querySelector(".fileItem");
var uploadPercentage = document.querySelector(".uploadPercentage");
var progress = document.querySelector(".progress");
var image = document.getElementById("image");

var percentVal;
var fileItem;
var fileName;

function getFile(e) {
  fileItem = e.target.files[0];
  fileName = fileItem.name;
}

image &&
  image.addEventListener("change", (e) => {
    getFile(e);
    fileValidation();

  });

function uploadImage(event) {
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
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

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

      // Handle unsuccessful uploads

      console.log(error);
      alert("Some problem in upload");
      return false;

    },
    () => {

      // On successful image uploads
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        addDoc(colRef, {
          title: addBlogForm.title.value,
          category: addBlogForm.category.value,
          description: addBlogForm.description.value,
          created_at: serverTimestamp(),
          image: downloadURL,
          views: 0,
          comments: 0,
        }).then(() => {
          addBlogForm.reset();
          document.getElementById("imagePreview").innerText = "";
          document.getElementById("description").value = "";
          alert("Blog Posted successfuly");
        });
      });
      
    }
  );
}

// Image validation at selection

function fileValidation() {
  var fileInput = document.getElementById("image");
  var filePath = fileInput.value;
  var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert(
      "Pls Select an image file having extensions .jpeg/.jpg/.png/.gif only."
    );
    fileInput.value = "";
    return false;
  } else {
    //Image preview
    if (fileInput.files && fileInput.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("imagePreview").innerHTML =
          '<img width="160" src="' + e.target.result + '"/>';
      };
      reader.readAsDataURL(fileInput.files[0]);
      return true;
    }
  }
}

// build blogList in dashboard
function buildBlogList(blogs) {
  var tableBody = "";
  blogs.forEach((row, index) => {
    tableBody += `<tr><td> ${index + 1} </td>
      <td> ${row.title} </td> 
      <td> <img  height="100" src="${row.image}" atl="${row.title}" /> </td>
      <td>${row.views}</td>
      <td>${row.comments}</td>
      <td>
      <a class="view" href="#"> <button>View</button> </a>
      <a class="edit" href="edit_blog.html?id=${row.id}"> <button>Edit</button> </a>
      <a class="status" href="#"> <button>Burn</button> </a>
      </td></tr>`;
  });

  return tableBody;
}



// Populate single blog into edit form
function populateEditForm(blog){
 var editBlogFrm = document.getElementById("editBlogFrm");
     editBlogFrm.title.value = blog.title;
     editBlogFrm.description.value = blog.description;
     editBlogFrm.id.value = blog.id;
     document.querySelector("form#editBlogFrm #imagePreview").innerHTML = "<img width='150' height='100' src='"+ blog.image +"' />";
     ClassicEditor.create(document.querySelector("#description")).catch(
      (error) => {
        console.error(error);
      }
    );
    }



// ==========================================================
//==========================  FILEBASE ======================
//===========================================================


//Upload image
function uploadImage(fileItem, fileName) {
  var uploadedImageLink;

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
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

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
      // Handle unsuccessful uploads

      console.log(error);
      alert("Some problem in upload");
      return false;
    },
    () => {
      // On successful image uploads
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        uploadedImageLink = downloadURL;
      });
    }
  );

  return uploadedImageLink;
}

// Add blog to the filebase

function addBlogFilebase(title,category,description, serverTimestamp){

    var imageURL = uploadImage(fileItem, fileName);

    imageURL && addDoc(colRef, {
            title: title,
            category: category,
            description: description,
            created_at: serverTimestamp,
            image: imageURL,
            views: 0,
            comments: 0,
          }).then(() => {
            addBlogForm.reset();
            document.getElementById("imagePreview").innerText = "";
            document.getElementById("description").value = "";
            alert("Blog Posted successfuly");
          });
}