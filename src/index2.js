




// ===== Adding blog ====
const addBlogForm = document.getElementById("addBlogFrm");

addBlogForm &&
  addBlogForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let imageURL = "";

    // if (!fileValidation()) {
    //   return false;
    // }

    // uploadImage(e);
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

