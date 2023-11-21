const cloudinary = require('cloudinary').v2;
const { UserModel } = require('../models/sequelize');
const { encryptPass } = require('../utils/encrypt');

module.exports = {
  async createUser(body) {
    const { firstName, lastName, email, isAdmin, isTeacher, isStudent, active } = body
    let { password } = body
    if (password) {
      const encryptedPass = await encryptPass(password);
      password = encryptedPass
    }
    const user = await UserModel.create({
      firstName, lastName, email, isAdmin, password, isTeacher, isStudent, active
    });
    return user
  },
  async createUserChat(body) {
    const { userName: firstName } = body
    const user = await UserModel.create({
      firstName,
      isAdmin: false,
      isTeacher: false,
      isStudent: false,
      isVisitant: true,
    });
    return user
  },

  async uploadAvatar(body) {
    const { avatar, user } = body;
    try {
      const uploadResponse = await cloudinary.uploader.upload(avatar);
      console.log(uploadResponse);
      const foundUser = await UserModel.findByPk(user.id)
      await foundUser.update({ avatar: uploadResponse.secure_url })
      return foundUser;
    } catch (error) {
      console.log(err);
      throw new Error({ message: 'Fail to upload img' })
    }
  }
}
