const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const User = require('../models/user')

module.exports = {
    loginForm(req, res) {
        return res.render('session/login')
    },

    login(req, res) {
        req.session.userId = req.user.id

        return res.redirect("/users")
    },

    logout(req, res) {
        req.session.destroy()
        return res.redirect("/")
    },

    forgotForm(req, res) {
        return res.render("session/forgot-password")
    },

    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@e-commerce.com',
                subject: 'Password recovery',
                html: `
                    <h2>Forgot your password ?</h2>
                    <p>Don't worry, follow the link bellow to recover your password</p>
                    <p> 
                        <a href="http:localhost:3000/users/password-reset?token=${token}" target="_blank">
                            Password Recovery
                        </a>
                    </p>
                `,
            })
            return res.render("session/forgot-password", {
                success: "Check your e-mail to reset your password"
            })
        } catch (err) {
            console.error(err)
            return res.render('/session/forgot-password', {
                error: "Unexpected error, please try again"
            })

        }
    },

     resetForm(req, res) {
        return res.render("session/password-reset", { token:  req.query.token})
    },

    async reset(req, res) {
        const user = req.user
        const { password, token } = req.body
        try {
            //new password hash
            const newPassword = await hash(password, 8)
            //update user
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })
            //send a message for the user with the new password
            return res.render("session/login", {
                user: req.body,
                success: "Password updated"
            })
        } catch (err) {
            console.error(err)
            return res.render('session/password-reset', {
                user: req.body,
                token,
                error: "Unexpected error, please try again"
            })
        }
    }


}