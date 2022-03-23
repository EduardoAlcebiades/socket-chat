import mongoose, { Document, Schema } from 'mongoose';

import { collectionName as collectionUserName } from './User';
import { collectionName as collectionChatRoomName } from './ChatRoom';

interface IMessage extends Document {
  text: string;
  user_id: string;
  chat_room_id: string;
  created_at: Date;
}

const MessageSchema = new Schema({
  text: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: collectionUserName,
  },
  chat_room_id: {
    type: String,
    ref: collectionChatRoomName,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

const collectionName = 'messages';
const Message = mongoose.model<IMessage>(collectionName, MessageSchema);

export { Message };
