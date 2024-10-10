const router = require('express').Router()
const categoryController = require('../controllers/categoryControllers')

router.post('/api/category/add', categoryController.add_category)
router.put('/api/category/edit/:id', categoryController.edit_category)
router.get('/api/category/all', categoryController.get_categories)
router.delete('/api/category/delete/:id', categoryController.delete_category)

module.exports = router