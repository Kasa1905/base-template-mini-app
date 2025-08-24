import { NextApiRequest, NextApiResponse } from 'next';

// Mock credentials database
const mockCredentials = [
  {
    tokenId: "123",
    title: "Bachelor of Computer Science",
    issuer: "MIT",
    dateIssued: "2023-05-15",
    description: "4-year degree in Computer Science with focus on AI and Machine Learning",
    ipfsHash: "QmSampleHash1",
    holder: "0x1234567890123456789012345678901234567890",
    timestamp: "1684094400",
    isValid: true,
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
  },
  {
    tokenId: "456", 
    title: "Certified Ethereum Developer",
    issuer: "Ethereum Foundation",
    dateIssued: "2023-08-20",
    description: "Professional certification in Ethereum smart contract development",
    ipfsHash: "QmSampleHash2",
    holder: "0x1234567890123456789012345678901234567890",
    timestamp: "1692489600",
    isValid: true,
    transactionHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  }
];

export default async function handler(req, res) {
  const { walletAddress } = req.query;

  if (req.method === 'GET') {
    return handleGetCredentials(req, res, walletAddress);
  } else if (req.method === 'POST') {
    return handleCreateCredential(req, res);
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}

// GET /api/credentials/[walletAddress] - Get credentials by wallet address
async function handleGetCredentials(req, res, walletAddress) {
  try {
    // Validate wallet address
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address is required'
      });
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format'
      });
    }

    // Filter credentials by wallet address
    const userCredentials = mockCredentials.filter(
      credential => credential.holder.toLowerCase() === walletAddress.toLowerCase()
    );

    // In production, you would query the blockchain and database:
    // const onchainCredentials = await getCredentialsFromContract(walletAddress);
    // const credentials = await enrichWithMetadata(onchainCredentials);

    res.status(200).json({
      success: true,
      credentials: userCredentials,
      count: userCredentials.length,
      walletAddress,
      message: userCredentials.length > 0 
        ? `Found ${userCredentials.length} credential(s)`
        : 'No credentials found for this wallet'
    });

  } catch (error) {
    console.error('Get credentials API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error occurred while fetching credentials'
    });
  }
}

// POST /api/credentials - Create/mint new credential (handled by mint.js)
async function handleCreateCredential(req, res) {
  res.status(301).json({
    success: false,
    error: 'Please use /api/mint endpoint to create new credentials'
  });
}
