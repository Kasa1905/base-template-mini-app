import QRCode from 'qrcode';
import { ProofVaultService } from '../services/blockchain.js';

/**
 * Verify credential by ID
 * @route GET /api/verify/:id
 */
export const verifyCredential = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credential ID'
      });
    }

    const proofVaultService = new ProofVaultService();
    
    // Check if credential exists and is valid
    const isValid = await proofVaultService.verifyCredential(parseInt(id));
    
    if (!isValid) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found or has been revoked'
      });
    }

    // Get credential details
    const credential = await proofVaultService.getCredential(parseInt(id));
    
    res.json({
      success: true,
      data: {
        tokenId: id,
        isValid: true,
        credential,
        verifiedAt: new Date().toISOString()
      },
      message: 'Credential is valid'
    });

  } catch (error) {
    console.error('Verify credential error:', error);
    
    if (error.message.includes('does not exist')) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found',
        isValid: false
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify credential'
    });
  }
};

/**
 * Generate QR code for credential verification
 * @route GET /api/verify/:id/qr
 */
export const generateQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'png', size = 200 } = req.query;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credential ID'
      });
    }

    const proofVaultService = new ProofVaultService();
    
    // Verify credential exists
    const isValid = await proofVaultService.verifyCredential(parseInt(id));
    
    if (!isValid) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found or has been revoked'
      });
    }

    // Generate verification URL
    const verificationUrl = `${process.env.APP_DOMAIN || 'https://proofvault-miniapp.vercel.app'}/verify/${id}`;
    
    // QR code options
    const options = {
      type: format === 'svg' ? 'svg' : 'png',
      width: Math.min(Math.max(parseInt(size), 100), 1000), // Limit size between 100-1000px
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    };

    if (format === 'svg') {
      // Generate SVG QR code
      const qrSvg = await QRCode.toString(verificationUrl, {
        ...options,
        type: 'svg'
      });
      
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(qrSvg);
    } else {
      // Generate PNG QR code
      const qrBuffer = await QRCode.toBuffer(verificationUrl, options);
      
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(qrBuffer);
    }

  } catch (error) {
    console.error('Generate QR code error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate QR code'
    });
  }
};
