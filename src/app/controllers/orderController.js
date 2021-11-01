const LoadProductService = require('../services/LoadProductService');
const User = require('../models/user');
const mailer = require('../../lib/mailer');

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
    async post(req, res) {

        try {
            //saving the product
            const product = await LoadProductService.load('product', {where: { 
                id: req.body.id
            }})

            //Saving who is the selling
            const seller = await User.findOne({where: { id: product.user_id}})

            //And who is buying
            const buyer = await User.findOne({where: {id: req.session.userId}})

            //Send an email
            await mailer.sendMail({
                to: seller.email,
                from: 'no-replay@ecommerce.com.br',
                subject: 'New purchase order',
                html: email(seller, product, buyer)
            })

            //Send to the buyer a notification 
            return res.render('orders/success')
        } catch (error) {
            console.error(error);
            return res.render('orders/error')
        }
    }
}

