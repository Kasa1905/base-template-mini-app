import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Mock credentials data - same as in credentials routes
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

// POST /api/verify - Verify a credential
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenId, walletAddress } = body;

    // Validate required fields
    if (!tokenId) {
      return NextResponse.json(
        { success: false, error: 'Token ID is required' },
        { status: 400 }
      );
    }

    // If wallet address is provided, validate it
    if (walletAddress && !ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    // Find credential
    let credential = mockCredentials.find(cred => cred.tokenId === tokenId);

    // If wallet address is provided, also check if it matches
    if (walletAddress && credential) {
      if (credential.holder.toLowerCase() !== walletAddress.toLowerCase()) {
        credential = undefined;
      }
    }

    if (!credential) {
      return NextResponse.json({
        success: false,
        isValid: false,
        error: 'Credential not found',
        data: null
      }, { status: 404 });
    }

    // Check if credential is still valid (not revoked)
    if (!credential.isValid) {
      return NextResponse.json({
        success: true,
        isValid: false,
        message: 'Credential has been revoked',
        data: credential
      });
    }

    return NextResponse.json({
      success: true,
      isValid: true,
      message: 'Credential is valid',
      data: credential,
      verificationDetails: {
        tokenId: credential.tokenId,
        holder: credential.holder,
        issuer: credential.issuer,
        title: credential.title,
        dateIssued: credential.dateIssued,
        timestamp: credential.timestamp,
        ipfsHash: credential.ipfsHash
      }
    });

  } catch (error: any) {
    console.error('Verify credential error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify credential' },
      { status: 500 }
    );
  }
}

// GET /api/verify?tokenId=123 - Quick verification endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get('tokenId');
    const walletAddress = searchParams.get('walletAddress');

    if (!tokenId) {
      return NextResponse.json(
        { success: false, error: 'Token ID is required' },
        { status: 400 }
      );
    }

    // Reuse POST logic
    const verificationRequest = {
      tokenId,
      ...(walletAddress && { walletAddress })
    };

    // Create a mock request object for reusing POST logic
    const mockRequest = {
      json: async () => verificationRequest
    } as NextRequest;

    return await POST(mockRequest);

  } catch (error: any) {
    console.error('Quick verify error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify credential' },
      { status: 500 }
    );
  }
}
