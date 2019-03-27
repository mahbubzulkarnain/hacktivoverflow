var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_AUTH_EMAIL,
    pass: process.env.NODEMAILER_AUTH_PASSWORD
  }
});

module.exports = function (data, done) {
  transporter.sendMail({
    from: 'HacktivOverflow - noreply@hacktivoverflow.cloudeyeglobal.com',
    to: data.user.email,
    subject: 'Weekly report to '+data.user.fullname,
    html: `
    <b>Your weekly report,</b><br>
    <br>
    <b>Question</b> : ${data.question}<br> 
    <b>Answer</b> : ${data.answer}<br>
    <br>
    <br>
    regard,<br>
    <br>
    HacktivOverflow Teams 
    `
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      done();
      console.log('Email sent: ' + info.response);
    }
  });
};