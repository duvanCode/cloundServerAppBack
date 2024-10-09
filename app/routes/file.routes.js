const express = require('express');

const { getTokenFileController } = require('../controllers/file.controller.js');
const auth = require('../middlewares/auth.middleware.js');

const routerFile = express.Router();

routerFile.get('/getToken', auth, getTokenFileController);

module.exports = routerFile;
