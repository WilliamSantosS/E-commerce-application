const { unlinkSync } = require('fs')
const { hash } = require('bcryptjs')
const User = require('../models/user')
const Product = require('../models/product')
const { formatCep, formatCpfCnpj } = require('../../lib/utils')
const LoadService = require('../services/LoadProductService')

module.exports = {

  registerForm(req, res) {
    return res.render("user/register")
  },

  async show(req, res) {
    const { user } = req

    user.cpf_cnpj = formatCpfCnpj(user.cpf_cnpj)
    user.cep = formatCep(user.cep)
    return res.render('user/index', { user })
  },

  async post(req, res) {
    try {
      let { name, email, password, cpf_cnpj, cep, address } = req.body
      password = await hash(password, 8)

      cpf_cnpj = cpf_cnpj.replace(/\D/g,"")
      cep = cep.replace(/\D/g,"")

      const userId = await User.create({
        name, 
        email,
        password,
        cpf_cnpj,
        cep,
        address
      })

      req.session.userId = userId
  
      return res.redirect('/users')
    } catch (error) {
      console.error(error)
    }

   

  },

  async update(req, res) {
    try {
      const { user } = req
      let { name, email, cpf_cnpj, cep, address, } = req.body

      cpf_cnpj = cpf_cnpj.replace(/\D/g, "")
      cep = cep.replace(/\D/g, "")

      await User.update(user.id, {
        name,
        email,
        cpf_cnpj,
        cep,
        address
      })

      return res.render('user/index', {
        user: req.body,
        success: "Account successfully updated"
      })

    } catch (err) {
      console.error(err)
      return res.render("user/index", {
        error: "Something went wrong"
      })
    }
  },

  async delete(req, res) {
    try { 
      const products = await Product.findAll({where: {user_id: req.body.id}})

           //get all images
            const allFilesPromise = products.map(product =>
            Product.files(product.id))

        let promiseResults = await Promise.all(allFilesPromise)

    //     //remove the user
              await User.delete(req.body.id)
              req.session.destroy()

        //remove the images of public folder
        promiseResults.map(files => {
          files.map(file => {
                try {
                    unlinkSync(file.path)
                } catch (err) {
                    console.error(err)
                }
            })   
        })
        return res.render("session/login", {
          success: "Account deleted successfully!"
        })

    } catch (err) {
      console.error(err) 
      return res.redirect("users/index", {
        user: req.body,
        error: "Something went wrong, please try again"
      })
    }
  },

  async ads(req, res) {
    const products = await LoadService.load('products', {
      where: { user_id: req.session.userId }
    })
    return res.render("user/ads", { products })
  }
}

