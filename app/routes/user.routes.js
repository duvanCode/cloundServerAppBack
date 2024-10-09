const express = require('express');

const userController = require('../controllers/user.controller.js');
const auth = require('../middlewares/auth.middleware.js');
const routerUser = express.Router();

routerUser.get('/info', auth, userController);

module.exports = routerUser;