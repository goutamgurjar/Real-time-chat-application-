const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const http = require('http')
const server = http.createServer(app);
const { Server } = require("socket.io");
const { constants } = require('buffer');
const { disconnect } = require('process');
const io = new Server(server);
// const { v4: uuidV4 } = require('uuid')





app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

//home
const addFilter = []
app.get('/', function (req, res) {
  res.render('index', { newListItems: addFilter })
})
app.post('/', function (req, res) {
  const item = req.body.newItem;
  addFilter.push(item);
  res.redirect('/');
})
app.post('/delete', function (req, res) {
  const remove = req.body.removeItems;
  addFilter.splice(remove, 1)
  res.redirect("/")
})



//Text
app.get('/text', function (req, res) {
  res.render('text')
})
app.post('/text', function (req, res) {
  res.redirect('text')
})
app.get('/views/text.js', (req, res) => {
  res.sendFile(__dirname + '/views/text.js');
});
// socket.io
let waitingClients = [];
io.of('/text').on('connection', (socket) => {
  let id = socket.id
  waitingClients.push(socket);
  socket.on('typing', () => {
    socket.broadcast.emit('user typing', socket.id);
  });
  socket.on('stop typing', () => {
    socket.broadcast.emit('user stopped typing', socket.id);
  });
  if (waitingClients.length >= 2) {
    const client1 = waitingClients.shift();
    const client2 = waitingClients.shift();
    pairClients(client1, client2);
  }
});
// Pair two clients and enable messaging between them
function pairClients(client1, client2) {
  console.log(`Pairing ${client1.id} with ${client2.id}`);
  client1.emit('partner connected', client2.id);
  client2.emit('partner connected', client1.id);
  // Handle messages sent by client1
  client1.on('send message', (message) => {
    // console.log(`${client1.id} sent message to ${vClient2.id}: ${message}`);
    client1.emit('receive message', { sender: client1.id, message });
    client2.emit('receive message', { sender: client1.id, message });
  });
  client1.on('disconnect', () => {
    client2.emit("disconnect message", { disClient: client1.id });
  })
  // Handle messages sent by client2
  client2.on('send message', (message) => {
    // console.log(`${vClient2.id} sent message to ${client1.id}: ${message}`);
    client1.emit('receive message', { sender: client2.id, message });
    client2.emit('receive message', { sender: client2.id, message })
  });
  client2.on('disconnect', () => {
    client1.emit("disconnect message", { disClient: client2.id });
  })
}


app.post('/stop', (req, res) => {
  res.redirect("/")
});



// video
// video

app.get('/video', function (req, res) {
  res.render('video')
})
app.post('/video', function (req, res) {
  res.redirect('video')
})
// Socket.io connection
let clientsWaiting=[];
io.of('/video').on('connection', (socket)=>{
  console.log(`user is connected on video page ${socket.id}`)
  clientsWaiting.push(socket)
  socket.on('peerId', (peerId)=>{
    console.log(peerId);
    // clientsWaiting.push(socket, {peerID : peerId});
    // console.log(clientsWaiting[0])
    // console.log(clientsWaiting[1].peerID);
  });
  

  socket.on('typing', () => {
    socket.broadcast.emit('user typing', socket.id);
  });
  socket.on('stop typing', () => {
    socket.broadcast.emit('user stopped typing', socket.id);
  });
  if(clientsWaiting.length >= 2){
    const vClient1 = clientsWaiting.shift();
    const vClient2 = clientsWaiting.shift();
    pairVClients(vClient1, vClient2)
  }
  socket.on('disconnect', ()=>{
    console.log(`User disconnect from the video page ${socket.id}`);
    // clientsWaiting = clientsWaiting.filter(client => client.socket !== socket);
    // console.log(clientsWaiting);
  })
})
function pairVClients(vClient1, vClient2) {

  console.log(`Pairing ${vClient1.id} with ${vClient2.id}`);
  vClient1.emit('partner connected', vClient2.id);
  vClient2.emit('partner connected', vClient1.id);

  
  // Handle messages sent by client1
  vClient1.on('send message', (message) => {
    // console.log(`${client1.id} sent message to ${vvClient2.id}: ${message}`);
    vClient1.emit('receive message', { sender: vClient1.id, message });
    vClient2.emit('receive message', { sender: vClient1.id, message });
  });
  vClient1.on('disconnect', () => {
    vClient2.emit("disconnect message", { disClient: vClient1.id });
  })
  // Handle messages sent by client2
  vClient2.on('send message', (message) => {
    // console.log(`${vClient2.id} sent message to ${client1.id}: ${message}`);
    vClient1.emit('receive message', { sender: vClient2.id, message });
    vClient2.emit('receive message', { sender: vClient2.id, message })
  });
  vClient2.on('disconnect', () => {
    vClient1.emit("disconnect message", { disClient: vClient2.id });
  })
}
app.post('/vstop', (req, res) => {
  res.redirect('/');
});

server.listen(3000, function () {
  console.log("server start on port 3000")
})
