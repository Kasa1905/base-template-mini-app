import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import { ProofVaultService } from '../services/blockchain.js';

/**
 * Share credential on Farcaster
 * @route POST /api/share
 */
export const shareOnFarcaster = async (req, res) => {
  try {
    const { credentialId, message, signerUuid } = req.body;
    
    if (!credentialId || !signerUuid) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: credentialId, signerUuid'
      });
    }

    if (!process.env.NEYNAR_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Neynar API key not configured'
      });
    }

    // Verify credential exists and is valid
    const proofVaultService = new ProofVaultService();
    
    try {
      const isValid = await proofVaultService.verifyCredential(parseInt(credentialId));
      
      if (!isValid) {
        return res.status(404).json({
          success: false,
          error: 'Credential not found or has been revoked'
        });
      }
    } catch (error) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    // Get credential details
    const credential = await proofVaultService.getCredential(parseInt(credentialId));
    
    // Initialize Neynar client
    const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
    
    // Create verification URL
    const verificationUrl = `${process.env.APP_DOMAIN || 'https://proofvault-miniapp.vercel.app'}/verify/${credentialId}`;
    
    // Construct post text
    const postText = message || 
      `🏆 Just earned a verified credential: "${credential.title}" issued by ${credential.issuer}\n\n` +
      `Verify it onchain: ${verificationUrl}\n\n` +
      `#ProofVault #Base #Credentials #Blockchain`;

    try {
      // Post to Farcaster
      const cast = await neynarClient.publishCast(signerUuid, postText, {
        embeds: [{
          url: verificationUrl
        }]
      });

      res.json({
        success: true,
        data: {
          castHash: cast.hash,
          castUrl: `https://warpcast.com/${cast.author.username}/${cast.hash.substring(0, 10)}`,
          credentialId,
          verificationUrl,
          sharedAt: new Date().toISOString()
        },
        message: 'Credential shared successfully on Farcaster'
      });

    } catch (neynarError) {
      console.error('Neynar API error:', neynarError);
      
      // Handle specific Neynar errors
      if (neynarError.response?.status === 401) {
        return res.status(401).json({
          success: false,
          error: 'Invalid Neynar API key or signer'
        });
      }
      
      if (neynarError.response?.status === 429) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        });
      }

      throw new Error(`Farcaster posting failed: ${neynarError.message}`);
    }

  } catch (error) {
    console.error('Share on Farcaster error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to share credential on Farcaster'
    });
  }
};
