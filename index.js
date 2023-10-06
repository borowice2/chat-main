const express = require('express');
const { createServer, request } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
var mysql = require('mysql2');
const path = require('path')
const bodyParser = require('body-parser');


const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(bodyParser.urlencoded({ extended: false }));
// const connection = mysql.createConnection({
//   host: '192.168.1.161', // Název nebo IP adresa serveru databáze
//   user: 'tomas.borowski', // Uživatelské jméno
//   password: 'tomasborowski55', // Heslo
//   database: 'tomas.borowski', // Název databáze
//   port: 3001
// })

// app.post('/signin', function (request, response, next) {
 
//   console.log(`Byl obdržen požadavek na vytvoření taulky s loginem: ${request.body.login}`)
   
//     // Aktualizace záznamu v tabulce
//     const login = request.body.login; // ID záznamu, který chcete aktualizovat
    
//     const sqlQuery = `CREATE TABLE ${login} LIKE timetable`;
   
//     dbConnection.query(sqlQuery, (err, result) => {
//       if (err) {
//         console.error('Chyba při vytváření tabulky: ' + err.stack);
//         return;
//       }
//       console.log(`Tabulka s loginem: ${request.body.login} byla úspěšně vytvořena.`);
//     });
  
//   });

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket, request) => {

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