// Inicializace Socket.io na klientovi a navázání spojení se serverem
const socket = io();

// Získání referencí na DOM prvky
const messages = document.getElementById('messages'); // Element pro zobrazování zpráv
const form = document.getElementById('form'); // Formulář pro odesílání zpráv
const input = document.getElementById('input'); // Pole pro zadání textu zprávy

// Naslouchání na odeslání formuláře (odeslání zprávy)
form.addEventListener('submit', (e) => {
  e.preventDefault(); // Zabránění výchozímu chování formuláře (reload stránky)
  if (input.value) { // Pokud pole pro text zprávy není prázdné
    socket.emit('chat message', input.value); // Odeslat zprávu na server
    input.value = ''; // Vyčistit pole pro text zprávy po odeslání
  }
});

// Naslouchání na příchod zprávy ze serveru
socket.on('chat message', (msg) => {
  // Vytvoření nového prvek <li> pro zobrazení zprávy
  const item = document.createElement('li');
  item.textContent = msg; // Nastavení textu zprávy do prvku
  messages.appendChild(item); // Přidání prvku s zprávou do seznamu zpráv
  window.scrollTo(0, document.body.scrollHeight); // Automatický scroll dolů na konec chatu
});

// Naslouchání na událost "connect" při úspěšném navázání spojení se serverem
socket.on("connect", () => {
  console.log(socket.id); // Vypsání ID klienta do konzole při úspěšném připojení
});
