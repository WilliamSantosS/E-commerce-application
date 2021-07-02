const { formatPrice } = require('../../lib/utils');
const Category = require('../models/category'); 
const Product = require('../models/product');


module.exports = {
    create(req, res) {

        Category.all()
            .then(function (results) {
                const categories = results.rows;
                return res.render("products/create.njk", { categories })
            }).catch(function (err) {
                throw new Error(err);
            })
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
         
        return res.redirect(`/products/${productId}`)
    },

    
   async edit(req, res) {
       let result = await Product.find(req.params.id)
       const product = result.rows[0]

       if (!product) return res.send('Product not found')

       product.old_price = formatPrice(product.old)
       product.price = formatPrice(product.price)
        result = await Category.all()
        const categories = result.rows


        return res.render('products/edit.njk', { product, categories})
    }
}