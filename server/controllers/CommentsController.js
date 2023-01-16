const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const {ObjectId} = require('mongoose').Types

const getAllComments = async (req, res) => {
  if (!req?.params?.blog_id) {
    return res.status(400).json({ message: " No blog specified" });
  }else if(!ObjectId.isValid(req.params.blog_id)){
    return res
    .status(422)
    .json({"message" : "Blog Id should be a valid mongoose ObjectId"})
  }

  let blog_id = req.params.blog_id;
  const comments = await Blog.aggregate([
    {
      $match: { _id: ObjectId(blog_id) }
    },
    {
      $lookup: {
        from: "comments",
        localField: "comments",
        foreignField: "_id",
        as: "commentList",
      },
    },
  ]);
  if (!comments) return res.status(204).json({ message: "No comments found." });
  res.json(comments);
};

const createNewComment = async (req, res) => {
  if (!req?.body?.names || !req?.body?.email || !req?.body?.description) {
    return res
      .status(400)
      .json({ message: "User names , email and comment message is required" });
  }
  if (!req?.params?.blog_id) {
    return res.status(400).json({ message: " No blog specified" });
  } else if(!ObjectId.isValid(req.params.blog_id)){
    return res
    .status(422)
    .json({"message" : "Blog Id should be a valid mongoose ObjectId"})
        
  }

  try {
    const result = await Comment.create({
      names: req.body.names,
      email: req.body.email,
      description: req.body.description,
      status: req.body.status,
    });

    if (result) {
      let blog_id = req.params.blog_id;

      let blogUpdate = await Blog.updateMany(
        { _id: blog_id },
        { $push: { comments: result._id } }
      );

      console.log(blogUpdate);
    }

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateComment = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const comment = await Comment.findOne({ _id: req.body.id }).exec();
  if (!comment) {
    return res
      .status(204)
      .json({ message: `No comment matches ID ${req.body.id}.` });
  }
  if (req.body?.description) comment.description = req.body.description;
  if (req.body?.status) comment.status = req.body.status;
  const result = await comment.save();
  res.json(result);
};

const deleteComment = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "Comment ID required." });

  const comment = await Comment.findOne({ _id: req.body.id }).exec();
  if (!comment) {
    return res
      .status(204)
      .json({ message: `No comment matches ID ${req.body.id}.` });
  }
  const result = await comment.deleteOne();

  if (result) {
    let blog_id = req.params.blog_id;
    let blogUpdate = Blog.updateMany(
      { _id: blog_id },
      { $pull: { comments: result._id } }
    );
  }
  res.json(result);
};

const getComment = async (req, res) => {
  if (!req?.params?.id)
    return res.status(400).json({ message: "Comment ID required." });

  const comment = await Comment.findOne({ _id: req.params.id }).exec();
  if (!comment) {
    return res
      .status(204)
      .json({ message: `No comment matches ID ${req.params.id}.` });
  }
  res.json(comment);
};

module.exports = {
  getAllComments,
  createNewComment,
  updateComment,
  deleteComment,
  getComment,
};
