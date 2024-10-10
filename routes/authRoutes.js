const router = require('express').Router()
const authController = require('../controllers/authControllers')
const middleware = require('../middlewares/middleware')

router.post('/api/register', authController.register)
router.post('/api/login', authController.login)
router.get('/api/users',middleware.auth, middleware.role, authController.get_users)
router.delete('/api/delete/:id',middleware.auth, middleware.role, authController.delete_user)

module.exports = router