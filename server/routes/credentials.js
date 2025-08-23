import express from 'express';
import { 
  mintCredential, 
  getCredentials, 
  getCredential,
  getUserCredentials,
  revokeCredential 
} from '../controllers/credentialsController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// POST /api/credentials - Mint new credential
router.post('/', asyncHandler(mintCredential));

// GET /api/credentials - Get all credentials (admin only)
router.get('/', asyncHandler(getCredentials));

// GET /api/credentials/:id - Get specific credential
router.get('/:id', asyncHandler(getCredential));

// GET /api/credentials/user/:wallet - Get user's credentials
router.get('/user/:wallet', asyncHandler(getUserCredentials));

// PUT /api/credentials/:id/revoke - Revoke credential
router.put('/:id/revoke', asyncHandler(revokeCredential));

export default router;
