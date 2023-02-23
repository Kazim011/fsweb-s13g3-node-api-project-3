const express = require("express");
const { logger } = require("./middleware/middleware");
const userRouter = require("./users/users-router");

const server = express();
server.use(express.json());
server.use("/api/users", userRouter);
require("dotenv").config();
// ekspres'in varsayılan olarak istek gövdelerinde JSON'u ayrıştıramayacağını unutmayın

// global ara yazılımlar ve kullanıcı routelarının buraya bağlanması gerekir

server.use(logger);

server.get("/", (req, res) => {
  res.send(process.env.MESSAGE || ` <h2>Biraz ara yazılım yazalım!</h2>`);
});

module.exports = server;
