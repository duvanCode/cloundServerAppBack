require('dotenv').config();
const axios = require('axios');

const getTokenFile = async () => {

    try {

        const formData = {
            "username":process.env.FILE_SERVICE_USER,
            "password":process.env.FILE_SERVICE_PASS
        };
        const response = await axios.post(process.env.FILE_SERVICE_URL + '/login', formData);

        if(response.status !== 200)
        {
            return {
                "success": false,
                "message": 'error al generar token(servicio)',
                "data": null
            };
        }

        if(response.data.success)
        {

            return {
                "success": true,
                "message": 'ok',
                "data": response.data.data
            };

        } else {

            return {
                "success": false,
                "message": 'error al generar token(servicio)',
                "data": null
            };
        }

    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": e
        };

    }

}

module.exports = { getTokenFile };