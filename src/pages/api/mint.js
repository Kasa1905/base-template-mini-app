import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import { uploadToIPFS } from '../../services/ipfs';
import { mintCredential } from '../../services/onchainkit';

// Disable Next.js body parsing for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const form = new IncomingForm({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Extract form data
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const issuer = Array.isArray(fields.issuer) ? fields.issuer[0] : fields.issuer;
    const date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const walletAddress = Array.isArray(fields.walletAddress) ? fields.walletAddress[0] : fields.walletAddress;

    // Validate required fields
    if (!title || !issuer || !date || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, issuer, date, walletAddress'
      });
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format'
      });
    }

    let ipfsHash = '';
    
    // Upload proof file to IPFS if provided
    if (files.proofFile) {
      const proofFile = Array.isArray(files.proofFile) ? files.proofFile[0] : files.proofFile;
      
      try {
        const fileBuffer = await fs.readFile(proofFile.filepath);
        const uploadResult = await uploadToIPFS(fileBuffer, proofFile.originalFilename);
        ipfsHash = uploadResult.hash;
        
        // Clean up temporary file
        await fs.unlink(proofFile.filepath);
      } catch (uploadError) {
        console.error('IPFS upload error:', uploadError);
        // Continue without IPFS hash if upload fails
      }
    }

    // Create credential metadata
    const credentialMetadata = {
      title,
      issuer,
      dateIssued: date,
      description: description || '',
      ipfsHash,
      timestamp: Math.floor(Date.now() / 1000).toString(),
      holder: walletAddress
    };

    // For now, simulate minting (replace with actual blockchain call)
    const mockTokenId = Math.floor(Math.random() * 1000000).toString();
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // In production, you would call the actual smart contract here:
    // const { tokenId, transactionHash } = await mintCredential(credentialMetadata);

    // Store credential in mock database (replace with real database)
    const credential = {
      tokenId: mockTokenId,
      title,
      issuer,
      dateIssued: date,
      description: description || '',
      ipfsHash,
      holder: walletAddress,
      timestamp: credentialMetadata.timestamp,
      isValid: true,
      transactionHash: mockTxHash
    };

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Credential minted successfully',
      tokenId: mockTokenId,
      transactionHash: mockTxHash,
      ipfsHash,
      credential,
      explorerUrl: `https://sepolia-explorer.base.org/tx/${mockTxHash}`
    });

  } catch (error) {
    console.error('Mint API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error occurred while minting credential'
    });
  }
}
