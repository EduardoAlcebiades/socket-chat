import { injectable } from 'tsyringe';

import { ChatRoom } from '../schemas/ChatRoom';

@injectable()
class CreateChatRoomService {
  async execute(user_ids: string[]) {
    const chatRoom = await ChatRoom.create({ user_ids });

    await ChatRoom.populate(chatRoom, 'user_ids');

    return chatRoom;
  }
}

export { CreateChatRoomService };
