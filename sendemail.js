var nodemailer = require('nodemailer');
require('dotenv').config()
const {EMAIL, PASSWORD} = process.env;

module.exports = function(to){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: EMAIL,
               pass: PASSWORD
           }
       });
       console.log(to,"pineapple")
       const mailOptions = {
        from: 'jschrom311@gmail.com', // sender address
        to: String(to),
        subject: 'ASDF', // Subject line
        html: '<p>Your html here</p>'// plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)

        else
          console.log(info);
     });
}