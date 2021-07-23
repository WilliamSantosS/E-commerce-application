const User = require('../models/user')
const { compare } = require('bcryptjs')

function checkAllField(body) {
    const keys = Object.keys(body)

    for (key in keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Please fill all the fields!'
            }
        }
    }
}

async function show(req, res, next) {
    const { userId: id } = req.session
    const user = await User.findOne({ where: { id } })

    if (!user) return res.render("user/register", {
        error: "User not found"
    })

    req.user = user

    next()
}

async function post(req, res, next) {
    const fillAllFields = checkAllField(req.body)
    if (fillAllFields) {
        return res.render("user/register", fillAllFields)
    }

    let { email, cpf_cnpj, password, passwordConfirm } = req.body

    cpf_cnpj = cpf_cnpj.replace(/\D/g, "")

    const user = await User.findOne({
        where: { email },
        or: { cpf_cnpj }
    })

    if (user) {
        return res.render("user/register", { user: req.body, error: "User already exists." })
    }

    if (password != passwordConfirm) {
        return res.render("user/register", { user: req.body, error: " Password doesn't match." })
    }
    next()
}

async function update(req, res, next) {
    const fillAllFields = checkAllField(req.body)
    if (fillAllFields) {
        return res.render("user/index", fillAllFields)
    }

    const { id, password } = req.body

    if (!password)
        return res.render(
            "user/index", {
            user: req.body,
            error: "Insert your password to update your account"
        })

    const user = await User.findOne({ where: {id} })

    const passed = await compare(password, user.password)

    if (!passed) return res.render("user/index", {
        user: req.body,
        error: "Invalid password"
    })

    req.user = user
    next()

}

module.exports = {
    post,
    show,
    update
}