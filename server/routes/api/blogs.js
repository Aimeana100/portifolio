const express = require('express');
const router = express.Router();
const BlogsController = require('../../controllers/BlogsController');

router.route('/')
    .get(BlogsController.getAllBlogs)
    .post(BlogsController.createNewBlog)
    .put(BlogsController.updateBlog)
    .delete(BlogsController.deleteBlog);

router.route('/:id')
    .get(BlogsController.getBlog);

module.exports = router;