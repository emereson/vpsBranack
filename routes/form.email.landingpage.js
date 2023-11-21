const express = require('express');
const router = express.Router();

const { sendEmail } = require('../services/email');


router.post('/', function (request, response) {
  const body = request.body;
  sendEmail(body.from, body.subject, body.mailContent)
    .then(function (info) {
      response.status(200).send({
        success: true,
        message: 'Email successfuly sent',
        emailReponse: info
      })
    })
    .catch(function (err) {
      response
        .status(500)
        .send('ocurrio un error por favor intente nuevamente');
      console.log(err);
    });
});

module.exports = router;