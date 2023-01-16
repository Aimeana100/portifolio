const Blog = require("../models/Blog");
const Category = require("../models/Category");
const commentSchema = require("../models/Comment");
const cloudinary = require("../config/cloudinary");

let objectId = require('mongoose').Types.ObjectId;

const getAllBlogs = async (req, res) => {
  const blogs = await Blog.find();
  if (!blogs) return res.status(204).json({ message: "No blogs found." });
  res.json(blogs);
};

const createNewBlog = async (req, res) => {

  if (
    !req?.body?.title ||
    !req?.body?.description ||
    !req?.file ||
    !req?.body?.category
  ) {
    return res
      .status(400)
      .json({ message: "Title, Description and Image are required" });
  } else if(!objectId.isValid(req.body.category)){
    return res
    .status(422)
    .json({"message" : "Category Id should be a valid mongoose ObjectId"})
        
  }
  else {
    const contact = await Category.findOne({ _id: req.body.category }).exec();
    if (!contact) {
      return res
        .status(204)
        .json({ message: `No Category matches ID ${req.params.id}.` });
    }
  }
  try {
    const imgResult = await cloudinary.uploader.upload(req.file.path);

    const { title, category, description } = req.body;

    let blog = {
      title,
      category,
      description,
      image: {
        url: imgResult.secure_url,
        id: imgResult.public_id,
      },
    };

    const result = await Blog.create(blog);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
};

const updateBlog = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const blog = await Blog.findOne({ _id: req.body.id }).exec();
  if (!blog) {
    return res
      .status(204)
      .json({ message: `No blog matches ID ${req.body.id}.` });
  }
  if (req.body?.title) blog.title = req.body.title;
  if (req.body?.description) blog.description = req.body.description;
  if (req.body?.category) blog.category = req.body.category;

  if (req.body?.image) blog.image = uploadFile(req.body.image);

  if (req.body?.status)
    blog.status = req.body.status == "muted" ? "unmuted" : "muted";

  if (req.file) {
    const imgResult = await cloudinary.uploader.upload(req.file.path);
    blog.image = {
      url: imgResult.secure_url,
      id: imgResult.public_id,
    };
  }

  const result = await blog.save();
  res.json(result);
};


const deleteBlog = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Blog ID required." });

  const blog = await Blog.findOne({ _id: req.body.id }).exec();
  if (!blog) {
    return res
      .status(204)
      .json({ message: `No blog matches ID ${req.body.id}.` });
  }
  const result = await blog.deleteOne();
  res.json(result);
};

const getBlog = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Blog ID required." });

  const blog = await Blog.findOne({ _id: req.params.id }).exec();
  if (!blog) {
    return res
      .status(204)
      .json({ message: `No blog matches ID ${req.params.id}.` });
  }
  res.json(blog);
};

module.exports = {
  getAllBlogs,
  createNewBlog,
  updateBlog,
  deleteBlog,
  getBlog,
};
