import express from 'express';
import { verifyCredential, generateQRCode } from '../controllers/verificationController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// GET /api/verify/:id - Verify credential by ID
router.get('/:id', asyncHandler(verifyCredential));

// GET /api/verify/:id/qr - Generate QR code for credential
router.get('/:id/qr', asyncHandler(generateQRCode));

export default router;
