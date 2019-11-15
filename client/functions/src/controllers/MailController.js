const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  sendMail (req, res) {
    console.log(req.body.from)
    console.log(req.body.subject)
    console.log(req.body.text)
    const from = req.body.from
    const subject = req.body.subject
    const text = req.body.text

    nodemailer.createTestAccount((err, account) => {
      console.log(err)
      console.log(account)
      let transporter = nodemailer.createTransport({
        host: 'smtp.googlemail.com', // Gmail Host
        port: 465, // Port
        secure: true, // this is true as port is 465
        auth: {
          user: process.env.APP_GMAIL_USER, //Gmail username
          pass: process.env.APP_GMAIL_PASS // Gmail password
        }
      });

      let mailOptions = {
        from: `${from} <lectio.divina33@gmail.com>`,
        to: 'lectio.divina33@gmail.com', // Recepient email address. Multiple emails can send separated by commas
        subject: subject,
        text: text
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.send(info.messageId)
        console.log('Message sent: %s', info.messageId);
      });
    });
  }
}
