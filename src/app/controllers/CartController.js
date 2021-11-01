const Cart = require('../../lib/cart');
const LoadProductService = require('../services/LoadProductService');


module.exports = {
    async index(req, res) {

        try {

            let { cart } = req.session

            cart = Cart.init(cart)

            return res.render("cart/index", { cart })
        } catch (error) {
            console.error(error);
        }
    },
    
    async addOne(req, res) {
        //pickup the id product id and the product
        const id = req.params.id

        const product = await LoadProductService.load('product', {where: { id }})

        //pickup the cart from the session
        let { cart } = req.session

        //add the product to the cart using our cart manager
        cart = Cart.init(cart).addOne(product)

        //update the cart in session
        req.session.cart = cart

        //redirect for the cart page
        return res.redirect('/cart')
    },
    
    async removeOne(req,res) {
        let { id } = req.params
        
        //pickup the cart from the session
        let { cart } = req.session

        //if the cart doesn't exist return
        if(!cart) return res.redirect('/cart')

        //initialize the cart manager and then remove
        cart = Cart.init(cart).removeOne(id)

        //update the cart in the session
        req.session.cart = cart

        //redirect for the cart page
        return res.redirect('/cart')
    },

    async delete(req, res) {
        let { cart } = req.session
        let { id } = req.params

        if(!cart) return 

        cart = Cart.init(cart).delete(id)

        req.session.cart = cart

        return res.redirect('/cart')
    }
}

