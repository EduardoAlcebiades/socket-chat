import mongoose, { Document, Schema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

import { User, collectionName as collectionUserName } from './User';

interface IChatRoom extends Document {
  chat_room_id: string;
  user_ids: Array<typeof User>;
}

const ChatRoomSchema = new Schema({
  chat_room_id: {
    type: String,
    default: uuidV4,
  },
  user_ids: [
    {
      type: Schema.Types.ObjectId,
      ref: collectionUserName,
    },
  ],
});

const collectionName = 'chat_rooms';
const ChatRoom = mongoose.model<IChatRoom>(collectionName, ChatRoomSchema);

export { ChatRoom, collectionName };
