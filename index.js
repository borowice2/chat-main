// Importování potřebných knihoven a modulů
const express = require('express'); // Express.js pro webovou aplikaci
const { createServer } = require('node:http'); // Node.js HTTP server
const { join } = require('node:path'); // Node.js modul pro práci s cestami
const { Server } = require('socket.io'); // Socket.io pro komunikaci v reálném čase
var mysql = require('mysql2'); // MySQL2 pro komunikaci s databází
const path = require('path') // Modul pro práci s cestami v souborovém systému
const bodyParser = require('body-parser'); // Middleware pro zpracování požadavků s těly

// Inicializace Express aplikace
const app = express();

// Vytvoření HTTP serveru pomocí Express aplikace
const server = createServer(app);

// Inicializace Socket.io na serveru
const io = new Server(server);

// Nastavení připojení k databázi MySQL
const connection = mysql.createConnection({
  host: '192.168.1.161', // Název nebo IP adresa serveru databáze
  user: 'tomas.borowski', // Uživatelské jméno
  password: 'tomasborowski55', // Heslo
  database: 'tomas.borowski', // Název databáze
  port: 3001
})

// Definice cesty pro zpracování HTTP POST požadavku na vytvoření tabulky
app.post('/signin', function (request, response, next) {
  console.log(`Byl obdržen požadavek na vytvoření tabulky s loginem: ${request.body.login}`)
   
  // Aktualizace záznamu v tabulce
  const login = request.body.login; // ID záznamu, který chcete aktualizovat
  
  const sqlQuery = `CREATE TABLE ${login} LIKE timetable`;
 
  // Vykonání dotazu do databáze
  dbConnection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Chyba při vytváření tabulky: ' + err.stack);
      return;
    }
    console.log(`Tabulka s loginem: ${request.body.login} byla úspěšně vytvořena.`);
  });
});

// Definice cesty pro zpracování HTTP GET požadavku na chatovou stránku
app.get('/chat', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Naslouchání na události připojení klienta k Socket.io
io.on('connection', (socket) => {
  // Naslouchání na událost 'chat message' pro přijetí zprávy od klienta
  socket.on('chat message', (msg) => {
    // Odeslání zprávy všem klientům připojeným k Socket.io
    io.emit('chat message', socket.id + ": " + msg);
  });
});

// Naslouchání na události odpojení klienta od Socket.io
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user ' + socket.id + ' disconnected');
  });
});

// Spuštění HTTP serveru na portu 80
server.listen(80, () => {
  console.log('server running at port 80');
});
