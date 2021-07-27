const express = require('express')
const routes = express.Router()

const userController = require('../app/controllers/userController')
const sessionController = require('../app/controllers/sessionController')
const UserValidator = require('../app/middlewars/user')
const SessionValidator = require('../app/middlewars/session')
const { isLogged, onlyUsers } = require('../app/middlewars/routesAccess')


//login/logout 

routes.get('/login', isLogged, sessionController.loginForm)
routes.post('/login', SessionValidator.login, sessionController.login)
routes.post('/logout', sessionController.logout)

// //Reset password/ forgot

// routes.get('/forgot-password', sessionController.forgot)
// routes.get('/password-reset', sessionController.resetForm)
// routes.post('/forgot-password', sessionController.forgot)
// routes.post('/password-reset', sessionController.reset)

// //User register userController

routes.get('/register', userController.registerForm)
routes.post('/register', UserValidator.post, userController.post)

routes.get('/', onlyUsers, UserValidator.show ,userController.show)
routes.put('/', UserValidator.update, userController.update)
// routes.delete('/', userController.delete)

module.exports = routes
