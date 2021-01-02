const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
const config = {
  port: 4000,
};

app.use(express.static("public"));

const messages = [
  {
    id: 1,
    author: "<mark>Administrador</mark>",
    text: "Bienvenido al chat, creador por zNareak",
    isAdmin: true,
    perfilImage:
      "https://i.pinimg.com/originals/6f/9f/57/6f9f572271f4c2142231738a8ea6eafa.gif",
  },
];

io.on("connection", (socket) => {
  console.log("Alguien se conecto");
  socket.emit("messages", messages);

  socket.on("new-message", (message) => {
    messages.push(message);
    io.sockets.emit("messages", messages);
  });
});

server.listen(config.port, () => {
  console.log("Servidor iniciado en " + config.port);
});
