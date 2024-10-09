require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = require('./swagger.js');
const routerLogin = require('./app/routes/login.routes.js');
const routerUser = require('./app/routes/user.routes.js');
const homeRoute = require('./app/routes/home.routes.js');
const routerDirectory = require('./app/routes/directory.routes.js');
const routerFile = require('./app/routes/file.routes.js');

let app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',homeRoute);
app.use('/api',routerLogin);
app.use('/api/user',routerUser);
app.use('/api/directory',routerDirectory);
app.use('/api/file',routerFile);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

app.listen(3001, () => {
    console.log("Todo bien, todo correcto y yo que me alegroo. 😎");
  });