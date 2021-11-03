const { unlinkSync } = require('fs')
const Category = require('../models/category');
const Product = require('../models/product');
const File = require('../models/file');
const LoadProductService = require('../services/LoadProductService');


module.exports = {
    async create(req, res) {
        try {
            const categories = await Category.findAll()
            return res.render("products/create.njk", { categories })
        } catch (error) {
            console.error(error)
        }
    },

    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key in keys) {
            if (req.body[key] == "") {
                return res.send("Please fill all the fields")
            }
        }

        if (req.files.length == 0) {
            return res.send("Plese insert at least one image")
        }

        let { category_id, name, description, old_price, price, quantity, status } = req.body

        price = price.replace(/\D/g, "")

        const product_id = await Product.create({
            category_id,
            user_id: req.session.userId,
            name,
            description,
            old_price: old_price || price,
            price,
            quantity,
            status: status || 1
        })

        const filesPromise = req.files.map(file => File.create({ name: file.filename, path: file.path, product_id }))

        await Promise.all(filesPromise)

        return res.redirect(`/products/${product_id}/edit`)
    },

    async show(req, res) {
        try {
            const product = await LoadProductService.load('product', {
                where: {
                    id: req.params.id
                }
            })

            return res.render('products/show', { product })
        } catch (error) {
            console.error(error)
        }
    },

    async edit(req, res) {
        try {
           
            const product = await LoadProductService.load('product', {
                where: {
                    id: req.params.id
                }
            })
            //get categories
            const categories = await Category.findAll()

            return res.render('products/edit.njk', { product, categories })
        } catch (error) {
            console.error(error)
        }
    },

    async put(req, res) {
        
        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({ ...file, product_id: req.body.id }))
            await Promise.all(newFilesPromise)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',');
            const lastItem = removedFiles.length - 1;
            removedFiles.splice(lastItem, 1);

            const removedFilesPromise = removedFiles.map(id => File.delete(id));
            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "");

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.price
        }

        await Product.update(req.body.id, {
            category_id: req.body.category_id,
            name: req.body.name,
            description: req.body.description,
            old_price: req.body.old_price,
            price: req.body.price,
            quantity: req.body.quantity,
            status: req.body.status,
        })

        return res.redirect(`/products/${req.body.id}`)
    },

    async delete(req, res) {
        const files = await Product.files(req.body.id)
        await Product.delete(req.body.id)

        files.map(file => {
            try {
                unlinkSync(file.path)
            } catch (err) {
                console.error(err)
            }
        })

        return res.redirect('/products/create')
    }
}