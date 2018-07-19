var nodemailer = require('nodemailer');
require('dotenv').config()
const {EMAIL, PASSWORD} = process.env;

module.exports = function(to){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
               user: EMAIL,
               pass: PASSWORD
           }
       });
       console.log(to,"pineapple")
       const mailOptions = {
        from: 'lapstopsupp@gmail.com', // sender address
        to: String(to),
        subject: 'An important notification from LapStop', // Subject line
        html: '<p>Your laptop may be compromised.  You are receiving this message because your laptop was secured while using LapStop and the app went into a hidden state.</p>'// plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)

        else
          console.log(info);
     });
}