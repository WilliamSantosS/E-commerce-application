const User = require('../models/user')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    
    const {email, password} = req.body

    const user = await User.findOne({where: {email}})

    if(!user) return res.render("session/login", {
        user: req.body,
        error: "User not registered!"
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("session/login", {
        user: req.body,
        error: "Invalid password"
    })

    req.user = user
     next()
}

module.exports = {
   login
}