const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: 'kristoffer.leuschke@ethereal.email',
    pass: 'j3VWghRF6saA9KEz1b'
  }
})


module.exports.sendEmail = async ( email ) => {
    
  const mail = await transporter.sendMail({
    from: email,
    to: email,
    subject: "Purchase confirmation email",
    text: "Your purchase has been confirmed!!!",

  })
  return mail
}
