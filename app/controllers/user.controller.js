
const { getUserByID } = require('../providers/user.providers.js');

const userController = async (req, res) => {

    try {
        console.log(req.userID);
        let result = await getUserByID(req.userID);

        return res.status(200).json(result);

    } catch (e) {
        return res.status(200).json({
            "success":false,
            "message":"error to find user",
            "data":null
        });
    }

};

module.exports = userController;