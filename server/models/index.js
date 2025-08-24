import User from './User.js';
import Credential from './Credential.js';
import ChatbotConversation from './ChatbotConversation.js';
import mongoose from 'mongoose';

// Database connection configuration
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/proofvault';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🟡 Mongoose disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔴 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Database utility functions
const dbUtils = {
  // Check database health
  checkHealth: async () => {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };
      
      return {
        status: states[state],
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      };
    } catch (error) {
      throw new Error(`Database health check failed: ${error.message}`);
    }
  },

  // Get database statistics
  getStats: async () => {
    try {
      const userCount = await User.countDocuments();
      const credentialCount = await Credential.countDocuments();
      const conversationCount = await ChatbotConversation.countDocuments();
      
      return {
        users: userCount,
        credentials: credentialCount,
        conversations: conversationCount,
        totalDocuments: userCount + credentialCount + conversationCount
      };
    } catch (error) {
      throw new Error(`Failed to get database stats: ${error.message}`);
    }
  },

  // Create indexes for better performance
  createIndexes: async () => {
    try {
      console.log('🔄 Creating database indexes...');
      
      // These are automatically created by the schema definitions,
      // but we can manually ensure they exist
      await User.createIndexes();
      await Credential.createIndexes();
      await ChatbotConversation.createIndexes();
      
      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Failed to create indexes:', error.message);
    }
  },

  // Clear all data (use with caution!)
  clearDatabase: async () => {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clear database in production environment');
    }
    
    try {
      await User.deleteMany({});
      await Credential.deleteMany({});
      await ChatbotConversation.deleteMany({});
      
      console.log('🗑️ Database cleared successfully');
    } catch (error) {
      throw new Error(`Failed to clear database: ${error.message}`);
    }
  },

  // Seed database with sample data
  seedDatabase: async () => {
    try {
      // Check if data already exists
      const userCount = await User.countDocuments();
      if (userCount > 0) {
        console.log('📊 Database already contains data, skipping seed');
        return;
      }

      console.log('🌱 Seeding database with sample data...');
      
      // Create sample users
      const sampleUsers = [
        {
          walletAddress: '0x1234567890123456789012345678901234567890',
          email: 'alice@example.com',
          username: 'alice_dev',
          profile: {
            firstName: 'Alice',
            lastName: 'Johnson',
            bio: 'Full-stack developer passionate about blockchain',
            location: 'San Francisco, CA'
          },
          professional: {
            currentRole: 'Senior Developer',
            company: 'TechCorp',
            industry: 'Technology',
            experienceLevel: 'Senior',
            skills: ['JavaScript', 'React', 'Node.js', 'Solidity']
          }
        },
        {
          walletAddress: '0x0987654321098765432109876543210987654321',
          email: 'bob@example.com',
          username: 'bob_pm',
          profile: {
            firstName: 'Bob',
            lastName: 'Smith',
            bio: 'Project manager with 5+ years experience',
            location: 'New York, NY'
          },
          professional: {
            currentRole: 'Project Manager',
            company: 'Innovate Inc',
            industry: 'Finance',
            experienceLevel: 'Mid',
            skills: ['Project Management', 'Agile', 'Scrum', 'Leadership']
          }
        }
      ];

      const createdUsers = await User.insertMany(sampleUsers);
      console.log(`✅ Created ${createdUsers.length} sample users`);

      // Create sample credentials
      const sampleCredentials = [
        {
          tokenId: '1',
          contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          holder: createdUsers[0]._id,
          holderWalletAddress: createdUsers[0].walletAddress,
          title: 'React Developer Certification',
          description: 'Advanced React development skills certification',
          category: 'Technical',
          issuer: {
            name: 'React Training Institute',
            organization: 'RTI',
            verified: true
          },
          achievement: {
            type: 'Certification',
            level: 'Advanced'
          },
          skills: [
            { name: 'React', level: 'Advanced' },
            { name: 'JavaScript', level: 'Expert' }
          ]
        }
      ];

      const createdCredentials = await Credential.insertMany(sampleCredentials);
      console.log(`✅ Created ${createdCredentials.length} sample credentials`);

      console.log('🎉 Database seeded successfully!');
    } catch (error) {
      console.error('❌ Failed to seed database:', error.message);
    }
  }
};

export {
  User,
  Credential,
  ChatbotConversation,
  connectDB,
  dbUtils
};

export default {
  User,
  Credential,
  ChatbotConversation,
  connectDB,
  dbUtils
};
