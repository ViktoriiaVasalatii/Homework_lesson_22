import io from 'socket.io-client';
import moment from 'moment';

const socket = io('http://localhost:3000');

const button = document.getElementById('send');
const input = document.getElementById('input');
let userId;

button.addEventListener('click', () => {
  if (input.value === '') {
    return;
  }
  socket.emit('message', input.value);
  input.value = '';
})

socket.on('welcome', id => {
  userId = id;
})

socket.on('receiveMessage', response => {
  const isMessageFromUser = response.userId === userId;

  const chatContainer = document.createElement('div');
  chatContainer.classList.add('chatContainer');
  if (!isMessageFromUser) {
    chatContainer.classList.add('left');
  }

  const message = document.createElement('div');
  message.classList.add('message');
  if (!isMessageFromUser) {
    message.classList.add('friend')
  }
  // message.setAttribute('data-message-id');
  const messageInfo = document.createElement('div');
  messageInfo.classList.add('message_box');

  const username = document.createElement('p');
  username.innerText = 'Кирило';
  username.classList.add('username');

  const date = document.createElement('p');
  date.innerText = moment().format("MMMM DD YYYY, h:mm:ss");
  date.classList.add('date');

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message_container');

  const messageOption = document.createElement('div');
  messageOption.classList.add('message_option');

  const buttonEdit = document.createElement('button');
  buttonEdit.innerText = "Редагувати";
  buttonEdit.classList.add('edit_message');

  const buttonDelete = document.createElement('button');
  buttonDelete.innerText = "Видалити";
  buttonDelete.classList.add('delete_message');

  const textParagraph = document.createElement('p');
  textParagraph.innerText = response.message;
  textParagraph.classList.add('message_container');

  messageOption.appendChild(buttonDelete);
  messageOption.appendChild(buttonEdit);
  message.appendChild(messageInfo);
  messageInfo.appendChild(username);
  messageInfo.appendChild(date);
  messageContainer.appendChild(textParagraph);
  message.appendChild(messageContainer);
  message.appendChild(messageOption);
  chatContainer.appendChild(message);

  const chatMessageContainer = document.getElementsByClassName('chat')[0];
  chatMessageContainer.appendChild(chatContainer);
})

const deleteButtons = document.querySelectorAll('.delete_message');

deleteButtons.forEach(button => {
  button.addEventListener('click', () => {
    const messageContainer = button.closest('.message');
    const messageId = messageContainer.dataset.messageId;
    socket.emit('deleteMessage', messageId);
  });
});

socket.on('removeMessage', messageId => {
  const messageContainer = document.querySelector(`[data-message-id="${messageId}"]`);
  if (messageContainer) {
    messageContainer.remove();
  }
});

const editButtons = document.querySelectorAll('.edit_message');
editButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const message = event.target.closest('.message');
    const messageId = message.dataset.id;
    const messageText = message.querySelector('.message_container p').textContent;
    const newMessageText = prompt('Введіть нове повідомлення', messageText);
    if (newMessageText !== null) {
      socket.emit('editMessage', { messageId, message: newMessageText });
    }
  });
});



