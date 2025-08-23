import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Mock credentials data for sharing
const mockCredentials = [
  {
    tokenId: "1",
    title: "Bachelor of Computer Science",
    issuer: "MIT",
    dateIssued: "2023-05-15",
    ipfsHash: "QmSampleHash1",
    holder: "0x1234567890123456789012345678901234567890",
    timestamp: "1684094400",
    isValid: true
  },
  {
    tokenId: "2", 
    title: "Certified Ethereum Developer",
    issuer: "Ethereum Foundation",
    dateIssued: "2023-08-20",
    ipfsHash: "QmSampleHash2",
    holder: "0x1234567890123456789012345678901234567890",
    timestamp: "1692489600",
    isValid: true
  }
];

// POST /api/share - Generate shareable link for credential
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenId, walletAddress, platform = 'farcaster' } = body;

    // Validate required fields
    if (!tokenId || !walletAddress) {
      return NextResponse.json(
        { success: false, error: 'Token ID and wallet address are required' },
        { status: 400 }
      );
    }

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Find credential
    const credential = mockCredentials.find(
      cred => 
        cred.tokenId === tokenId && 
        cred.holder.toLowerCase() === walletAddress.toLowerCase() &&
        cred.isValid
    );

    if (!credential) {
      return NextResponse.json(
        { success: false, error: 'Credential not found or invalid' },
        { status: 404 }
      );
    }

    // Generate share URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/share/${credential.tokenId}`;
    
    // Generate QR code URL (using a QR service)
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

    // Create share content based on platform
    let shareContent;
    switch (platform.toLowerCase()) {
      case 'farcaster':
        shareContent = {
          text: `🎓 Just verified my "${credential.title}" credential from ${credential.issuer} on @base using ProofVault! \n\n✅ Blockchain-verified\n🔗 ${shareUrl}`,
          url: shareUrl,
          embeds: [shareUrl]
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
      default:
        shareContent = {
          text: `Verified credential: "${credential.title}" from ${credential.issuer}`,
          url: shareUrl
        };
    }

    return NextResponse.json({
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

  } catch (error: any) {
    console.error('Generate share link error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate share link' },
      { status: 500 }
    );
  }
}

// GET /api/share?tokenId=123 - Get shareable credential info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('tokenId');

    if (!tokenId) {
      return NextResponse.json(
        { success: false, error: 'Token ID is required' },
        { status: 400 }
      );
    }

    // Find credential
    const credential = mockCredentials.find(cred => cred.tokenId === tokenId);

    if (!credential) {
      return NextResponse.json(
        { success: false, error: 'Credential not found' },
        { status: 404 }
      );
    }

    if (!credential.isValid) {
      return NextResponse.json(
        { success: false, error: 'Credential has been revoked' },
        { status: 410 }
      );
    }

    // Generate verification QR code
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify?tokenId=${tokenId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`;

    return NextResponse.json({
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
          isValid: credential.isValid
        }
      }
    });

  } catch (error: any) {
    console.error('Get shareable credential error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get shareable credential' },
      { status: 500 }
    );
  }
}
