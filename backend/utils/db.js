import mongoose from 'mongoose';

mongoose.set('debug', process.env.NODE_ENV === 'development');

const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      family: 4 // Force IPv4
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('MongoDB connection failed:', error);
      process.exit(1);
    }
  }
};

// Handle connection errors after initial connection
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

export default connectDB;