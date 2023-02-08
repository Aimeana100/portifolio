const listBlogs = async () => {
  let blogs;

  await axios.get(`${baseUrl}/api/blogs/all`).then((res) => {
    // console.log(res.data);
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
      let Bid = this.getAttribute("blog_id");
      let statusI = this.getAttribute("status");
      let newStatus = statusI == "true" ? false : true;

      const docRef = doc(db, "blogs", Bid);

      updateDoc(docRef, {
        status: newStatus,
      });
    });
  });
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

       let res =  await axios
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

const createBlog = async () => {
  // ===== Adding blog ====
  const addBlogForm = document.getElementById("addBlogFrm");
  addBlogForm &&
    addBlogForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let title = addBlogForm.title.value;
      let description = addBlogForm.description.value;
      let category = addBlogForm.category.value;
      let views = 0;
      let status = true;

      let bodyFormData = new FormData();
      bodyFormData.append("title", title);
      bodyFormData.append("description", description);
      bodyFormData.append("category", category);
      bodyFormData.append("category", category);
      bodyFormData.append("image", addBlogForm.files[0]);

      await axios({
        method: "post",
        url: `${baseUrl}/api/blogs/add`,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      })
        .then(function (response) {
          //handle success
          console.log(response);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
        });

      addDoc(colRef_blog, {
        title: title,
        category: category,
        description: description,
        created_at: serverTimestamp(),
        image: downloadURL,
        views: views,
        status: status,
        comments: "",
      }).then(() => {
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
      });
    });
};

singleBlogs();
listBlogs();
