import { container } from 'tsyringe';
import { CreateChatRoomService } from '../services/CreateChatRoomService';
import { CreateMessageService } from '../services/CreateMessageService';

import { CreateUserService } from '../services/CreateUserService';
import { GetAllUsersService } from '../services/GetAllUsersService';
import { GetChatRoomByIdService } from '../services/GetChatRoomByIdService';
import { GetChatRoomByUsersService } from '../services/GetChatRoomByUsersService';
import { GetMessagesByChatRoomService } from '../services/GetMessagesByChatRoomService';
import { GetUserBySocketIdService } from '../services/GetUserBySocketIdService';
import { io } from '../socket';
import { IMessageSent } from './dtos/IMessageSent';
import { IStart } from './dtos/IStart';
import { IStartChat } from './dtos/IStartChat';

io.on('connect', (socket) => {
  socket.on('start', async ({ name, email, avatar }: IStart, callback) => {
    const createUserService = container.resolve(CreateUserService);
    const getAllUsersService = container.resolve(GetAllUsersService);

    const user = await createUserService.execute({
      name,
      email,
      avatar,
      socket_id: socket.id,
    });

    const users = await getAllUsersService.execute();

    socket.broadcast.emit('new_user', user);

    callback && callback({ user, users });
  });

  socket.on('start_chat', async ({ userId }: IStartChat, callback) => {
    const createChatRoomService = container.resolve(CreateChatRoomService);
    const getUserBySocketId = container.resolve(GetUserBySocketIdService);
    const getChatRoomByUsersService = container.resolve(
      GetChatRoomByUsersService
    );
    const getMessagesByChatRoomService = container.resolve(
      GetMessagesByChatRoomService
    );

    const loggedUser = await getUserBySocketId.execute(socket.id);

    let chatRoom = await getChatRoomByUsersService.execute([
      loggedUser._id,
      userId,
    ]);

    if (!chatRoom)
      chatRoom = await createChatRoomService.execute([loggedUser._id, userId]);

    const messages = await getMessagesByChatRoomService.execute(
      chatRoom.chat_room_id
    );

    socket.join(chatRoom.chat_room_id);

    callback && callback({ room: chatRoom, messages });
  });

  socket.on('message_sent', async ({ chat_room_id, message }: IMessageSent) => {
    const getUserBySocketId = container.resolve(GetUserBySocketIdService);
    const createMessageService = container.resolve(CreateMessageService);
    const getChatRoomByIdService = container.resolve(GetChatRoomByIdService);

    const loggedUser = await getUserBySocketId.execute(socket.id);
    const chatRoom = await getChatRoomByIdService.execute(chat_room_id);

    const createdMessage = await createMessageService.execute({
      text: message,
      user_id: loggedUser._id,
      chat_room_id,
    });

    io.to(chat_room_id).emit('message_sent', {
      message: createdMessage,
      user: loggedUser,
    });

    chatRoom.user_ids
      .filter((user: any) => user._id !== loggedUser._id)
      .forEach((user: any) => {
        io.to(user.socket_id).emit('notification', {
          chat_room_id,
          fromUser: loggedUser,
        });
      });
  });
});
