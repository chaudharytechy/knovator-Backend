import mongoose from 'mongoose';

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('connected db');
  } catch (err) {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  }
};
export default db;
