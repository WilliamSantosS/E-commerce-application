const Base = require('./base')

Base.init({ table: 'users'})

module.exports = {
    ...Base,
}