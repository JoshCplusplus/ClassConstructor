const nodemailer = require('nodemailer');
const ActionUtil = require("./ActionUtil");

const ContactAction = {

    sendReport : async function(message){
        console.log("entered send report method");
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'cse110classconstructor@gmail.com',
              pass: 'Gillespie110!'
            }
          });
          
          var mailOptions = {
            from: 'cse110classconstructor@gmail.com',
            to: 'cse110classconstructor@gmail.com',
            subject: message.subject,
            text: message.body
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
}

module.exports = ContactAction;