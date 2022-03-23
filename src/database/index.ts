import mongoose from 'mongoose';

async function connect(): Promise<void> {
  await mongoose.connect(process.env.MONGODB_CONNECTION);
}

export { connect };
