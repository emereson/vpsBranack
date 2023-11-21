const express = require("express");
const router = express.Router();
var { sendEmail } = require("../services/email");

router.post("/", async (req, res) => {
  try {
    const { from, subject, mailContent } = req.body;
    const sendingEmialResponse = await sendEmail(from, subject, mailContent);
    console.log(sendingEmialResponse);
    return res.status(200).send({
      success: true,
      message: "Email successfuly sent",
      emailReponse: sendingEmialResponse,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error sending booking emial",
      error,
    });
  }
});

module.exports = router;
