import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/buyplants';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Database:', cached.conn.connection.name);
    console.log('🔗 Host:', cached.conn.connection.host);
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
