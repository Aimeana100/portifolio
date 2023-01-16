// Image validation at selection
export function fileValidation(imageId) {

  let  fileInput = document.getElementById(imageId);
  let  filePath = fileInput.value;
  let  allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
  if (!allowedExtensions.exec(filePath)) {
    alert(
      "Pls Select an image file having extensions .jpeg/.jpg/.png/.gif only."
    );
    fileInput.value = "";
    return false;
  } else {

    //Image preview

    if (fileInput.files && fileInput.files[0]) {
      let  reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("imagePreview").innerHTML =
          '<img width="160" src="' + e.target.result + '"/>';
      };
      reader.readAsDataURL(fileInput.files[0]);
      return true;
    }
    return true;
  }
}


// =========== populate category ============

export function populateCategory(categories, selectId) {

  let  lists = '<option value="" > --- select --- </option>';
  categories.forEach((ele, index ) => {
    lists +=
      "<option " +
      ( ele.id == selectId ? " selected " : "") +
      ' value="' +
      ele.id +
      '">' +
      ele.title +
      " </option>";
  });

  return lists;
  
}

// ================================================================
// ========================BLOGs=================================
// ================================================================

// build blogList in dashboard
export function buildBlogList(blogs) {

  let tableBody = "";
  blogs.forEach((row, index) => {
    tableBody += `<tr><td>
     ${index + 1} ${row.status ? '' : '<i style="color:#ABB6A8" class="fa fa-trash" aria-hidden="true"></i>'} </td>
        <td> ${row.title} </td> 
        <td> <img  width="100" src="${row.image}" atl="${row.title}" /> </td>
        <td>${row.views}</td>
        <td> ${row.comments.length} </td>
        <td>
        <a class="view" href="#"> <button>View</button> </a>
        <a class="edit" href="edit_blog.html?edit_blog=${
          row.id
        }"> <button>Edit</button> </a>
        <button blog_id=${row.id} status=${row.status} class="status ${row.status ? 'burn': "revoke"}" >  ${row.status ? "Burn": "Revoke"} </button>
        </td></tr>`;
  });

  return tableBody;
}


// build dashboard projects

export function buildProjects(projects){
  let  projectHtml = "";
  projects.forEach((row, index) => {
    projectHtml += `<div class="project__item">
    <div class="top">
      <div class="image__container">
        <img width="180" src="${row.image}" alt="" />
      </div>
      <div class="links">
        <h2 class="title"> ${row.title} </h2>
        <p><span> GitHub : </span>
         <a target="_blank" href="${row.githubUrl}"> Git </a></p>
        <p><span> WEB : </span> <a target="_blank"  href="${row.webUrl}"> WEb </a></p>
        <p class="description"> ${row.description} </p>
      </div>
    </div>

    <div class="options">
      <a href="#"> Edit </a>
      <a projId=${row.id} class="deletePrj" href="#"> Delete </a>
    </div>
  </div>`;

  })

  return projectHtml ;
}

// build projects homepage

export function buildHomeProjects(projects){
  let  projectHtml = "";
  projects.forEach((row, index) => {
    projectHtml += `
    <div class="item">
      <div class="img">
        <img src="${row.image}" alt="" />
      </div>

      <div class="description">
        <div class="title">
          <h3> ${row.title} </h3>
        </div>
        <div class="goto">
          <a target="_blank" href="${row.webUrl}" class="web"> <img src="" alt="" /> web </a>
          <a target="_blank" href="${row.githubUrl}" class="github"> <img src="" alt="" /> github </a>
        </div>
      </div>
    </div>
  `;

  })

  return projectHtml ;
}

// build single blog in dashboard  =====================
// Populate single blog into edit form =================
export function populateEditForm(blog) {
  let editBlogFrm = document.getElementById("editBlogFrm");

  editBlogFrm.title.value = blog.title;
  editBlogFrm.description.value = blog.description;
  editBlogFrm.id.value = blog.id;
  document.querySelector("form#editBlogFrm #imagePreview").innerHTML =
    "<img width='150' height='100' src='" + blog.image + "' />";

  ClassicEditor.create(document.querySelector("#description")).catch(
    (error) => {
      console.error(error);
    }
  );
}



// ===========================================
// ============BUILD COMMENTS on SINGLE BLOG==================
// ===========================================


export function buildComments(comments){
  let html ='';
  comments.forEach((ele, index)=>{
    html += `<div class="coment__item">
    <div class="commenter__photo">
      <img height="50" width="50"  src="assets/images/Ana10_icon.svg" alt="" />
    </div>
    <div class="commenter__description">

      <p>
        <span class="name">${ele.name}</span>
        <span class="comment__date"> ${convertDateToString(ele.comment_date)} </span>
      </p>

      <p class="comment__text">
      ${ele.description}
      </p>

      <div class="reply"> <a href=""> Reply</a></div>
    </div>
  </div>`;
  })

  return html;
}



