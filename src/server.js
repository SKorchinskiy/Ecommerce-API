const http = require("http");

const app = require("./app");
const db = require("./configs/db.config");

require("dotenv").config();

const httpServer = http.createServer(app);

async function startServer() {
  await db.mysqlConnect();

  httpServer.listen(process.env.PORT, () => {
    console.log(`The application is listening on port ${process.env.PORT}`);
  });
}

startServer();
