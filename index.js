const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', socket.id + ": "+ msg);
  });
});

io.on('connection', (socket) => {
    socket.on('chat message', ( msg) => {
      console.log(msg);
    });
  });

  io.on('connection', (socket) => {
    console.log('user ' + socket.id + ' connected');
    socket.on('disconnect', () => {
      console.log('user ' + socket.id + ' disconnected');
    });
  });


server.listen(80, () => {
  console.log('server running at port 80');
});