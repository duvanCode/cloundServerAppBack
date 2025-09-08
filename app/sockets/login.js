const { loginQrProvider, getQrCodeProvider,setQrUserProvider } = require('../providers/login.providers.js');

module.exports = (io, socket) => {

  socket.on("login:getQr", async () => {

    try {

        let qrLogin = await setQrUserProvider(socket.id);

        io.to(socket.id).emit("login:getQr", qrLogin);

      } catch (e) {

        io.to(socket.id).emit("login:getQr", {
            "success": false,
            "message": 'error al generar Qr:1',
            "data": process.env.DEBUG == "true" ? e : NULL
        });
    
      }

  });

  socket.on("login:validateQr",async (data) => {

    try {

        const { guuID,userID } = data;

        let qrLogin = await getQrCodeProvider(guuID);

        if(!qrLogin.success)
        {
          io.to(socket.id).emit("login:validateQr", {
              "success": false,
              "message": qrLogin?.message??'',
              "data": null
          });

          return;
        }

        let userToken = await loginQrProvider(userID);
        
        if(!userToken.success)
        {
          io.to(socket.id).emit("login:validateQr", {
              "success": false,
              "message": 'error al generar Qr:3',
              "data": null
          });

          return;
        }

        let socketUserID = qrLogin.data?.socketUserID;
        let token = userToken.data?.token;

        io.to(socketUserID).emit("login:validateQr", { token });

      } catch (e) {

        io.to(socket.id).emit("login:validateQr", {
            "success": false,
            "message": 'error al generar Qr:4',
            "data": process.env.DEBUG == "true" ? e : NULL
        });
    
      }
  });

};