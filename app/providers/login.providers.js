const jwt = require('jsonwebtoken');
const { insertDocument, getDocuments, getDocumentById } = require('../models/model.js');
const bcrypt = require('bcrypt');

async function verificarpass(contrasenaIngresada, contrasenaHash) {
    try {
        const esValida = await bcrypt.compare(contrasenaIngresada, contrasenaHash);

        return {
            "success": true,
            "message": 'ok',
            "data": esValida
        };
    } catch (e) {

        return {
            "success": false,
            "message": 'Error al verificar clave hash',
            "data": process.env.DEBUG == "true" ? e : NULL
        }
    }
}

async function getHash(pass) {
    try {
        const saltRounds = 10;
        const passHash = await bcrypt.hash(pass, saltRounds);
        return {
            "success": true,
            "message": 'ok',
            "data": passHash
        };
    } catch (e) {

        return {
            "success": false,
            "message": 'Error al generar hash',
            "data": process.env.DEBUG == "true" ? e : NULL
        }
    }
}

const formatearFecha = (fecha) => {
    const opciones = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    return new Intl.DateTimeFormat('sv-SE', opciones).format(fecha).replace(' ', 'T').replace('T', ' ');
}

const getDate = () => {
    const fechaActual = new Date();

    const fechaDosDiasMas = new Date(fechaActual);
    fechaDosDiasMas.setDate(fechaDosDiasMas.getDate() + 2);

    const fechaUnMinMas = new Date(fechaActual);
    fechaUnMinMas.setMinutes(fechaUnMinMas.getMinutes() + 1);

    return {
        now: formatearFecha(fechaActual),
        tomorrow: formatearFecha(fechaDosDiasMas),
        oneMinutesLater: formatearFecha(fechaUnMinMas)
    };
};


const generateUUID = () => {

    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}


const loginProvider = async (username, password) => {


    try {

        let userGet = await getDocuments({ username: username }, process.env.MONGO_COLLECTION_USER);

        if (!(userGet?.length > 0)) return {
            "success": false,
            "message": 'inexisting user',
            "data": null
        }

        let estadoPass = await verificarpass(password, userGet[0].password);

        if (!(estadoPass.success)) return estadoPass;

        if (!(estadoPass.data)) return {
            "success": false,
            "message": 'Unauthorized',
            "data": null
        }

        let tokenUser = await generateUserToken(userGet[0]._id);

        if (!(tokenUser.success)) return tokenUser;

        return {
            "success": true,
            "message": 'user logged successfully',
            "data": tokenUser.data
        }

    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": process.env.DEBUG == "true" ? e : NULL
        };

    }

}

const loginQrProvider = async (UserID) => {


    try {

        let userGet = await getDocumentById(UserID, process.env.MONGO_COLLECTION_USER);

        if (!(userGet)) return {
            "success": false,
            "message": 'inexisting user',
            "data": null
        }

        let tokenUser = await generateUserToken(userGet._id);

        if (!(tokenUser.success)) return tokenUser;

        return {
            "success": true,
            "message": 'user logged successfully',
            "data": tokenUser.data
        }

    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": process.env.DEBUG == "true" ? e : NULL
        };

    }

}

async function registerProvider(username, password, name, phone) {

    try {

        let userGet = await getDocuments({ username: username }, process.env.MONGO_COLLECTION_USER);

        if (userGet.length > 0) {
            return {
                "success": false,
                "message": 'existing user',
                "data": null
            };

        }

        let passwordHash = await getHash(password);

        if (!(passwordHash.success)) return passwordHash;

        const user = {
            "username": username,
            "password": passwordHash.data,
            "name": name,
            "phone": phone,
        }

        let id = await insertDocument(user, process.env.MONGO_COLLECTION_USER);

        if (!id) return {
            "success": false,
            "message": 'error creating user',
            "data": null
        }

        let tokenUser = await generateUserToken(id);

        if (!(tokenUser.success)) return tokenUser;

        return {
            "success": true,
            "message": 'user created successfully',
            "data": tokenUser.data
        }

    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": process.env.DEBUG == "true" ? e : NULL
        };

    }

}

const generateUserToken = async (userID) => {

    try {

        let dates = getDate();
        let createdDate = dates.now;
        let expirationDate = dates.tomorrow;
        let guuID = generateUUID();


        let userToken = {
            userID,
            createdDate,
            expirationDate,
            guuID,
        };


        let tokenID = await insertDocument(userToken, process.env.MONGO_COLLECTION_TOKENS);

        if (!(tokenID)) return {
            "success": false,
            "message": 'error al ingresar el token',
            "data": null
        };

        let tokenJWT = jwt.sign({ guuID: guuID }, process.env.JWT_SECRET);

        return {
            "success": true,
            "message": 'ok',
            "data": {
                "token": tokenJWT
            }
        }

    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": process.env.DEBUG == "true" ? e : NULL
        };

    }

};

const setQrUserProvider = async (socketUserID) => {

    try {

        let dates = getDate();
        let createdDate = dates.now;
        let expirationDate = dates.oneMinutesLater;
        let guuID = generateUUID();


        let socketUser = {
            createdDate,
            expirationDate,
            socketUserID,
            guuID,
        };

        let tokenID = await insertDocument(socketUser, process.env.MONGO_COLLECTION_QR_CLIENTS);

        if (!(tokenID)) return {
            "success": false,
            "message": 'error al ingresar el Qr',
            "data": null
        };

        return {
            "success": true,
            "message": 'ok',
            "data": {
                guuID
            }
        }

    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": process.env.DEBUG == "true" ? e : NULL
        };

    }

};

const getQrCodeProvider = async (guuID) => {

    try {

        let userQr = await getDocuments({ guuID: guuID }, process.env.MONGO_COLLECTION_QR_CLIENTS);

        if (!(userQr.length > 0)) return {
            "success": false,
            "message": 'inexisting Qr',
            "data": null
        }

        const currentDate = new Date();
        const qrExpirationDate = new Date(userQr[0]['expirationDate']);

        if (qrExpirationDate <= currentDate) {
            return {
                "success": false,
                "message": 'QR code has expired',
                "data": null
            }
        }

        return {
            "success": true,
            "message": 'user logged successfully',
            "data": userQr[0]
        }

    } catch (e) {

        return {
            "success": false,
            "message": 'error al obtener Qr',
            "data": process.env.DEBUG == "true" ? e : NULL
        };

    }

}

module.exports = { loginProvider, registerProvider, setQrUserProvider, loginQrProvider, getQrCodeProvider };