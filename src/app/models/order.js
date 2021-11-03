const Base = require('./base')

Base.init({ table: 'orders'})

module.exports = {
    ...Base,
}