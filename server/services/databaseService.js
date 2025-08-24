import mongoose from 'mongoose';

class DatabaseService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      if (this.isConnected) {
        console.log('📦 Database already connected');
        return this.connection;
      }

      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/proofvault';
      
      console.log('🔄 Connecting to MongoDB...');
      
      // Configure mongoose
      mongoose.set('strictQuery', false);
      
      // Connection options
      const options = {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        useNewUrlParser: true,
        useUnifiedTopology: true
      };

      this.connection = await mongoose.connect(mongoUri, options);
      this.isConnected = true;

      console.log('✅ MongoDB connected successfully');
      
      // Set up connection event listeners
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
        this.isConnected = true;
      });

      return this.connection;

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      this.isConnected = false;
      
      // For development, continue without database
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  Continuing without database in development mode');
        return null;
      }
      
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.disconnect();
        console.log('✅ MongoDB disconnected');
        this.isConnected = false;
        this.connection = null;
      }
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  getStatus() {
    return {
      connected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }
}

// Export singleton instance
const databaseService = new DatabaseService();
export default databaseService;
