const { formatPrice, date } = require('../../lib/utils');
const Category = require('../models/category'); 
const Product = require('../models/product');
const File = require('../models/file');


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

        if(req.files.length == 0){
            return res.send("Plese insert at least one image")
        }

        let result = await Product.create(req.body);
        const productId = result.rows[0].id;

        const filesPromise = req.files.map(file => File.create({...file , product_id: productId}))
        
        await Promise.all(filesPromise)
         
        return res.redirect(`/products/${productId}/edit`)
    },

   async show(req, res) {
        const results = await Product.find(req.params.id)   
        const product = results.rows[0]

        if(!product) return res.send("Product not found!")

       const {day , month, hour, minutes} = date(product.updated_at)
        

       product.published = {
           day: `${day}/${month}`,
           hour: `${hour}h${minutes}`,
       }

       product.oldPrice = formatPrice(product.old_price)
       product.price = formatPrice(product.price)

        return res.render('products/show', { product })
    },

   async edit(req, res) {
       let result = await Product.find(req.params.id)
       const product = result.rows[0]

       if (!product) return res.send('Product not found')

       product.old_price = formatPrice(product.old_price)
       product.price = formatPrice(product.price)

       //get categories
        result = await Category.all()
        const categories = result.rows

        //get images
        result = await Product.files(product.id)
        let files = result.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        return res.render('products/edit.njk', { product, categories, files})
    },

    async put(req, res) {
        const keys = Object.keys(req.body)

        for(key in keys) {
            if(req.body[key] == "" && key != removed_files) {
                return res.send("Please fill all the fields")
            }
        }
        
        if(req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({...file, product_id: req.body.id}))
            await Promise.all(newFilesPromise)
        }
 
        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',');
            const lastItem = removedFiles.length - 1;
            removedFiles.splice(lastItem, 1);

            const removedFilesPromise = removedFiles.map(id => File.delete(id));
            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "");

        if(req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}`)
    }
}