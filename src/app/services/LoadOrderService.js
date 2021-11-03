const Order = require('../models/order');
const User = require('../models/user');
const LoadProductService = require('./LoadProductService');
const { formatPrice, date } = require('../../lib/utils');


async function format(order) {
    //product details
    order.product = await LoadProductService.load('productWithDeleted', {
        where: {id: order.product_id}
    })
   //buyer details 
    order.buyer = await User.findOne({where: {id: order.buyer_id}})

   //seller details
    order.seller = await User.findOne({where : {id: order.seller_id}})

   //format price 
    order.formattedPrice = formatPrice(order.price)
    order.formattedTotal = formatPrice(order.total)

   //format status 
    const status = {
        open: "Available",
        sold: "Sold",
        canceled: "Canceled"
    }
    order.formattedStatus = status[order.status]

   //format updated at
   const updatedAt = date(order.updated_at)
   order.formattedUpdatedAt = `
    ${order.formattedStatus}
    in ${updatedAt.day}/${updatedAt.month}/${updatedAt.year} 
    at ${updatedAt.hour}:${updatedAt.minutes}` 
    return order

}

const LoadService = {
    load(service, filter) {
        this.filter = filter
        return this[service]()
    },
    async order() {
        try {
            const order = await Order.findOne(this.filter)
            return format(order)
        } catch (error) {
            console.error(error);
        }
    },
    async orders() {
        try {
            //pickup the user orders
            const orders =  await Order.findAll(this.filter)
            const ordersPromise = orders.map(format)
            return Promise.all(ordersPromise)
        } catch (error) {
            console.error(error);
        }
    },
    format,
}

module.exports = LoadService