// ================================================================
// ========================BLOGs Category==========================
// ================================================================

// build category in dashboard
 export function buildBlogCategoryList(categories) {
  let bodyCategories = "";
  categories.forEach((row, index) => {

    bodyCategories += `<tr><td> ${index + 1} </td>
        <td> ${row.title} </td> 
        <td>
        <a class="edit" href="edit_category.html?category_id=${
          row.id
        }"> <button>Edit</button> </a>
       <button status=${row.status} cat_id=${row.id} class=" status ${row.status ? 'burn': "revoke"}" > ${row.status ? "Burn": "Revoke"} </button>
        </td>
        </tr>`;
  });

  return bodyCategories;
}


// build single Cattegory in dashboard  =======================
// Populate single category into edit form ======================

export function populateEditCategory(category) {
  let  editBlogFrm = document.getElementById("editCategoryFrm");
  editBlogFrm.title.value = category.title;
  editBlogFrm.id.value = category.id;
}

// buld blog List form User interface
export function buildLatestBlogs(blogs, number) {
  let  latestBlogs = "";

  
  blogs.filter(blog => {return blog.status}).forEach((ele, index) => {
    console.log(ele.comments)
    latestBlogs += `<div class="item">
    <div class="img">
      <img style='min-height: 140px' src="${ele.image}" alt="" />
    </div>
    <div class="description">
      <p class="date__desktop">
        <img src="assets/images/Alarm.svg" alt="" />  ${convertDateToString(ele.created_at)} 
      </p>
      <h3 class="title">
        ${ele.title}
      </h3>

      <div class="description__text">
        ${ele.description}
      </div>

      <div class="comment_views">
        <p class="comments">
          <img src="assets/images/inser_ comment.svg" alt="" />
          <span>${ele.comments.length}</span>
        </p>

        <p class="views">
          <img src="assets/images/views.svg" alt="" />
          <span>${ele.views}</span>
        </p>
      </div>

      <a views=${ele.views} blog_id="${ele.id}" href="blog-single.html?blog=${ele.id}" class="read__more"
        >Read more
        <img src="assets/images/arrow_right_alt.svg" alt="" />
      </a>
    </div>
  </div>`;
  });

  return latestBlogs;
}


// BUILD a category list on blogs page
export function buildCategoriesList(categories) {
  let  categoryList = "";
  categories.forEach((ele, index) => {
    categoryList += `<p category__id=${ele.id} title=${ele.title}  class="category_item"> <img src="assets/images/arrow_right_alt_red.svg" alt=""> ${ele.title} </p>`;
  });
  return categoryList;
}

// Build most viewd post on blogs page
export function mostViewedBlogs(blogs) {
  let  list = "";
  blogs.forEach((ele, index) => {
    
    list += ` <div class="blog__item">
    <div class="img">
      <img src="${ele.image}" alt="">
    </div>
    <div class="description">
      <h4 class="title"> ${ele.title}  </h4>
      <p class="time__frame"> <img src="assets/images/Alarm.svg" alt=""> ${convertDateToString(ele.created_at)} </p>
      <div class="comment_views">
      <p class="comments">
        <img src="assets/images/inser_ comment.svg" alt="" />
        <span> ${ele.comments.length} </span>

        <img src="assets/images/views.svg" alt="" />
        <span>${ele.views}</span>
      </p>
      <a  views=${ele.views}  blog_id="${ele.id}" href="#" class="read__more" > <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </a>
    </div>
    </div>

  </div>`;
  });

  return list;
}





// ===========================================
// ============CONTACTS PAGE==================
// ===========================================

export function buildContactsList(contacts){
  let  html = "";
  contacts.forEach((ele)=>{
    html += `<div class="message__item">
    <div class="sender">
      <h2 class="name">${ele.name}</h2>
      <h5 class="contact_date"> ${ convertDateToString(ele.created_at || ele.contact_date ) }    </h5>
      <h4 class="email"> ${ele.email} </h4>
      <p class="message">
        ${ele.description}
      </p>
    </div>
    <div class="option">
      <button class="reply">Reply</button>
    </div>
  </div>`;
  });

  return html;
}

export function convertDateToString(timestamp){

let date = timestamp.toDate();

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const d = date;
return d.getDate() + ", " + monthNames[Number(d.getMonth())] + " " + d.getFullYear();


// return date;
}


// ====================================================================================
//======================Authentication\\=================================================

// ENCRYPT & DECRYPT FUNCTIONS
    let crypt = {
      // (B1) THE SECRET KEY
      secret : "CIPHERKEY",
     
      // (B2) ENCRYPT
      encrypt : (clear) => {
        let cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
        cipher = cipher.toString();
        return cipher;
      },
     
      // (B3) DECRYPT
      decrypt : (cipher) => {
        let decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
        decipher = decipher.toString(CryptoJS.enc.Utf8);
        return decipher;
      }

    };


