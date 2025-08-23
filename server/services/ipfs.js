import { Web3Storage } from 'web3.storage';
import axios from 'axios';

/**
 * Upload file to IPFS using Web3.Storage
 */
export const uploadToIPFS = async (fileData, metadata) => {
  try {
    if (!process.env.WEB3_STORAGE_TOKEN) {
      throw new Error('Web3.Storage token not configured');
    }

    const client = new Web3Storage({ token: process.env.WEB3_STORAGE_TOKEN });
    
    // Create metadata JSON
    const credentialMetadata = {
      ...metadata,
      uploadedAt: new Date().toISOString(),
      version: '1.0'
    };

    // Convert file data to File objects
    const files = [];
    
    if (fileData) {
      // Handle base64 data
      if (typeof fileData === 'string' && fileData.startsWith('data:')) {
        const [header, base64Data] = fileData.split(',');
        const mimeType = header.split(':')[1].split(';')[0];
        const buffer = Buffer.from(base64Data, 'base64');
        
        files.push(new File([buffer], 'proof-document', { type: mimeType }));
      } else if (fileData instanceof Buffer) {
        files.push(new File([fileData], 'proof-document'));
      }
    }

    // Add metadata file
    files.push(new File([JSON.stringify(credentialMetadata, null, 2)], 'metadata.json', {
      type: 'application/json'
    }));

    // Upload to Web3.Storage
    const cid = await client.put(files);
    
    console.log('Successfully uploaded to IPFS:', cid);
    return cid;

  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error(`IPFS upload failed: ${error.message}`);
  }
};

/**
 * Upload to Pinata as fallback
 */
export const uploadToPinata = async (fileData, metadata) => {
  try {
    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
      throw new Error('Pinata credentials not configured');
    }

    const formData = new FormData();
    
    // Add file
    if (fileData) {
      if (typeof fileData === 'string' && fileData.startsWith('data:')) {
        const [header, base64Data] = fileData.split(',');
        const mimeType = header.split(':')[1].split(';')[0];
        const buffer = Buffer.from(base64Data, 'base64');
        
        formData.append('file', new Blob([buffer], { type: mimeType }), 'proof-document');
      } else if (fileData instanceof Buffer) {
        formData.append('file', new Blob([fileData]), 'proof-document');
      }
    }

    // Add metadata
    const pinataMetadata = {
      name: `ProofVault-${metadata.title}`,
      keyvalues: {
        title: metadata.title,
        issuer: metadata.issuer,
        holder: metadata.holder,
        dateIssued: metadata.dateIssued
      }
    };

    formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      headers: {
        'pinata_api_key': process.env.PINATA_API_KEY,
        'pinata_secret_api_key': process.env.PINATA_SECRET_KEY,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Successfully uploaded to Pinata:', response.data.IpfsHash);
    return response.data.IpfsHash;

  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error(`Pinata upload failed: ${error.message}`);
  }
};

/**
 * Retrieve file from IPFS
 */
export const getFromIPFS = async (hash) => {
  try {
    // Try multiple IPFS gateways
    const gateways = [
      `https://${hash}.ipfs.w3s.link`,
      `https://ipfs.io/ipfs/${hash}`,
      `https://gateway.pinata.cloud/ipfs/${hash}`,
      `https://cloudflare-ipfs.com/ipfs/${hash}`
    ];

    for (const gateway of gateways) {
      try {
        const response = await axios.get(gateway, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Accept': 'application/json, text/plain, */*'
          }
        });
        
        return response.data;
      } catch (error) {
        console.warn(`Failed to fetch from gateway ${gateway}:`, error.message);
        continue;
      }
    }

    throw new Error('Failed to fetch from all IPFS gateways');

  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
  }
};
