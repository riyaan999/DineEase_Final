import mongoose from 'mongoose';

const connectDB = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  const connectWithRetry = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority'
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      console.error(`MongoDB connection error (attempt ${retryCount + 1}/${maxRetries}):`);
      console.error(`- Error Type: ${error.name}`);
      console.error(`- Error Message: ${error.message}`);
      
      if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
        console.error('- This may be due to IP whitelist restrictions or network connectivity issues');
        console.error('- Please ensure your IP address is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/');
      }

      if (retryCount < maxRetries - 1) {
        retryCount++;
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        console.log(`Retrying connection in ${retryDelay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return false;
      } else {
        console.error('Max retry attempts reached. Exiting...');
        process.exit(1);
      }
    }
  };

  while (!(await connectWithRetry())) {
    // Continue retrying until successful or max retries reached
  }
};

export default connectDB;