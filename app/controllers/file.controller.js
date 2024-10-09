const { getTokenFile } = require('../services/file.service');

const getTokenFileController = async (req, res) => {

    try {
        
        res.json(await getTokenFile());


    } catch (error) {
        console.log(error);
        res.status(500).json({
            "success": false,
            "message": 'error',
            "data": null
        });
    }

}

module.exports = { getTokenFileController };