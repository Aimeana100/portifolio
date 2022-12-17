// Image validation at selection
function fileValidation(imageId) {
  var fileInput = document.getElementById(imageId);
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

// ==========================================================
//==========================LOCALSTORAGE=====================
//===========================================================

// Create Unique
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}

// =========== populate category ============

function populateCategory(id) {
  var categ = document.getElementById("category");
  var categories = Category.getAllCategories();

  console.log(categories);

  var lists = '<option value="" > --- select --- </option>';

  categories.forEach((ele, index) => {
    lists +=
      "<option " +
      (ele.id == id ? " selected " : "") +
      ' value="' +
      ele.id +
      '">' +
      ele.title +
      " </option>";
  });

  categ.innerHTML = lists;
}

// ================================================================
// ========================BLOGs=================================
// ================================================================

// build blogList in dashboard
function buildBlogList(blogs) {
  var tableBody = "";
  blogs.forEach((row, index) => {
    tableBody += `<tr><td>
     ${index + 1} ${row.status ? '' : '<i style="color:#ABB6A8" class="fa fa-trash" aria-hidden="true"></i>'} </td>
        <td> ${row.title} </td> 
        <td> <img  height="80" src="${row.image}" atl="${row.title}" /> </td>
        <td>${row.views}</td>
        <td>0</td>
        <td>
        <a class="view" href="#"> <button>View</button> </a>
        <a class="edit" href="edit_blog.html?id=${
          row.id
        }"> <button>Edit</button> </a>
        <a blog_id=${row.id} class="status ${row.status ? 'burn': "revoke"}" > <button> ${row.status ? "Burn": "Revoke"} </button></a>
        </td></tr>`;
  });

  return tableBody;
}

// build single blog in dashboard  =======================
// Populate single blog into edit form ======================
function populateEditForm(blog) {
  var editBlogFrm = document.getElementById("editBlogFrm");

  populateCategory(blog.category);

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



// =====Get single Blog =========
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has("id")) {
  const id = urlParams.get("id");
  populateEditForm(Blog.getBlog(id)[0]);
}

// ================================================================
// ========================BLOGs Category==========================
// ================================================================

// build category in dashboard
function buildBlogCategoryList(categories) {
  var bodyCategories = "";
  categories.forEach((row, index) => {

    bodyCategories += `<tr><td> ${index + 1} </td>
        <td> ${row.title} </td> 
        <td>
        <a class="edit" href="edit_category.html?category_id=${
          row.id
        }"> <button>Edit</button> </a>
        <a class="status" href="#"> <button>Burn</button> </a>
        </td>
        </tr>`;
  });

  return bodyCategories;
}
var tblBody = document.querySelector("table#categories tbody");
if (tblBody) {
  tblBody.innerHTML = buildBlogCategoryList(Category.getAllCategories());
}

// build single Cattegory in dashboard  =======================
// Populate single category into edit form ======================

function populateEditCategory(category) {
  var editBlogFrm = document.getElementById("editCategoryFrm");
  editBlogFrm.title.value = category.title;
  editBlogFrm.id.value = category.id;
}

// =====Get single Blog =========
// const queryString = window.location.search;
// const urlParams = new URLSearchParams(queryString);

if (urlParams.has("category_id")) {
  const id = urlParams.get("category_id");
  populateEditCategory(Category.getCategory(id)[0]);
}

// buld blog List form User interface
function buildLatestBlogs(blogs, number) {
  var latestBlogs = "";
  blg.forEach((ele, index) => {
    latestBlogs += `<div class="item">
    <div class="img">
      <img style='min-height: 140px' src="${ele.image}" alt="" />
    </div>
    <div class="description">
      <p class="date__desktop">
        <img src="assets/images/Alarm.svg" alt="" /> December , 20
        2022
      </p>
      <h3 class="title">
        ${ele.title}
      </h3>

      <p class="description__text">
        ${ele.description}
      </p>

      <p class="date__mobile">
        <img src="assets/images/Alarm.svg" alt="" /> December , 20
        2022
      </p>

      <div class="comment_views">
        <p class="comments">
          <img src="assets/images/inser_ comment.svg" alt="" />
          <span>12</span>
        </p>

        <p class="views">
          <img src="assets/images/views.svg" alt="" />
          <span>${ele.views}</span>
        </p>
      </div>

      <a href="blog-single.html?blog=${ele.id}" class="read__more"
        >Read more
        <img src="assets/images/arrow_right_alt.svg" alt="" />
      </a>
    </div>
  </div>`;
  });

  return latestBlogs;
}

// BUILD a category list on blogs page
function buildCategoriesList(categories) {
  var categoryList = "";
  categories.forEach((ele, index) => {
    categoryList += `<p category__id=${ele.id} title=${ele.title}  class="category_item"> <img src="assets/images/arrow_right_alt_red.svg" alt=""> ${ele.title} </p>`;
  });
  return categoryList;
}

// Build most viewd post on blogs page
function mostViewedBlogs(blogs) {
  var list = "";
  blogs.forEach((ele, index) => {
    list += ` <div class="blog__item">
    <div class="img">
      <img src="${ele.image}" alt="">
    </div>
    <div class="description">
      <h4 class="title"> ${ele.title}  </h4>
      <p class="time__frame"> <img src="assets/images/Alarm.svg" alt=""> Dec, 22 2022 </p>
      <div class="comment_views">
      <p class="comments">
        <img src="assets/images/inser_ comment.svg" alt="" />
        <span>12</span>

        <img src="assets/images/views.svg" alt="" />
        <span>${ele.views}</span>
      </p>
      <img class="read__more" width="30" src="assets/images/arrow_right_alt.svg" alt="" >
    </div>
    </div>

  </div>`;
  });

  return list;
}

function buildSingleBlog(blog_id) {
  var blgs = Blog.getBlog(blog_id)[0];
  return blgs;
}
