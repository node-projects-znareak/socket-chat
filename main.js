const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const config = {
  port: 8080,
};

app.use(express.static("public"));

const messages = [
  {
    id: 1,
    author: "Jesús",
    text: "ssdds",
  },
];

io.on("connection", (socket) => {
  console.log("Alguien se conecto");
  socket.emit("messages", messages);

  socket.on("new-message", (message) => {
    messages.push(message);
    io.sockets.emit("messages", messages)
  });
});

server.listen(config.port, () => {
  console.log("Servidor iniciado en " + config.port);
});
