const express = require('express');
const router = express.Router();
const CommentController = require('../../controllers/CommentsController');

router.route('/')
    .put( CommentController.updateComment)
    .delete(CommentController.deleteComment);

router.route('/:blog_id')
.get(CommentController.getAllComments)
.post( CommentController.createNewComment);

router.route('/:id')
    .get(CommentController.getComment);

module.exports = router;