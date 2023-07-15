const http = require("http");

const app = require("./app");

require("dotenv").config();

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, () => {
  console.log(`The application is listening on port ${process.env.PORT}`);
});
