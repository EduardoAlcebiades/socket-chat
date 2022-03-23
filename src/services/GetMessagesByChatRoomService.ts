import { injectable } from 'tsyringe';

import { Message } from '../schemas/Message';

@injectable()
class GetMessagesByChatRoomService {
  async execute(chat_room_id: string) {
    const messages = await Message.aggregate([
      { $match: { chat_room_id } },
      { $sort: { created_at: 1 } },
    ]).exec();

    await Message.populate(messages, {
      path: 'user_id',
    });

    return messages;
  }
}

export { GetMessagesByChatRoomService };
