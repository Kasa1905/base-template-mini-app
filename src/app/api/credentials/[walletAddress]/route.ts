import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Mock credentials data - same as in credentials route
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

// GET /api/credentials/[walletAddress] - Get credentials by wallet address
export async function GET(request: NextRequest, { params }: { params: { walletAddress: string } }) {
  try {
    const { walletAddress } = params;

    // Validate wallet address
    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Filter credentials by wallet address
    const userCredentials = mockCredentials.filter(
      credential => credential.holder.toLowerCase() === walletAddress.toLowerCase()
    );

    return NextResponse.json({
      success: true,
      data: userCredentials,
      count: userCredentials.length,
      walletAddress
    });

  } catch (error: any) {
    console.error('Get user credentials error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch user credentials' },
      { status: 500 }
    );
  }
}

// DELETE /api/credentials/[walletAddress] - Revoke credential (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { walletAddress: string } }) {
  try {
    const { walletAddress } = params;
    const body = await request.json();
    const { tokenId } = body;

    // Validate inputs
    if (!ethers.isAddress(walletAddress) || !tokenId) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address or token ID' },
        { status: 400 }
      );
    }

    // Find credential
    const credentialIndex = mockCredentials.findIndex(
      credential => 
        credential.tokenId === tokenId && 
        credential.holder.toLowerCase() === walletAddress.toLowerCase()
    );

    if (credentialIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Credential not found' },
        { status: 404 }
      );
    }

    // Mark as revoked (invalid)
    mockCredentials[credentialIndex].isValid = false;

    return NextResponse.json({
      success: true,
      message: 'Credential revoked successfully',
      data: mockCredentials[credentialIndex]
    });

  } catch (error: any) {
    console.error('Revoke credential error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to revoke credential' },
      { status: 500 }
    );
  }
}
