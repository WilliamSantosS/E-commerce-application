const LoadProductService = require('../services/LoadProductService');
const LoadOrderService = require('../services/LoadOrderService');
const User = require('../models/user');
const mailer = require('../../lib/mailer');
const Cart = require('../../lib/cart');
const Order = require('../models/Order');

const email = (seller, product, buyer) =>`
<h2> Greetings ${seller.name} </h2>
<p>  You have a new purchase order of your product</p>
<p>Product: ${product.name}</p>
<p>Price: ${product.formattedPrice}</p>
<p><br> <br></p>
<h3>Client information</h3>
<p>Name: ${buyer.name}</p>
<p>E-mail: ${buyer.email}</p>
<p>Address: ${buyer.address}</p>
<p>${buyer.cep}</p>
<p><br> <br></p>
<p><strong>Make contact with the buyer to complete your sale </strong></p>
<p><br> <br></p>
<p><strong> Sincerely e-commerce team  </strong></p>
`
module.exports = {
    async index(req, res) {
        const orders = await LoadOrderService.load('order',{
            where: { buyer_id: req.session.userId } 
        })
       return res.render("orders/index", { orders })
    },

    async sales(req, res) {
        const sales = await LoadOrderService.load('orders',{
            where:  {seller_id: req.session.userId }
        })

       return res.render("orders/sales", { sales })
    },

    async show(req, res) {
        const order = await LoadOrderService.load('order', {
            where: { id: req.params.id }
        })    

       return res.render("orders/details", { order })

    },

    async post(req, res) {

        try {
            //get the products from the cart
            let cart = Cart.init(req.session.cart)

            //checking if the logged user isn't the product seller before order
            const buyer_id = req.session.userId
            const filteredItems = cart.items.filter(item => 
                item.product.user_id != buyer_id
            )

            //create the order
           const createOrdersPromise = filteredItems.map(async item => {
                let { product, price:total, quantity} = item
                const { price, id: product_id, user_id: seller_id } = product
                const status = "open"
                const order = await Order.create({
                    seller_id,
                    buyer_id,
                    product_id,
                    price,
                    total,
                    quantity,
                    status
                })

                //saving the product
                     product = await LoadProductService.load('product', {where: { 
                        id: product_id
                    }})

                    //Saving who is the selling
                    const seller = await User.findOne({where: { id: seller_id}})

                    //And who is buying
                    const buyer = await User.findOne({where: {id: buyer_id}})

                    //Send an email
                    await mailer.sendMail({
                        to: seller.email,
                        from: 'no-replay@ecommerce.com.br',
                        subject: 'New purchase order',
                        html: email(seller, product, buyer)
                    })
                    
                    return order
            })

            await Promise.all(createOrdersPromise)

            // CLEAN CART
            delete req.session.cart
            Cart.init()

            //Send to the buyer a notification 
            return res.render('orders/success')
        } catch (error) {
            console.error(error);
            return res.render('orders/error')
        }
    },

    async update(req, res) {
        try {
            const {id, action} = req.params
            const acceptedActions = ['close', 'canceled']
            if(!acceptedActions.includes(action)) return res.send("Action not recognised")

            //pickup the order
            const order = await Order.findOne({
                where: { id }
            })

            if(!order) return res.send('Order not found')

            //Verify if the order is opened
            if(order.status != 'open') return res.send('Action not permitted')

            //Update the order
            const statusObj = {
                close: "sold",
                canceled: 'canceled'
            }
              
            order.status = statusObj[action]

            await Order.update(id, {
                status: order.status
            })

            //redirect
            return res.redirect('/orders/sales')

        } catch (error) {
            console.error(error)
        }
    }
}

