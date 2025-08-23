import express from 'express';
import { shareOnFarcaster } from '../controllers/shareController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// POST /api/share - Share credential on Farcaster
router.post('/', asyncHandler(shareOnFarcaster));

export default router;
