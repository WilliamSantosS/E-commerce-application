const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "944186476dcd93",
      pass: "bb87f322c3fb68"
    }
  });

