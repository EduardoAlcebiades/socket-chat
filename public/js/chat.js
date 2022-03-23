const socket = io('http://localhost:3333');

const profilePictureUrl = '../assets/images/profile_picture.png';

let chat_room_id;
let loggedUserId;

function clearChat() {
  const chat = document.getElementById('message_user');

  chat.innerHTML = '';
}

function scrollChatDown() {
  const chat = document.getElementById('message_user');

  chat.scrollTo({ top: chat.scrollHeight });
}

function loadActiveChat({ name, avatar }) {
  const chatHeader = document.getElementById('chat_header');
  const input = document.getElementById('user_message');

  input.classList.remove('hidden');

  chatHeader.innerHTML = `
    <div id="user_info" class="user_info bg-gray-800">
      <img
        class="img_user"
        src="${avatar || profilePictureUrl}"
      />
      <strong class="user_name">${name}</strong>
    </div>
  `;
}

function loadLoggedUser({ name, avatar }) {
  document.querySelector('.user_logged').innerHTML += `
    <img
      class="avatar_user_logged"
      src="${avatar || profilePictureUrl}"
    />
    <strong id="user_logged">${name}</strong>
  `;
}

function addUserToUsersList({ id, name, avatar }) {
  const usersList = document.getElementById('users_list');

  usersList.innerHTML += `
      <li
        class="user_name_list"
        id="user_${id}"
        idUser="${id}"
      >
        <img
          class="nav_avatar"
          src="${avatar || profilePictureUrl}"
        />
        ${name}
      </li>
    `;
}

function addMessageInChat({ userId, text, messageDate }) {
  const chat = document.getElementById('message_user');

  chat.innerHTML += `
    <div class="messages bg-gray-800${
      userId === loggedUserId ? ' message_sender' : ''
    }">
      <span class="message_content">${text}</span>
      <span class="message_date">${dayjs(messageDate).format(
        'DD/MM/YYYY HH:mm'
      )}</span>
    </div>
  `;
}

function addNotificationInUser({ userId }) {
  const user = document.getElementById(`user_${userId}`);

  user.insertAdjacentHTML(
    'afterbegin',
    `
      <div class="notification"></div>
    `
  );
}

function removeNotification({ userId }) {
  const notification = document.querySelectorAll(
    `#user_${userId} .notification`
  );

  if (notification.length) notification.forEach((item) => item.remove());
}

function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);

  const name = urlParams.get('name');
  const email = urlParams.get('email');
  const avatar = urlParams.get('avatar');

  socket.emit('start', { name, email, avatar }, ({ user, users }) => {
    loggedUserId = user._id;

    loadLoggedUser({ name: user.name, avatar: user.avatar });
    users
      .filter((user) => user.email !== email)
      .forEach((user) =>
        addUserToUsersList({
          id: user._id,
          name: user.name,
          avatar: user.avatar,
        })
      );
  });

  socket.on('new_user', (user) => {
    const userAlreadyExists = document.getElementById(`user_${user._id}`);

    if (!userAlreadyExists)
      addUserToUsersList({
        id: user._id,
        name: user.name,
        avatar: user.avatar,
      });
  });

  socket.on('message_sent', ({ message, user }) => {
    if (message.chat_room_id === chat_room_id) {
      addMessageInChat({
        userId: user._id,
        text: message.text,
        messageDate: message.created_at,
      });

      scrollChatDown();
    }
  });

  socket.on('notification', ({ fromUser, chat_room_id: chatRoomId }) => {
    if (chat_room_id !== chatRoomId)
      addNotificationInUser({ userId: fromUser._id });
  });
}

document.getElementById('users_list').addEventListener('click', (e) => {
  if (e.target && e.target.matches('li.user_name_list')) {
    const userId = e.target.getAttribute('idUser');

    socket.emit('start_chat', { userId }, ({ room, messages }) => {
      chat_room_id = room.chat_room_id;

      const activeUser = room.user_ids.filter(
        (user) => typeof user === 'object' && user._id !== loggedUserId
      )[0];

      document
        .querySelectorAll('li.user_name_list')
        .forEach((item) => item.classList.remove('user_in_focus'));

      e.target.classList.add('user_in_focus');

      removeNotification({ userId });

      clearChat();
      loadActiveChat({
        name: activeUser.name,
        avatar: activeUser.avatar,
      });

      messages.forEach((message) => {
        addMessageInChat({
          userId: message.user_id._id,
          text: message.text,
          messageDate: message.created_at,
        });

        scrollChatDown();
      });
    });
  }
});

document.getElementById('user_message').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const message = e.target.value;

    e.target.value = '';

    socket.emit('message_sent', { chat_room_id, message });
  }
});

onLoad();
