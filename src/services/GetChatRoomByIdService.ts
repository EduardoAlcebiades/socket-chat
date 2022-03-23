import { injectable } from 'tsyringe';

import { ChatRoom } from '../schemas/ChatRoom';

@injectable()
class GetChatRoomByIdService {
  async execute(chat_room_id: string) {
    const chatRoom = await ChatRoom.findOne({ chat_room_id })
      .populate('user_ids')
      .exec();

    return chatRoom;
  }
}

export { GetChatRoomByIdService };
