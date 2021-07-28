const User = require('../models/user')
const { compare } = require('bcryptjs')

async function login(req, res, next) {

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/login", {
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

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email not registered!"
        })
        req.user = user
        next()
    } catch (err) {
        console.error(err)
    }
}

async function reset(req, res, next) {
    //find user
    const { email, password, token , passwordRepeat} = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) return res.render("session/password-reset", {
        user: req.body,
        token,
        error: "User not registered!"
    })

    //check if the password is valid
    if (password != passwordRepeat) {
        return res.render("session/password-reset", {
            user: req.body,
            error: " Password doesn't match.",
            token
        })
    }
    //check the token

    if(token != user.reset_token) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: "Invalid token, Please request another password recovery"
    })

    //check if the token isn't expired
    let now = new Date()
    now = now.setHours(now.getHours())

    if(now > user.reset_token_expires) return res.render('session/password-reset', {
        user: req.body,
        token,
        error: "Token expired, Please request another password recovery"
    })

    req.user = user

    next()
}

module.exports = {
    login,
    forgot,
    reset
}