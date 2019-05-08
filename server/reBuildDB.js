const http = require("http");
const app = require("./app");
const SocketSingleton = require("./socket");

const { connection } = require("./database/informativeModel");

const server = http.Server(app);
SocketSingleton.configure(server);

const port = app.get("port");
connection.sync({ force: true }).then(() => {
  server.listen(port, () => console.log(`the server started on port ${port}`));
});
