// API endpoint for generating QR codes for credentials
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tokenId } = req.query;

    if (!tokenId) {
      return res.status(400).json({ error: 'Token ID is required' });
    }

    // Create verification URL and offline data
    const verificationUrl = `${req.headers.origin || process.env.NEXT_PUBLIC_APP_DOMAIN || 'http://localhost:3000'}/verify?token=${tokenId}`;
    
    const offlineData = {
      type: 'ProofVault-Certificate',
      tokenId,
      verificationUrl,
      timestamp: new Date().toISOString(),
      instructions: 'Scan this QR code to verify the authenticity of this ProofVault certificate'
    };

    // Return the data that should be encoded in the QR code
    res.status(200).json({
      success: true,
      qrData: JSON.stringify(offlineData),
      verificationUrl,
      tokenId
    });

  } catch (error) {
    console.error('QR Code API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate QR code data',
      details: error.message 
    });
  }
}
