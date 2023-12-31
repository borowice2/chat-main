// Importování potřebných knihoven a modulů
const express = require('express'); // Express.js pro webovou aplikaci
const { createServer } = require('node:http'); // Node.js HTTP server
const { join } = require('node:path'); // Node.js modul pro práci s cestami
const { Server } = require('socket.io'); // Socket.io pro komunikaci v reálném čase
var mysql = require('mysql2'); // MySQL2 pro komunikaci s databází
const path = require('path') // Modul pro práci s cestami v souborovém systému
const bodyParser = require('body-parser'); // Middleware pro zpracování požadavků s těly
const session = require('express-session');

// Inicializace Express aplikace
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Vytvoření HTTP serveru pomocí Express aplikace
const server = createServer(app);

// Inicializace Socket.io na serveru
const io = new Server(server);

app.use(session({
  secret: 'your_secret_key', // Změňte toto na skutečné tajemství.
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 24*60*60*1000
  }
}));

// Nastavení připojení k databázi MySQL
const connection = mysql.createConnection({ // Vytvoření připojení k databázi
  host: '192.168.1.161', // Adresa hostitele databáze
  user: 'petr.spacek', // Uživatelské jméno
  password: 'Spakator445', // Heslo
  database: 'chat', // Název databáze
  port: 3001 // Port databáze
});

app.get('/setSession', (req, res) => {
  req.session.username = currentUsername
  res.send(req.session.username)
});

app.get('/setSession', (req, res) => {
  const username = req.session.username;
  res.send('uživatel ze sešny:' + username)
});

// Definice cesty pro zpracování HTTP GET požadavku na chatovou stránku
app.get('/chat', (req, res) => {
  if (req.session.authenticated) {
    res.render('index');
  } else {
    res.sendFile(join(__dirname, 'failedLogin.html'));
  }
  });



// Stránka pro registraci
app.get('/register', (req, res) => {
  res.render('register');
});

// Stránka pro zpracování registrace
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Příklad: Vytvoření nového uživatele v databázi
  connection.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, password], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Chyba při registraci.');
    } else {
      console.log('Uživatel byl úspěšně registrován.');
      res.redirect('/login'); // Po registraci přesměrovat na stránku přihlášení
    }
  });
});

// Stránka pro přihlášení
app.get('/login', (req, res) => {
  res.render('login.ejs');
  
});

let currentUsername;

// Stránka pro zpracování přihlášení
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  req.session.user = 'user1'
  // Příklad: Ověření uživatele v databázi
  connection.query('SELECT * FROM user WHERE (LOWER(username) = ? OR UPPER(username) = ?) AND (LOWER(password) = ? OR UPPER(password) = ?)', [username, username, password, password], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Chyba při přihlášení.');
    } else {
      if (results.length > 0) {
        // Úspěšné přihlášení
        req.session.authenticated = true;
        currentUsername = username;
        res.redirect('/chat'); // Přesměrovat na hlavní stránku
      } else {
        res.sendFile(join(__dirname, 'failedLogin.html'))
      }
    }
  });
});

// Naslouchání na události připojení klienta k Socket.io
io.on('connection', (socket) => {
  // Naslouchání na událost 'chat message' pro přijetí zprávy od klienta
  socket.on('chat message', (msg) => {
    // Odeslání zprávy všem klientům připojeným k Socket.io
    if (currentUsername) {
      io.emit('chat message', currentUsername + " : " + msg);
    } else {}
    });
  })

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