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
        const productId = result.rows[0];

        result = await Category.all()
        const categories = result.rows[0]

        return res.render('products/create.njk', { productId, categories })
    }
}