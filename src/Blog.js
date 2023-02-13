const listBlogs = async () => {
  let blogs;
  await axios.get(`${baseUrl}/api/blogs/all`).then((res) => {
    console.log(res.data);
    blogs = res.data.map((el) => ({ ...el, id: el._id }));
  });

  const tblBody = document.querySelector("table#blogs tbody");
  if (tblBody) {
    tblBody.innerHTML = buildBlogList(blogs);
  }

  // dashboard blogs counts
  let blg = document.getElementById("card__number__blogs");
  if (blg) {
    blg.innerText = blogs.length;
  }

  // render latest blog
  let latest__blog = document.querySelector(".latest__blog.blogs_container");

  if (latest__blog) {
    latest__blog.innerHTML = buildLatestBlogs(blogs, 6);
  }

  // most viewed blogList on single blog
  let all__most_viewd_container = document.querySelector(
    ".right__summary .most_viewed_blogs"
  );

  if (all__most_viewd_container) {
    all__most_viewd_container.innerHTML = mostViewedBlogs(blogs);
  }

  // List all blogs in blogs page
  let all__blog_container = document.querySelector(
    ".all__blogs .blogs_container"
  );

  if (all__blog_container) {
    all__blog_container.innerHTML = buildLatestBlogs(blogs, 8);
  }

  // change status b
  let statusBtn = document.querySelectorAll("table#blogs td .status");
  statusBtn.forEach(function (ele, index) {
    ele.addEventListener("click", function (e) {
      e.preventDefault();
      let blog_id = this.getAttribute("blog_id");
      let statusI = this.getAttribute("status");
      let newStatus = statusI == "unmuted" ? "muted" : "unmuted";
      updateblogsStatus(blog_id, newStatus);
    });
  });

  if (tblBody) {
    new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          let statusBtn = document.querySelectorAll("table#blogs td .status");
          statusBtn.forEach(function (ele, index) {
            ele.addEventListener("click", function (e) {
              let Bid = this.getAttribute("blog_id");
              let statusI = this.getAttribute("status");
              let newStatus = statusI == "unmuted" ? "muted" : "unmuted";

              console.log(statusI);

              updateblogsStatus(Bid, newStatus);
            });
          });
        }
      }
    }).observe(tblBody, { attributes: true, childList: true, subtree: true });
  }

  // =========== Populate Edit Blog ===============\

  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  if (urlParams.has("edit_blog")) {
    const edit_blog = urlParams.get("edit_blog");
    let blog = blogs.filter((ele) => {
      return ele.id == edit_blog;
    })[0];

    if (edit_blog) {
      let categoriesList = document.querySelector(".form-content #category");

      let categories;
      await axios.get(`${baseUrl}/api/categories/all`).then((res) => {
        categories = res.data.map((el) => ({
          ...el,
          id: el._id,
          title: el.name,
        }));
      });


      if (categoriesList) {
        categoriesList.innerHTML = populateCategory(categories, blog.category);
      }

      populateEditForm(blog);
    }
  }
};

// =====Get single Doc =========
const singleBlogs = async () => {
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);

  if (urlParams.has("blog")) {
    const blog_id = urlParams.get("blog");

    /// Render a single blog and comments
    let comments_container = document.querySelector(
      ".comments__list .comment__content"
    );
    let date__published = document.querySelector(
      ".blog__content .date__published"
    );
    let comments_counts = document.querySelector(
      ".comments__list .comment__title"
    );
    let commentFrm = document.getElementById("commentFrm");

    let title = document.querySelector(
      ".blog__single__container .blog__content .title"
    );
    let desc = document.querySelector(
      ".blog__single__container .blog__content .blog__content_text"
    );
    let img = document.querySelector(".blog__single__container .blog__img img");

    let single_blg;

    await axios.get(`${baseUrl}/api/blogs/${blog_id}`).then((res) => {
      single_blg = { ...res.data.blog, id: res.data.blog._id };

      title.innerText = single_blg.title;
      desc.innerHTML = single_blg.description;
      img.setAttribute("src", single_blg.image.url);
      date__published.innerHTML = `<img src="assets/images/Alarm.svg" alt="" /> ${convertDateToString(
        single_blg.created_at
      )}`;
    });

    // retrive comments for a certain blog
    let comments = single_blg.comments;

    comments_container.innerHTML = buildComments(comments);
    comments_counts.innerHTML = `${comments.length} <span>Comment(s)</span>`;

    // add a comments on a blog
    commentFrm &&
      commentFrm.addEventListener("submit", async function (e) {
        e.preventDefault();
        let name = this.Names.value;
        let email = this.Email.value;
        let description = this.comment__description.value;

        let res = await axios
          .post(`${baseUrl}/api/comments/add/${single_blg.id}`, {
            names: name,
            email: email,
            description: description,
          })
          .then((response) => {
            commentFrm.reset();

            comments_container.innerHTML = buildComments(comments);
            comments_counts.innerHTML = `${comments.length} <span>Comment(s)</span>`;
            return;
          })
          .catch(async (error) => {
            let resCode = error;
            console.log(resCode);
          });
      });
  }
};

