

const socket = io('/text');

socket.on('partner connected', (partnerId) => {

  // document.getElementById('partner-id').textContent = partnerId;
  document.getElementById('waiting-screen').style.display = 'none';
  document.getElementById('paired-screen').style.display = 'block';
});


const messageForm = document.getElementById('message-form');
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const messageInput = document.getElementById('text-input');
  const message = messageInput.value.trim();
  if (message !== '') {

    socket.emit('send message', message);
    messageInput.value = '';
  }
  
});


socket.on('partner connected', (partnerId) => {

  const messageList = document.getElementById('t-container');
  const messageInput = document.querySelector('#text-input');

  messageInput.addEventListener('keydown', () => {
    socket.emit('typing');
  });
  socket.on('user typing', () => {
    typingMsg = document.getElementById("info-typing").style.display = "block"
    console.log(`stranger is typing...`);
  });

  messageInput.addEventListener('keyup', () => {
    socket.emit('stop typing');
  });
  
  socket.on('user stopped typing', () => {
     typingInfo = document.getElementById('info-typing').style.display="none"
  });


  socket.on('receive message', (data) => {
    let ide = data.sender
    const messageList = document.getElementById('t-container');

    if (ide !== partnerId) {
      const messageItem = document.createElement('h4');
      if (data.message.length >= 73) {
        messageItem.setAttribute('id', 'text-wrap3');
      } else {
        messageItem.setAttribute('id', 'text-wrap4');
      }
      messageItem.textContent = ` you : ${data.message}`
      messageList.appendChild(messageItem);
      messageList.scrollTop = messageList.scrollHeight;
    } else {
      if (!messageList) {
        messageList = document.createElement('div');
        messageList.setAttribute('id', 't-container');
        document.body.appendChild(messageList);
      }
      const messageItem = document.createElement('h4');
      if (data.message.length >= 73) {
        messageItem.setAttribute('id', 'text-wrap1');
      } else {
        messageItem.setAttribute('id', 'text-wrap');
      }
      messageItem.textContent = ` stranger : ${data.message}`
      messageList.appendChild(messageItem);
      messageList.scrollTop = messageList.scrollHeight;
    }

  });

})

document.getElementById("refresh-btn").addEventListener("click", function () {
  location.reload();
});

const refreshButton = document.getElementById('refresh-btn');
refreshButton.addEventListener('click', () => {
  socket.emit('refresh', (socket.id));
  console.log("clicked")
});


// socket.on('partner disconnected', () => {
//   console.log('Partner disconnected');
//   window.location.reload();
// });


socket.on("disconnect message", (data) => {
  document.getElementById('waiting-screen').style.display = 'none';
  document.getElementById('paired-screen').style.display = 'none';
  document.getElementById('disconnected-screen').style.display = "block";

})



// Client 1 code
const messageInput = document.querySelector('#text-input');

messageInput.addEventListener('keydown', () => {
  socket.emit('typing');
});

socket.on('user typing', () => {
  console.log(`stranger is typing...`);
  
});

messageInput.addEventListener('keyup', () => {
  socket.emit('stop typing');
});

socket.on('user stopped typing', () => {
   typingInfo = document.createElement('h1')
  console.log(`stranger stopped typing......`);
  typingInfo.textContent = "Stranger is stop typing"
  
});


