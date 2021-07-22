const express = require('express')
const routes = express.Router()

const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')
const Validator = require('../app/middlewars/user')

//login/logout 

// routes.get('/login', sessionController.loginForm)
// routes.post('/login', sessionController.loginForm)
// routes.post('/logout', sessionController.logout)

// //Reset password/ forgot

// routes.get('/forgot-password', sessionController.forgot)
// routes.get('/password-reset', sessionController.resetForm)
// routes.post('/forgot-password', sessionController.forgot)
// routes.post('/password-reset', sessionController.reset)

// //User register userController

routes.get('/register', userController.registerForm)
routes.post('/register', Validator.post, userController.post)

routes.get('/', userController.show)
// routes.put('/', userController.update)
// routes.delete('/', userController.delete)

module.exports = routes
