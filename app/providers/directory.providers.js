const { insertDocument, getDocuments } = require('../models/model.js');

const directoryCreateProvider = async (directoryObject) => {

    try {
        //const { fatherID,name,tags,type,dataID,userID } = directoryObject;

        let resultID = await insertDocument(directoryObject, process.env.MONGO_COLLECTION_DIRECTORY);

        if (resultID) return {
            "success": true,
            "message": 'ok',
            "data": resultID
        };

        return {
            "success": false,
            "message": 'error al ingresar el directory',
            "data": null
        };

    } catch (e) {

        return {
            "success": false,
            "message": 'error c al ingresar el directory',
            "data": null
        };
    }

}

const getDirectorysByUserID = async (userID,fatherID) => {
    try {
        let directoryObject = {
            userID,
            fatherID
        };

        let result = await getDocuments(directoryObject, process.env.MONGO_COLLECTION_DIRECTORY);

        if (result) return {
            "success": true,
            "message": 'ok',
            "data": result
        };

        return {
            "success": true,
            "message": 'directory empty',
            "data": []
        };

    } catch (e) {

        return {
            "success": false,
            "message": 'error c al ingresar el directory',
            "data": null
        };
    }
};

module.exports = { directoryCreateProvider, getDirectorysByUserID };