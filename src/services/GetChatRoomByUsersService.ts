import { injectable } from 'tsyringe';

import { ChatRoom } from '../schemas/ChatRoom';

@injectable()
class GetChatRoomByUsersService {
  async execute(user_ids: string[]) {
    const chatRoom = await ChatRoom.findOne({
      user_ids: {
        $all: user_ids,
      },
    })
      .populate('user_ids')
      .exec();

    return chatRoom;
  }
}

export { GetChatRoomByUsersService };
