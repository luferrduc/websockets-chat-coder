import express from "express";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "node:path";
import { Server } from "socket.io";
import viewsRouter from './routes/views.routes.js'

const app = express();
const PORT = 8080;

app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", ".hbs");
// Middlewares
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", viewsRouter)

// Server
const server = app.listen(PORT, () => {
  console.log(`Server listening on  http://localhost:${PORT}`);
});

// Socket io
const socketServer = new Server(server)

const MESSAGES = []

socketServer.on("connection", socket => {
  console.log("Nuevo cliente conectado")

  socket.on("message", data => {
    MESSAGES.push(data)
    socketServer.emit("messageLogs", MESSAGES)
  })
  socket.on("authenticated", data => {
    // Enviamos todos los mensajes almacenados hastas el momento
    // solo al cliente que se acaba de conectar
    socket.emit("messageLogs", MESSAGES)
    socket.broadcast.emit("newUserConnected", data)
  })
})