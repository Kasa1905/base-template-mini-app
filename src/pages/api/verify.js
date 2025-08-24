import { NextApiRequest, NextApiResponse } from 'next';

// Mock credentials database (replace with real database)
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
  },
  {
    tokenId: "789",
    title: "Revoked Certificate",
    issuer: "Test Institution",
    dateIssued: "2023-01-01",
    ipfsHash: "QmSampleHash3",
    holder: "0x9876543210987654321098765432109876543210",
    timestamp: "1672531200",
    isValid: false // This credential has been revoked
  }
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { tokenId, walletAddress } = req.query;

    // Validate token ID
    if (!tokenId) {
      return res.status(400).json({
        success: false,
        error: 'Token ID is required'
      });
    }

    // Validate wallet address if provided
    if (walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format'
      });
    }

    // Find credential by token ID
    let credential = mockCredentials.find(cred => cred.tokenId === tokenId);

    // If wallet address is provided, also check if it matches
    if (walletAddress && credential) {
      if (credential.holder.toLowerCase() !== walletAddress.toLowerCase()) {
        credential = null;
      }
    }

    // Check if credential exists
    if (!credential) {
      return res.status(404).json({
        success: false,
        isValid: false,
        error: 'Credential not found',
        message: walletAddress 
          ? 'No credential found for this token ID and wallet address combination'
          : 'No credential found for this token ID',
        data: null
      });
    }

    // Check if credential is still valid (not revoked)
    if (!credential.isValid) {
      return res.status(200).json({
        success: true,
        isValid: false,
        message: 'Credential has been revoked or is no longer valid',
        data: credential,
        verificationDetails: {
          tokenId: credential.tokenId,
          status: 'REVOKED',
          reason: 'This credential has been revoked by the issuer',
          revokedAt: new Date().toISOString()
        }
      });
    }

    // In production, you would verify against the blockchain:
    // const onchainData = await getCredentialFromContract(tokenId);
    // const isValidOnchain = await verifyCredentialOnchain(credential);

    // Return successful verification
    res.status(200).json({
      success: true,
      isValid: true,
      message: 'Credential is valid and authentic',
      data: credential,
      verificationDetails: {
        tokenId: credential.tokenId,
        holder: credential.holder,
        issuer: credential.issuer,
        title: credential.title,
        dateIssued: credential.dateIssued,
        timestamp: credential.timestamp,
        ipfsHash: credential.ipfsHash,
        status: 'VALID',
        verifiedAt: new Date().toISOString(),
        blockchain: 'Base Sepolia',
        network: 'Ethereum Layer 2'
      }
    });

  } catch (error) {
    console.error('Verify API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error occurred during verification'
    });
  }
}
