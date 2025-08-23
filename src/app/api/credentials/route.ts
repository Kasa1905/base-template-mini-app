import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Mock data for now - replace with actual blockchain integration
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

// POST /api/credentials - Mint new credential
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, title, issuer, dateIssued, description, proofFile } = body;

    // Validate required fields
    if (!walletAddress || !title || !issuer || !dateIssued) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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

    // Mock implementation - replace with actual blockchain integration
    const newCredential = {
      tokenId: (mockCredentials.length + 1).toString(),
      title,
      issuer,
      dateIssued,
      ipfsHash: proofFile ? `QmMock${Date.now()}` : "",
      holder: walletAddress,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      isValid: true
    };

    mockCredentials.push(newCredential);

    return NextResponse.json({
      success: true,
      data: newCredential,
      message: 'Credential minted successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Mint credential error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to mint credential' },
      { status: 500 }
    );
  }
}

// GET /api/credentials - Get all credentials (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCredentials = mockCredentials.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedCredentials,
      pagination: {
        page,
        limit,
        total: mockCredentials.length,
        pages: Math.ceil(mockCredentials.length / limit)
      }
    });

  } catch (error: any) {
    console.error('Get credentials error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}
