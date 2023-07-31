const express = require('express');
const router = express.Router();

const { authController: controller } = require('@controllers');
const { validator } = require('@helpers');

router.get('/register-login', controller.renderRegisterLogin);
router.post('/register', validator.userRegisterFormValidate, controller.register);
router.post('/login', validator.userLoginFormValidate, controller.login);
router.get('/logout', controller.logout);
router.post('/resetPassword', controller.resetPassword);
router.post('/changeInfo', controller.changeInfo);
router.post('/changePassword', validator.userChangePasswordFormValidate, controller.changePassword);

module.exports = router;
