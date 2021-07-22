const User = require('../models/user')

 async function post(req, res, next) {

    const keys = Object.keys(req.body)

    for (key in keys) {
        if (req.body[key] == "") {
            return res.send("Please fill all the fields")
        }
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

    if(password != passwordConfirm) {
        return res.render("user/register", { user: req.body, error: " Password doesn't match." })
    }
    next()
}

module.exports = {
    post
} 