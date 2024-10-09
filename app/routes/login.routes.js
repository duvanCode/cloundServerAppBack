const express = require('express');

const { loginController, registerController } = require('../controllers/login.controller.js');

const routerLogin = express.Router();

routerLogin.post('/register', registerController);
routerLogin.post('/login', loginController);

module.exports = routerLogin;
