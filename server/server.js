const http = require('http');
const https = require('https');
const fs = require('fs');
const app = require('./app');
const SocketSingleton = require('./socket');
const { connection } = require('./database/informativeModel');


const privateKey = fs.readFileSync('/etc/letsencrypt/live/flengineeringdesign.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/flengineeringdesign.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/flengineeringdesign.com/chain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca,
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

SocketSingleton.configure(httpServer);

const port = app.get('port');
connection.sync().then(() => {
  httpServer.listen(port, () => console.log(`the server started on port ${port}`));
  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });
});
