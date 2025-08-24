// Simplified mint API endpoint for demo purposes

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // For now, return a mock response until blockchain integration is ready
    const mockCredential = {
      id: Date.now().toString(),
      type: req.body?.credentialType || 'Achievement',
      recipient: req.body?.recipientName || 'Sample User',
      issuer: req.body?.organizationName || 'Sample Organization',
      issuedAt: new Date().toISOString(),
      status: 'minted'
    };

    res.status(200).json({ 
      success: true, 
      credential: mockCredential,
      message: 'Credential minted successfully (demo mode)'
    });
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ error: 'Failed to mint credential' });
  }
}
