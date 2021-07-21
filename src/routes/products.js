const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewars/multer')
const ProductController = require('../app/controllers/productController')
const SearchController = require('../app/controllers/searchController')

//Search
routes.get('/search', SearchController.index)

// Products
routes.get('/create', ProductController.create)
routes.get('/:id', ProductController.show)
routes.get('/:id/edit', ProductController.edit)
routes.post('/', multer.array("photos", 6), ProductController.post)
routes.put('/', multer.array("photos", 6), ProductController.put)
// routes.delete('/', productController.delete);

module.exports = routes;