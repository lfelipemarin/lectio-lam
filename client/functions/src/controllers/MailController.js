const nodemailer = require('nodemailer');
// const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  sendMail (req, res) {
    console.log(req.body)
    const firstName = req.body.firstName ? req.body.firstName : 'Anónimo'
    const lastName = req.body.lastName ? req.body.lastName : ''
    const from = req.body.email
    const subject = "Lectio Divina bug or message"
    const text = req.body.text
    const uid = req.body.uid

    if (uid) {
      // add err, account if needed
      nodemailer.createTestAccount(() => {
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
          html: `${firstName} ${lastName} ha escrito ó reportado:<br><br>${text}`,
        };

        if (req.file) {
          mailOptions.attachments = [
            {
              filename: req.file.originalname,
              content: new Buffer.from(req.file.buffer)
            }
          ]
        }

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
}
