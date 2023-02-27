import express from 'express';
import { Server } from "socket.io";

const PORT = 3000;
const app = express();
const options = {
  cors: true,
  origin: ['http://localhost:3000'],
}

const server = app.listen(PORT, () => {
  console.log('Сервер запустився!');
})

const io = new Server(server, options);
app.use(express.static('./dist'))

app.get('/', (req, res) => {
  res.sendFile("index.html");
})

const messages = {}

io.on('connection', socket => {
  socket.emit('добрий день', socket.id);
  socket.join('room1');
  socket.emit('messages', messages);

  socket.on('message', message => {
    io.to('room1').emit('receiveMessage', {
      userId: socket.id,
      message: message
    })
  })

  socket.on('editMessage', (data) => {
    if (messages[data.messageId]) {
      message[data.messageId].message = data.message;
    }

    io.to('room1').emit('updateMessage', {
      messageId: data.messageId,
      message: messages[data.messageId]
    });
  })


  socket.on('deleteMessage', messageId => {
    delete messages[messageId];
    io.to('room1').emit('removeMessage', messageId);
  })
})
