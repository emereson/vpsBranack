const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/userController')

router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const user = await UsersController.createUser(body);
    return res.status(200).send({
      success: true,
      user
    })

  } catch (error) {
    return res.status(500).send({
      success: false,
      error
    });
  }
});

router.post('/avatar', async (req, res) => {
  try {
    const { body } = req;
    const user = await UsersController.uploadAvatar(body)
    return res.status(200).send({
      success: true,
      user
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      error
    });
  }
})

router.post('/chat', async (req, res) => {
  try {
    const { body } = req;
    const user = await UsersController.createUserChat(body);
    return res.status(200).send({
      success: true,
      loggedUser: user,
      token: '',
    })

  } catch (error) {
    return res.status(500).send({
      success: false,
      error,
      errorMessage: error.message
    });
  }
});

module.exports = router