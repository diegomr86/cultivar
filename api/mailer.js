'use strict'
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
})

module.exports = {
  send: async (to, subject, text, html) => {
    const info = await transporter.sendMail({
      from: '"Cultivar Brasil 🌱❤️🌻" <' + process.env.SMTP_USER + '>', // sender address
      to,
      subject,
      text,
      html,
    })

    console.log('Message sent:')
    console.log(info)
    return info
  },
}
