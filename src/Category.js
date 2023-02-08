// |======================Blog Category ===============|
// |  |||||||||||||||||||||||       |||||||||||||||||| |
// |===================================================|

// Populate CATEGORIES in drop downs

const listCategories = async () => {

  let categories;

  await axios.get(`${baseUrl}/api/categories/all`).then((res) => {
    categories = res.data.map((el) => ({ ...el, id: el._id, title: el.name }));
  });


  let categ = document.getElementById("category");
  categ && populateCategory(categories, "");

  // list categories in dashboard
  let tblBody = document.querySelector("table#categories tbody");
  if (tblBody) {
    tblBody.innerHTML = buildBlogCategoryList(categories);
  }

  // populate drop downs categories
  let categoriesList = document.querySelector(".form-content #category");
  if (categoriesList) {
    categoriesList.innerHTML = populateCategory(categories, "");
  }


  // handle status change in dashboard
  let statusBtnCat = document.querySelectorAll("table#categories  td .status");
  statusBtnCat.forEach(function (ele, index) {
    ele.addEventListener("click", function (e) {
      let cId = this.getAttribute("cat_id");
      let statusI = this.getAttribute("status");
      let newStatus = statusI == "muted" ? "unmuted" : "muted";

      updateCategory(cId, '', newStatus);
      // listCategories();
      
    });
  });



  if (tblBody) {
    new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          let statusBtnCat = document.querySelectorAll(
            "table#categories  td .status"
          );
          statusBtnCat.forEach(function (ele, index) {
            ele.addEventListener("click", function (e) {
              let Bid = this.getAttribute("cat_id");
              let statusI = this.getAttribute("status");
              let newStatus = statusI == "muted" ? "unmuted" : "muted";

              updateCategory(Bid, '', newStatus);


            });
          });
        }
      }
    }).observe(tblBody, { childList: true, subtree: true });
  }

  // list categories on blogs and single blog page
  let all__category_container = document.querySelector(
    ".right__summary .categories"
  );

  if (all__category_container) {
    all__category_container.innerHTML = buildCategoriesList(categories);
  }

  // =========== Edit CATEGORY ===============
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);

  if (urlParams.has("category_id")) {
    const id = urlParams.get("category_id");
    populateEditCategory(
      categories.filter((ele) => {
        return ele.id == id;
      })[0]
    );
  }

  // counts card in dashbord
  let catgr = document.getElementById("card__number__categories");
  if (catgr) {
    catgr.innerText = categories.length;
  }
};

// ADD a CATEGORY
const addCategory = async () => {
  const addCategoryFrm = document.getElementById("addCategoryFrm");
  addCategoryFrm &&
    addCategoryFrm.addEventListener("submit", async (e) => {
      e.preventDefault();

      let title = addCategoryFrm.title.value;
      let status = 'unmuted';

      let mesg = document.querySelector(".add__message");
      mesg.style.padding = "10px";

      await axios({
        method: "post",
        url: `${baseUrl}/api/categories/add`,
        headers: {
          "Content-Type": "application/json",
          "token": `Bearer ${Token.loadToken()}`,
        },
        data: {
          name: title,
        },
      })
        .then((response) => {
          mesg.innerText = "Category created successfully";
          mesg.style.color = "#2DFA17";
          this.reset();
          setTimeout(() => {
            mesg.innerText = "";
            mesg.style.padding = "0px";
          }, 10000);
          return;
        })
        .catch((error) => {
          if(error.response){
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


const updateCategory = async (id,name, status) => {
  await axios({
    method: "put",
    url: `${baseUrl}/api/categories/update`,
    headers: {
      "Content-Type": "application/json",
      "token": `Bearer ${Token.loadToken()}`,
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

  listCategories();
  })
  .catch( (error) => {
    console.error(error);
  });

}
listCategories();
addCategory();

