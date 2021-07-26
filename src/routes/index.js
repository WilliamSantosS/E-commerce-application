const express = require('express')
const routes = express.Router()
const homeController = require('../app/controllers/homeController')
const users = require('./users')
const products = require('./products')

// Home
routes.get('/', homeController.index)   
routes.use('/products', products)
routes.use('/users', users)

// Alias
routes.get("/ads/create", function(req, res) {
    return res.redirect("/products/create")
})

routes.get("/account", function(req, res) {
    return res.redirect("/users/login")
})

module.exports =  routes