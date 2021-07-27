const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewars/multer')
const ProductController = require('../app/controllers/productController')
const SearchController = require('../app/controllers/searchController')
const { onlyUsers } = require('../app/middlewars/routesAccess')

//Search
routes.get('/search', SearchController.index)

// Products
routes.get('/create', onlyUsers, ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', ProductController.edit)
routes.post('/', onlyUsers, multer.array("photos", 6), ProductController.post)
routes.put('/', onlyUsers,  multer.array("photos", 6), ProductController.put)
routes.delete('/:id', onlyUsers, ProductController.delete);

module.exports = routes;