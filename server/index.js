import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import services
import databaseService from './services/databaseService.js';
import multiChainService from './services/multiChainService.js';

// Import routes
import credentialsRouter from './routes/credentials.js';
import verificationRouter from './routes/verification.js';
import shareRouter from './routes/share.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://sepolia.base.org", "https://mainnet.base.org"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.APP_DOMAIN, 'https://proofvault-miniapp.vercel.app']
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(logger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/credentials', credentialsRouter);
// Routes
app.use('/api/credentials', credentialsRouter);
app.use('/api/verification', verificationRouter);
app.use('/api/share', shareRouter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbStatus = databaseService.getStatus();
    const multiChainStatus = await multiChainService.getStatus();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        multiChain: multiChainStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API status endpoint
app.get('/api/status', async (req, res) => {
  try {
    const multiChainStatus = await multiChainService.getStatus();
    res.json({
      success: true,
      data: multiChainStatus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Remove duplicate route
// app.use('/api/share', shareRouter); // Already defined above

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server with initialization
const startServer = async () => {
  try {
    // Initialize database connection
    await databaseService.connect();
    
    // Initialize multi-chain services
    await multiChainService.initialize();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 ProofVault server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⛓️  Default chain: ${process.env.DEFAULT_CHAIN || 'solana'}`);
      console.log(`🔐 Privacy enabled: ${process.env.PRIVACY_ENABLED === 'true'}`);
    });

    // Graceful shutdown function
    const gracefulShutdown = async (signal) => {
      console.log(`🛑 ${signal} received, shutting down gracefully`);
      
      server.close(async () => {
        console.log('📊 Server closed');
        
        // Close database connection
        await databaseService.disconnect();
        
        console.log('✅ Process terminated');
        process.exit(0);
      });
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;
