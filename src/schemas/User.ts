import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  email: string;
  socket_id: string;
  name: string;
  avatar: string;
}

const UserSchema = new Schema({
  email: String,
  socket_id: String,
  name: String,
  avatar: String,
});

const collectionName = 'users';
const User = mongoose.model<IUser>(collectionName, UserSchema);

export { User, collectionName };
