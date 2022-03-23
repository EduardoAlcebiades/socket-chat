import { injectable } from 'tsyringe';

import { ICreateMessageDTO } from '../dtos/ICreateMessageDTO';
import { Message } from '../schemas/Message';

@injectable()
class CreateMessageService {
  async execute({ text, user_id, chat_room_id }: ICreateMessageDTO) {
    const message = await Message.create({ text, user_id, chat_room_id });

    return message;
  }
}

export { CreateMessageService };
