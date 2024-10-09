const Joi = require('joi');
const { directoryCreateProvider,getDirectorysByUserID } = require('../providers/directory.providers.js');

const directoryCreateController = async (req, res) => {

    try {

        const fatherID = req.body?.fatherID ?? null;
        const name = req.body?.name ?? null;
        const type = req.body?.type ?? null;
        const userID = req.userID;

        const validate = Joi.object({
            fatherID: Joi.string().min(1).required(),
            name: Joi.string().min(5).required(),
            type: Joi.string().min(2).required()
        });
        
        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        let dataID = null;
        let tags = null;

        let directoryObject = {
            fatherID,
            name,
            tags,
            type,
            dataID,
            userID
        };

        res.json(await directoryCreateProvider(directoryObject));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'error',
            "data": null
        });
    }

}

const getDirectoryController = async (req, res) => {

    try {
        const fatherID = req.params.id;
        const userID = req.userID;

        const validate = Joi.object({
        });
        
        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        res.json(await getDirectorysByUserID(userID,fatherID));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'error',
            "data": null
        });
    }

}

module.exports = { directoryCreateController,getDirectoryController };