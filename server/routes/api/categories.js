const express = require('express');
const router = express.Router();
const CategoriesController = require('../../controllers/CategoriesController');

router.route('/')
    .get(CategoriesController.getAllCategories)
    .post( CategoriesController.createNewCategory)
    .put( CategoriesController.updateCategory)
    .delete(CategoriesController.deleteCategory);

router.route('/:id')
    .get(CategoriesController.getCategory);

module.exports = router;