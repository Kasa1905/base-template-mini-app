import { spawn } from 'child_process';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log(`
💻 To test your mini app:
   1. Open the Warpcast Mini App Developer Tools: https://warpcast.com/~/developers
   2. Scroll down to the "Preview Mini App" tool
   3. Enter this URL: http://localhost:3000
   4. Click "Preview" to test your mini app (note that it may take ~5 seconds to load the first time)
`);

// Start Next.js development server
const nextDev = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('error', (error) => {
  console.error('❌ Failed to start Next.js dev server:', error);
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  nextDev.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down...');
  nextDev.kill();
  process.exit(0);
});
