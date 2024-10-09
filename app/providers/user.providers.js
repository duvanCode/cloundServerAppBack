const { getDocumentById } = require('../models/model.js');

const getUserByID = async (userID) => {
    try {
        let userInfo;

        userInfo = await getDocumentById(userID,process.env.MONGO_COLLECTION_USER);
        delete userInfo.password;
        delete userInfo._id;

        if(userInfo){
            return {
                "success":true,
                "message":"ok",
                "data":userInfo
            };
        } else {
            return {
                "success":false,
                "message":"user no found",
                "data":null
            };
        }
    } catch (e)
    {
        return {
            "success":false,
            "message":"error to find user",
            "data":e
        };
    }
};

module.exports = { getUserByID }