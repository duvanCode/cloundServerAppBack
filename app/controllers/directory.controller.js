const Joi = require('joi');
const { directoryCreateProvider,getDirectorysByUserID,deleteDirectorysById, createFileDataProvider } = require('../providers/directory.providers.js');

const directoryCreateController = async (req, res) => {

    try {

        const fatherID = req.body?.fatherID ?? null;
        const name = req.body?.name ?? null;
        const type = req.body?.type ?? null;
        const fileID = req.body?.fileID ?? null;
        const fileUrl = req.body?.fileUrl ?? null;
        const originalSize = req.body?.originalSize ?? null;
        const mimeType = req.body?.mimeType ?? null;
        const userID = req.userID;
        let validate;

        if(type == 'file')
        {
             validate = Joi.object({
                fatherID: Joi.string().min(1).required(),
                name: Joi.string().min(5).required(),
                type: Joi.string().min(2).required(),
                fileID: Joi.string().min(2).required(),
                fileUrl: Joi.string().min(2).required(),
                originalSize: Joi.string().min(2).required(),
                mimeType: Joi.string().min(2).required()
            });
        } else {
             validate = Joi.object({
                fatherID: Joi.string().min(1).required(),
                name: Joi.string().min(5).required(),
                type: Joi.string().min(2).required()
            });
        }
        
        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        let dataFile = null;
        if(type == 'file') {
            dataFile = {
                fileID:fileID,
                fileUrl:fileUrl,
                originalSize:originalSize,
                mimeType:mimeType,
                tumblerId:null,
                tumblerUrl:null
            };
        };
        let tags = null;

        let directoryObject = {
            fatherID,
            name,
            tags,
            type,
            dataFile,
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

const deleteDirectoryController = async (req, res) => {

    try {
        const directoryID = req.params.id;
        const userID = req.userID;

        const validate = Joi.object({
        });
        
        const { error } = validate.validate(req.body);

        if (error) return res.status(400).json({
            "success": false,
            "message": 'error entering data',
            "data": error.details.map(a => a?.message)
        });

        res.json(await deleteDirectorysById(directoryID));

    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'error',
            "data": null
        });
    }

}

module.exports = { directoryCreateController, getDirectoryController, deleteDirectoryController };