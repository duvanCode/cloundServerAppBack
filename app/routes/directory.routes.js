const express = require('express');

const { directoryCreateController, getDirectoryController,deleteDirectoryController } = require('../controllers/directory.controller.js');
const auth = require('../middlewares/auth.middleware.js');

const routerDirectory = express.Router();

routerDirectory.post('/create', auth, directoryCreateController);
routerDirectory.get('/get/:id', auth, getDirectoryController);
routerDirectory.delete('/delete/:id', auth, deleteDirectoryController);

module.exports = routerDirectory;
