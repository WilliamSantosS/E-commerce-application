const { formatPrice } = require('./utils');
//saving the cart information in the session


const Cart = {
    init(oldCart) {
        if(oldCart) {
            this.items = oldCart.items,
            this.total = oldCart.total
        } else {
            this.items = [],
            this.total = {
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0),
            }
        }
        return this
    },
    addOne(product){
        let inCart = this.getCartItem(product.id)

        //New product in cart
        if(!inCart) {
            inCart = {
                product: { 
                    ...product,
                    formattedPrice: formatPrice(product.price)
                },
                quantity: 0,
                price: 0,
                formattedPrice: formatPrice(0)
            }
            this.items.push(inCart)
        }
        //Max quantity reached
        if(inCart.quantity >= product.quantity) return this


        //Update item
        inCart.quantity++
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)
        
        //Update cart
        this.total.quantity++
        this.total.price += inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        return this
    },
        
    removeOne(productId){
        //find the item in the cart
         let inCart = this.getCartItem(productId)

        if(!inCart) return this

        //update the item quantity
        inCart.quantity--
        inCart.price = inCart.product.price * inCart.quantity
        inCart.formattedPrice = formatPrice(inCart.price)

        //update the cart
        this.total.quantity--
        this.total.price -= inCart.product.price
        this.total.formattedPrice = formatPrice(this.total.price)

        //Remove the entire item
        if(inCart.quantity < 1) {
            let itemIndex = this.items.indexOf(inCart)
            this.items.splice(itemIndex, 1)
            return this
        }

        return this 
    },

    delete(productId) {
        const inCart = this.getCartItem(productId)
        if(!inCart) return this

        if(this.items.length > 0) {
            this.total.quantity -= inCart.quantity
            this.total.price -= (inCart.product.price * inCart.quantity)
            this.total.formattedPrice = formatPrice(this.total.price)
        }

        this.items = this.items.filter(item => inCart.product.id != item.product.id)
        return this
    },

    getCartItem(productId) {
       return this.items.find(item => item.product.id == productId)
    }
}

module.exports = Cart

