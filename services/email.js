var nodemailer = require("nodemailer");

function sendEmail(from, subject, mailContent) {
  return new Promise(function (resolve, reject) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "branakschool@gmail.com",
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });

    const mailOptions = {
      from: "branakschool@gmail.com",
      to: process.env.RECEIVER_EMAIL,
      subject: subject,
      html: `
      <h1>Mail From Branak</h1>
      <h2>From: ${from}</h2>
      <p>${mailContent}</p>
      `,
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
}

// sendEmail("prueba@correo.com", "probando", "mensaje")
//   .then(function(info) {
//     console.log(info);
//   })
//   .catch(function(err) {
//     console.log(err);
//   });

module.exports = {
  sendEmail,
};
