
const express = require('express');
const router = express.Router();
const { videoToken } = require('../services/twilioService');

const config = require('../utils/twilioToken');


router.post('/', (req, res) => {
  const identity = req.body.identity;
  const room = req.body.room;
  const token = videoToken(identity, room, config);
  res.set('Content-Type', 'application/json');
  res.send(
    JSON.stringify({
      token: token.toJwt()
    })
  );
});



module.exports = router