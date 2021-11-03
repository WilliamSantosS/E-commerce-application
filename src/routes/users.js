const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const SessionController = require('../app/controllers/SessionController')
const UserValidator = require('../app/middlewars/user')
const SessionValidator = require('../app/middlewars/session')
const { isLogged, onlyUsers } = require('../app/middlewars/RoutesAccess')

//login/logout 

routes.get('/login', isLogged, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// //Reset password/ forgot

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)

// //User register userController

routes.get('/register', UserController.registerForm)
routes.post('/register', UserValidator.post, UserController.post)

routes.get('/', onlyUsers, UserValidator.show ,UserController.show)
routes.put('/', UserValidator.update, UserController.update)
routes.delete('/', UserController.delete)

routes.get('/ads', UserController.ads)

module.exports = routes
