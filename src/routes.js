const express = require('express');
const routes = express.Router();
const multer = require('./app/middlewars/multer');
const ProductController = require('./app/controllers/productController');
const homeController = require('./app/controllers/homeController');


routes.get('/', homeController.index)   

routes.get('/products/create', ProductController.create);
routes.get('/products/:id/edit', ProductController.edit);
routes.get('/products/:id', ProductController.show)
routes.post('/products', multer.array("photos", 6), ProductController.post);
routes.put('/products', multer.array("photos", 6), ProductController.put);


routes.get("/ads/create", function(req, res) {
    return res.redirect("/products/create")
})

module.exports =  routes; 