const loginEvents = require("./login.js");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado ✅", socket.id);

    loginEvents(io, socket);

  });
};