// Production entry point for cPanel/Passenger and npm start.
process.env.NODE_ENV = 'production';
const http = require('node:http');
const next = require('next');

const port = Number(process.env.PORT || 3000);
const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => {
        Promise.resolve(handle(req, res)).catch(() => {
          if (!res.headersSent) res.writeHead(500);
          res.end('Unable to load this page.');
        });
      })
      .on('error', (error) => {
        console.error(error);
        process.exit(1);
      })
      .listen(port);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