// adding a blog
let image = document.getElementById("image");
let fileItem;
let fileName;
let uploadedImageURL;

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

const createBlog = async () => {
  // ===== Adding blog ====
  const addBlogForm = document.getElementById("addBlogFrm");
  addBlogForm &&
    addBlogForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let bodyFormData = new FormData(addBlogForm);
      var imagefile = document.querySelector("#addBlogFrm #image");
      bodyFormData.append("image", imagefile);

      await axios({
        method: "post",
        url: `${baseUrl}/api/blogs/add`,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${Token.loadToken()}`,
        },
      })
        .then(function (response) {
          //handle success
          addBlogForm.reset();
          document.getElementById("imagePreview").innerText = "";
          document.getElementById("description").value = "";
          let mesg = document.querySelector(".add__message");
          mesg.style.padding = "10px";
          mesg.innerText = "Blog created successfully";
          addBlogForm.reset();
          setTimeout(() => {
            mesg.innerText = "";
            mesg.style.padding = "0px";
          }, 3000);
        })
        .catch(function (error) {
          //handle error

          if (error.response) {
            let mesg = document.querySelector(".add__message");
            mesg.style.backgroundColor = `white`;
            mesg.innerText = `Error: ${error.response.data.message}`;
            mesg.style.color = "#D16D6A";
            setTimeout(() => {
              mesg.innerText = "";
              mesg.style.padding = "0px";
            }, 10000);

            setTimeout(() => {
              window.location.href = "../login.html";
            }, 10000);
          }
        });
    });
};

const updateblogsStatus = async (id, status) => {
  console.log(status);
  await axios({
    method: "put",
    url: `${baseUrl}/api/blogs/update`,
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${Token.loadToken()}`,
    },
    data: {
      id: id,
      status: status,
    },
  })
    .then(async (response) => {
      // let categories;
      // await axios.get(`${baseUrl}/api/categories/all`).then((res) => {
      //   categories = res.data.map((el) => ({ ...el, id: el._id, title: el.name }));
      //   console.log(categories);
      // });
      // await listBlogs();
    })
    .catch((error) => {
      if (error.response.status === 401) {
        window.location.href = "../login.html";
      }

      if (error.response.status === 403) {
        if (confirm("page expired continue to login")) {
          window.location.href = "../login.html";
        }
      }
    });
};

const updateBlog = async () => {
  // ===== Updating blog ====
  const editBlogForm = document.getElementById("editBlogFrm");
  editBlogForm &&
    editBlogForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const reader = new FileReader();
      let bodyFormData = new FormData(editBlogForm);
      console.log(editBlogForm.description.value);
  
      let imagefile = document.querySelector("#addBlogFrm #image");
      bodyFormData.append("image", imagefile);

      if (typeof fileItem != "undefined") {
        reader.readAsDataURL(fileItem);
        reader.addEventListener("load", function (ev) {
          bodyFormData.append("image", imagefile);
        });
      }

      await axios({
        method: "put",
        url: `${baseUrl}/api/blogs/update`,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: `Bearer ${Token.loadToken()}`,
        },
      }).then(function (response) {
        //handle success
        let mesg = document.querySelector(".add__message");
        document.getElementById("imagePreview").innerText = "";
        document.getElementById("description").value = "";
        mesg.style.padding = "10px";
        mesg.innerText = "Blog Updated successfully";
        editBlogForm.reset();
        console.log(response)
        return;
        setTimeout(() => {
          mesg.innerText = "";
          mesg.style.padding = "0px";
          window.location.href = "blogs.html";
        }, 4000);
      })
      .catch(error => {
        if (error) {
          console.log(error);
        }
      })
      
      ;
    });
};

singleBlogs();
createBlog();
listBlogs();
updateBlog();
