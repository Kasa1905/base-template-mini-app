import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Request logging middleware
 */
export const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
  };

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    const responseLog = {
      ...logEntry,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    };

    // Log to console
    console.log(
      `${responseLog.method} ${responseLog.url} ${responseLog.statusCode} - ${responseLog.duration}`
    );

    // Log to file
    fs.appendFileSync(
      path.join(logsDir, 'access.log'),
      JSON.stringify(responseLog) + '\n'
    );

    originalEnd.call(this, chunk, encoding);
  };

  next();
};
