var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

const sendEmail = (recepient, content) => {
  // create reusable transporter object using the default SMTP transport

  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD,
      },
    });

    let mail_configs = {
      from: process.env.EMAIL_USER,
      to: recepient,
      subject: 'Password Reset',
      html: content,
    };

    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: 'An error occured' });
      }
      return resolve({ message: 'Email sent successfully' });
    });
  });
};

module.exports = sendEmail;
