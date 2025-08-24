import { NextApiRequest, NextApiResponse } from 'next';

// Mock credentials database (same as verify API)
const mockCredentials = [
  {
    tokenId: "123",
    title: "Bachelor of Computer Science",
    issuer: "MIT",
    dateIssued: "2023-05-15",
    ipfsHash: "QmSampleHash1",
    holder: "0x1234567890123456789012345678901234567890",
    timestamp: "1684094400",
    isValid: true
  },
  {
    tokenId: "456", 
    title: "Certified Ethereum Developer",
    issuer: "Ethereum Foundation",
    dateIssued: "2023-08-20",
    ipfsHash: "QmSampleHash2",
    holder: "0x1234567890123456789012345678901234567890",
    timestamp: "1692489600",
    isValid: true
  }
];

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleSharePost(req, res);
  } else if (req.method === 'GET') {
    return handleShareGet(req, res);
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// POST /api/share - Generate shareable link for credential
async function handleSharePost(req, res) {
  try {
    const { tokenId, walletAddress, platform = 'farcaster' } = req.body;

    // Validate required fields
    if (!tokenId || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Token ID and wallet address are required'
      });
    }

    // Validate wallet address
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format'
      });
    }

    // Find credential
    const credential = mockCredentials.find(
      cred => 
        cred.tokenId === tokenId && 
        cred.holder.toLowerCase() === walletAddress.toLowerCase() &&
        cred.isValid
    );

    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found or invalid'
      });
    }

    // Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000';
    const shareUrl = `${baseUrl}/verify?tokenId=${credential.tokenId}`;
    
    // Generate QR code URL
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

    // Create share content based on platform
    let shareContent;
    switch (platform.toLowerCase()) {
      case 'farcaster':
        shareContent = {
          text: `🎓 Just verified my "${credential.title}" credential from ${credential.issuer} on @base using ProofVault! \n\n✅ Blockchain-verified\n🔗 Verify it yourself:`,
          url: shareUrl,
          embeds: [shareUrl],
          hashtags: ['ProofVault', 'Base', 'Credentials', 'Web3']
        };
        break;
      case 'twitter':
        const twitterText = `🎓 Verified my "${credential.title}" credential from ${credential.issuer} on @base using ProofVault! \n\n✅ Blockchain-verified 🔗 ${shareUrl}`;
        shareContent = {
          text: twitterText,
          url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`,
          hashtags: ['ProofVault', 'Base', 'Blockchain', 'Credentials']
        };
        break;
      case 'linkedin':
        shareContent = {
          text: `I'm excited to share that my "${credential.title}" credential from ${credential.issuer} is now verified on the blockchain using ProofVault!`,
          url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          hashtags: ['Web3', 'Credentials', 'Blockchain']
        };
        break;
      default:
        shareContent = {
          text: `Verified credential: "${credential.title}" from ${credential.issuer}`,
          url: shareUrl
        };
    }

    res.status(200).json({
      success: true,
      data: {
        shareUrl,
        qrCodeUrl,
        platform,
        shareContent,
        credential: {
          tokenId: credential.tokenId,
          title: credential.title,
          issuer: credential.issuer,
          dateIssued: credential.dateIssued
        }
      },
      message: 'Share link generated successfully'
    });

  } catch (error) {
    console.error('Share POST API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error occurred while generating share link'
    });
  }
}

// GET /api/share?tokenId=123 - Get shareable credential info
async function handleShareGet(req, res) {
  try {
    const { tokenId } = req.query;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        error: 'Token ID is required'
      });
    }

    // Find credential
    const credential = mockCredentials.find(cred => cred.tokenId === tokenId);

    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    if (!credential.isValid) {
      return res.status(410).json({
        success: false,
        error: 'Credential has been revoked'
      });
    }

    // Generate verification URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify?tokenId=${tokenId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`;

    res.status(200).json({
      success: true,
      data: {
        credential,
        verifyUrl,
        qrCodeUrl,
        shareableInfo: {
          title: credential.title,
          issuer: credential.issuer,
          holder: credential.holder,
          dateIssued: credential.dateIssued,
          isValid: credential.isValid,
          description: `${credential.title} issued by ${credential.issuer}`
        }
      }
    });

  } catch (error) {
    console.error('Share GET API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error occurred while fetching shareable credential'
    });
  }
}
