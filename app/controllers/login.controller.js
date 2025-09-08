
const Joi = require('joi');
const { loginProvider, registerProvider } = require('../providers/login.providers.js');

const loginController = async (req, res) => {

    try {
        const username = req.body?.username ?? null;
        const password = req.body?.password ?? null;

        const validate = Joi.object({
            username: Joi.string().min(5).required(),
            password: Joi.string().min(5).required()
        });
        

        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        res.json(await loginProvider(username, password));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'error',
            "data": null
        });
    }

}

const registerController = async (req, res) => {

    try {
        const username = req.body?.username ?? null;
        const password = req.body?.password ?? null;
        const name = req.body?.name ?? null;
        const phone = req.body?.phone ?? null;

        const validate = Joi.object({
            username: Joi.string().min(5).required(),
            password: Joi.string().min(5).required(),
            name: Joi.string().min(5).required(),
            phone: Joi.string().min(5).required()

        });
        
        const { error } = validate.validate(req.body);

        
        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        let estadoSing = await registerProvider(username, password, name, phone);

        res.json(estadoSing);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'server internal error',
            "data": null
        });
    }

}

module.exports = { loginController,registerController };