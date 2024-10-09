const jwt = require('jsonwebtoken');
const { insertDocument, getDocuments } = require('../models/model.js');
const bcrypt = require('bcrypt');

async function verificarpass(contrasenaIngresada, contrasenaHash) {
    try {
        const esValida = await bcrypt.compare(contrasenaIngresada, contrasenaHash);

        return {
            "success": true,
            "message": 'ok',
            "data": esValida
        };
    } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        return {
            "success": false,
            "message": 'Error al verificar clave hash',
            "data": null
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
    } catch (error) {
        console.error('Error al generar el hash:', error);
        return {
            "success": false,
            "message": 'Error al generar hash',
            "data": null
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
    return {
        now:formatearFecha(fechaActual),
        tomorrow:formatearFecha(fechaDosDiasMas)
    };
}

const generateUUID = () => {

    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

const loginProvider = async (username,password) => {

    let userGet = await getDocuments({ username: username }, process.env.MONGO_COLLECTION_USER);

    if (!(userGet.length > 0)) return {
        "success": false,
        "message": 'inexisting user',
        "data": null
    }

    let estadoPass = await verificarpass(password,userGet[0].password);

    if(!(estadoPass.success)) return estadoPass;

    if(!(estadoPass.data)) return {
        "success": false,
        "message": 'Unauthorized',
        "data": null
    }

    let tokenUser = await generateUserToken(userGet[0]._id);

    if(!(tokenUser.success)) return tokenUser;

    return {
        "success": true,
        "message": 'user logged successfully',
        "data": tokenUser.data
    }

}

async function registerProvider(username,password,name,phone) {

    let userGet = await getDocuments({ username: username }, process.env.MONGO_COLLECTION_USER);

    if (userGet.length > 0) {
        return {
            "success": false,
            "message": 'existing user',
            "data": null
        };

    }

    let passwordHash = await getHash(password);

    if(!(passwordHash.success)) return passwordHash;

    const user = {
        "username": username,
        "password":passwordHash.data,
        "name": name,
        "phone":phone,
    }

    let id = await insertDocument(user, process.env.MONGO_COLLECTION_USER);

    if (!id) return {
        "success": false,
        "message": 'error creating user',
        "data": null
    }
    
    let tokenUser = await generateUserToken(id);

    if(!(tokenUser.success)) return tokenUser;

    return {
        "success": true,
        "message": 'user created successfully',
        "data": tokenUser.data
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

        if(!(tokenID)) return {
            "success": false,
            "message": 'error al ingresar el token',
            "data": null
        };

        let tokenJWT = jwt.sign({ guuID: guuID }, process.env.JWT_SECRET);

        return {
            "success": true,
            "message": 'ok',
            "data": {
                "token":tokenJWT
            }
        }
        
    } catch (e) {

        return {
            "success": false,
            "message": 'error al generar token',
            "data": e
        };
    
    }

};

module.exports = { loginProvider, registerProvider };