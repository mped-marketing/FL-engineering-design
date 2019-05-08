const socket = require("socket.io");

const SocketSingleton = (() => {
  this.io = null;
  this.clients = [];
  this.configure = server => {
    this.io = socket(server, { transports: ["websocket"] });
    this.io.on("connection", sockett => {
      const clientWithId = {
        id: sockett.id,
        cookie: sockett.handshake.headers.cookie
      };
      this.clients.push(clientWithId);
    });
  };
  return this;
})();

module.exports = SocketSingleton;
