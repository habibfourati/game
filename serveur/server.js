const http=require('http');
const express=require('express');
const app=express();
const socketio=require('socket.io');
const RpsGame=require('./rps-game');
const { text } = require('express');

const clientPath=__dirname+'/../client/';
console.log('seving static from '+clientPath);

app.use(express.static(clientPath));
const server=http.createServer(app);

app.use(express.static(clientPath));



const io = socketio(server);

let waitingPlayer = null;

io.on('connection', (sock) => {



    if (waitingPlayer) {
        new RpsGame(waitingPlayer, sock);
        waitingPlayer = null;
      } else {
        waitingPlayer = sock;
        waitingPlayer.emit('message', 'Waiting for an opponent');
      }
  sock.on('message', (text) => {
    io.emit('message', text);
  });
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080,()=>{
    console.log('rps started');
});
