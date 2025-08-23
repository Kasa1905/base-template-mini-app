import { ethers } from 'ethers';
import { uploadToIPFS } from '../services/ipfs.js';
import { ProofVaultService } from '../services/blockchain.js';
import { retryBlockchainCall } from '../middleware/errorHandler.js';

/**
 * Mint a new credential
 * @route POST /api/credentials
 */
export const mintCredential = async (req, res) => {
  try {
    const { 
      walletAddress, 
      title, 
      issuer, 
      dateIssued, 
      proofFile,
      description 
    } = req.body;

    // Validate required fields
    if (!walletAddress || !title || !issuer || !dateIssued) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: walletAddress, title, issuer, dateIssued'
      });
    }

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }

    // Upload proof to IPFS
    let ipfsHash = '';
    if (proofFile) {
      try {
        ipfsHash = await uploadToIPFS(proofFile, {
          title,
          issuer,
          dateIssued,
          description,
          holder: walletAddress,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        throw new Error(`IPFS upload failed: ${error.message}`);
      }
    }

    // Mint credential on blockchain
    const proofVaultService = new ProofVaultService();
    
    const tokenId = await retryBlockchainCall(async () => {
      return await proofVaultService.mintCredential(
        walletAddress,
        title,
        issuer,
        dateIssued,
        ipfsHash
      );
    });

    res.status(201).json({
      success: true,
      data: {
        tokenId: tokenId.toString(),
        holder: walletAddress,
        title,
        issuer,
        dateIssued,
        ipfsHash,
        timestamp: new Date().toISOString()
      },
      message: 'Credential minted successfully'
    });

  } catch (error) {
    console.error('Mint credential error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to mint credential'
    });
  }
};

/**
 * Get all credentials (admin only)
 * @route GET /api/credentials
 */
export const getCredentials = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const proofVaultService = new ProofVaultService();
    
    const totalCredentials = await proofVaultService.getTotalCredentials();
    const credentials = [];
    
    const startId = Math.max(1, (page - 1) * limit + 1);
    const endId = Math.min(totalCredentials, page * limit);
    
    for (let i = startId; i <= endId; i++) {
      try {
        const credential = await proofVaultService.getCredential(i);
        credentials.push({
          tokenId: i,
          ...credential
        });
      } catch (error) {
        console.warn(`Failed to fetch credential ${i}:`, error.message);
      }
    }

    res.json({
      success: true,
      data: credentials,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCredentials,
        pages: Math.ceil(totalCredentials / limit)
      }
    });

  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch credentials'
    });
  }
};

/**
 * Get specific credential by ID
 * @route GET /api/credentials/:id
 */
export const getCredential = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credential ID'
      });
    }

    const proofVaultService = new ProofVaultService();
    const credential = await proofVaultService.getCredential(parseInt(id));

    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    res.json({
      success: true,
      data: {
        tokenId: id,
        ...credential
      }
    });

  } catch (error) {
    console.error('Get credential error:', error);
    
    if (error.message.includes('does not exist')) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch credential'
    });
  }
};

/**
 * Get user's credentials
 * @route GET /api/credentials/user/:wallet
 */
export const getUserCredentials = async (req, res) => {
  try {
    const { wallet } = req.params;
    
    if (!ethers.isAddress(wallet)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }

    const proofVaultService = new ProofVaultService();
    const tokenIds = await proofVaultService.getHolderCredentials(wallet);
    
    const credentials = [];
    for (const tokenId of tokenIds) {
      try {
        const credential = await proofVaultService.getCredential(tokenId);
        credentials.push({
          tokenId: tokenId.toString(),
          ...credential
        });
      } catch (error) {
        console.warn(`Failed to fetch credential ${tokenId}:`, error.message);
      }
    }

    res.json({
      success: true,
      data: credentials,
      count: credentials.length
    });

  } catch (error) {
    console.error('Get user credentials error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user credentials'
    });
  }
};

/**
 * Revoke credential (admin only)
 * @route PUT /api/credentials/:id/revoke
 */
export const revokeCredential = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credential ID'
      });
    }

    const proofVaultService = new ProofVaultService();
    
    const txHash = await retryBlockchainCall(async () => {
      return await proofVaultService.revokeCredential(parseInt(id));
    });

    res.json({
      success: true,
      data: {
        tokenId: id,
        txHash,
        revokedAt: new Date().toISOString()
      },
      message: 'Credential revoked successfully'
    });

  } catch (error) {
    console.error('Revoke credential error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to revoke credential'
    });
  }
};
