const http = require("http");

const app = require("./app");
const { startRedis } = require("./configs/storage.config");

require("dotenv").config();

const httpServer = http.createServer(app);

async function startServer() {
  await startRedis();

  httpServer.listen(process.env.PORT, () => {
    console.log(`The application is listening on port ${process.env.PORT}`);
  });
}

startServer();
