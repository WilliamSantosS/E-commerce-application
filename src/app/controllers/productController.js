const { formatPrice } = require('../../lib/utils');
const Category = require('../models/category'); 
const Product = require('../models/product');


module.exports = {
    async create(req, res) {
        const result = await Category.all()
        const categories = result.rows
        return res.render("products/create.njk", { categories })
    }, 

    async post(req, res){
        const keys = Object.keys(req.body)

        for(key in keys) {
            if(req.body[key] == "") {
                return res.send("Please fill all the fields")
            }
        }
        let result = await Product.create(req.body);
        const productId = result.rows[0].id;
         
        return res.redirect(`/products/${productId}/edit`)
    },

    
   async edit(req, res) {
       let result = await Product.find(req.params.id)
       const product = result.rows[0]

       if (!product) return res.send('Product not found')

       product.old_price = formatPrice(product.old_price)
       product.price = formatPrice(product.price)
        result = await Category.all()
        const categories = result.rows

        return res.render('products/edit.njk', { product, categories})
    },

    async put(req, res) {
        const keys = Object.keys(req.body)

        for(key in keys) {
            if(req.body[key] == "") {
                return res.send("Please fill all the fields")
            }
        }

        req.body.price = req.body.price.replace(/\D/g, "");

        if(req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}/edit`)
    }
}