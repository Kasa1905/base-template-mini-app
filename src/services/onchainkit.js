// OnchainKit Service for Base blockchain integration
// This service handles smart contract interactions and blockchain operations

import { ethers } from 'ethers';

class OnchainKitService {
  constructor() {
    this.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
    this.baseSepoliaRPC = 'https://sepolia.base.org';
    this.baseMainnetRPC = 'https://mainnet.base.org';
    
    // Contract ABI for ProofVault (simplified version)
    this.contractABI = [
      {
        "inputs": [
          { "internalType": "address", "name": "to", "type": "address" },
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "issuer", "type": "string" },
          { "internalType": "string", "name": "ipfsHash", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" }
        ],
        "name": "mintCredential",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "getCredential",
        "outputs": [
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "string", "name": "issuer", "type": "string" },
          { "internalType": "string", "name": "ipfsHash", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
          { "internalType": "bool", "name": "isValid", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "address", "name": "holder", "type": "address" }],
        "name": "getCredentialsByHolder",
        "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "verifyCredential",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
        "name": "ownerOf",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  }

  /**
   * Get provider for Base network
   * @param {boolean} isTestnet - Whether to use testnet
   * @returns {ethers.JsonRpcProvider} - RPC provider
   */
  getProvider(isTestnet = true) {
    const rpcUrl = isTestnet ? this.baseSepoliaRPC : this.baseMainnetRPC;
    return new ethers.JsonRpcProvider(rpcUrl);
  }

  /**
   * Get contract instance
   * @param {ethers.Signer|ethers.Provider} signerOrProvider - Signer or provider
   * @returns {ethers.Contract} - Contract instance
   */
  getContract(signerOrProvider) {
    return new ethers.Contract(this.contractAddress, this.contractABI, signerOrProvider);
  }

  /**
   * Get Web3 provider from wallet
   * @returns {ethers.BrowserProvider|null} - Browser provider
   */
  async getWeb3Provider() {
    if (typeof window === 'undefined' || !window.ethereum) {
      return null;
    }

    try {
      return new ethers.BrowserProvider(window.ethereum);
    } catch (error) {
      console.error('Error getting Web3 provider:', error);
      return null;
    }
  }

  /**
   * Mint a new credential NFT
   * @param {Object} credentialData - The credential data
   * @returns {Promise<Object>} - Mint result
   */
  async mintCredential(credentialData) {
    try {
      const { to, title, issuer, ipfsHash, description } = credentialData;

      // Validate inputs
      if (!to || !ethers.isAddress(to)) {
        throw new Error('Invalid recipient address');
      }

      if (!title || !issuer || !ipfsHash || !description) {
        throw new Error('Missing required credential data');
      }

      // For development/testing, return mock transaction
      if (process.env.NODE_ENV === 'development' || !this.contractAddress) {
        console.log('Development mode: Simulating credential minting');
        
        const mockTokenId = Math.floor(Math.random() * 1000000);
        const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66);
        
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
          success: true,
          tokenId: mockTokenId,
          transactionHash: mockTxHash,
          to,
          title,
          issuer,
          ipfsHash,
          description,
          gasUsed: '150000',
          timestamp: Math.floor(Date.now() / 1000)
        };
      }

      // Get provider and signer
      const provider = await this.getWeb3Provider();
      if (!provider) {
        throw new Error('Web3 provider not available');
      }

      const signer = await provider.getSigner();
      const contract = this.getContract(signer);

      // Estimate gas
      const gasEstimate = await contract.mintCredential.estimateGas(
        to, title, issuer, ipfsHash, description
      );

      // Execute transaction
      const tx = await contract.mintCredential(
        to, title, issuer, ipfsHash, description,
        {
          gasLimit: gasEstimate * BigInt(120) / BigInt(100), // Add 20% buffer
        }
      );

      // Wait for confirmation
      const receipt = await tx.wait();
      
      // Extract token ID from logs (assuming Transfer event is emitted)
      const tokenId = receipt.logs && receipt.logs.length > 0 
        ? parseInt(receipt.logs[0].topics[3], 16) 
        : null;

      return {
        success: true,
        tokenId,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        to,
        title,
        issuer,
        ipfsHash,
        description,
        timestamp: Math.floor(Date.now() / 1000)
      };

    } catch (error) {
      console.error('Mint credential error:', error);
      
      // Parse error message
      let errorMessage = error.message || 'Failed to mint credential';
      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction rejected by user';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for transaction';
      }

      return {
        success: false,
        error: errorMessage,
        code: error.code,
        details: error
      };
    }
  }

  /**
   * Get credential data by token ID
   * @param {string|number} tokenId - Token ID to query
   * @returns {Promise<Object>} - Credential data
   */
  async getCredential(tokenId) {
    try {
      if (!tokenId) {
        throw new Error('Token ID is required');
      }

      // For development/testing, return mock data
      if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode: Fetching credential ${tokenId}`);
        
        return {
          success: true,
          tokenId: tokenId.toString(),
          title: 'Mock Credential',
          issuer: 'Test University',
          ipfsHash: 'QmMockHash123',
          description: 'This is a mock credential for testing',
          timestamp: Math.floor(Date.now() / 1000),
          isValid: true,
          holder: '0x1234567890123456789012345678901234567890'
        };
      }

      const provider = this.getProvider();
      const contract = this.getContract(provider);

      const [title, issuer, ipfsHash, description, timestamp, isValid] = 
        await contract.getCredential(tokenId);

      const holder = await contract.ownerOf(tokenId);

      return {
        success: true,
        tokenId: tokenId.toString(),
        title,
        issuer,
        ipfsHash,
        description,
        timestamp: timestamp.toString(),
        isValid,
        holder
      };

    } catch (error) {
      console.error('Get credential error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch credential',
        tokenId: tokenId?.toString()
      };
    }
  }

  /**
   * Get all credentials owned by an address
   * @param {string} holderAddress - Address to query
   * @returns {Promise<Object>} - List of credentials
   */
  async getCredentialsByHolder(holderAddress) {
    try {
      if (!holderAddress || !ethers.isAddress(holderAddress)) {
        throw new Error('Invalid holder address');
      }

      // For development/testing, return mock data
      if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode: Fetching credentials for ${holderAddress}`);
        
        return {
          success: true,
          credentials: [
            {
              tokenId: '123',
              title: 'Bachelor of Computer Science',
              issuer: 'MIT',
              ipfsHash: 'QmMockHash1',
              description: 'Mock credential for testing',
              timestamp: Math.floor(Date.now() / 1000),
              isValid: true,
              holder: holderAddress
            }
          ],
          count: 1,
          holderAddress
        };
      }

      const provider = this.getProvider();
      const contract = this.getContract(provider);

      const tokenIds = await contract.getCredentialsByHolder(holderAddress);
      const credentials = [];

      for (const tokenId of tokenIds) {
        const credentialResult = await this.getCredential(tokenId.toString());
        if (credentialResult.success) {
          credentials.push(credentialResult);
        }
      }

      return {
        success: true,
        credentials,
        count: credentials.length,
        holderAddress
      };

    } catch (error) {
      console.error('Get credentials by holder error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch credentials',
        holderAddress
      };
    }
  }

  /**
   * Verify a credential's authenticity
   * @param {string|number} tokenId - Token ID to verify
   * @returns {Promise<Object>} - Verification result
   */
  async verifyCredential(tokenId) {
    try {
      if (!tokenId) {
        throw new Error('Token ID is required');
      }

      // For development/testing, return mock verification
      if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode: Verifying credential ${tokenId}`);
        
        return {
          success: true,
          tokenId: tokenId.toString(),
          isValid: true,
          verificationTime: new Date().toISOString(),
          message: 'Credential verified successfully (mock)'
        };
      }

      const provider = this.getProvider();
      const contract = this.getContract(provider);

      const isValid = await contract.verifyCredential(tokenId);
      const credential = await this.getCredential(tokenId);

      return {
        success: true,
        tokenId: tokenId.toString(),
        isValid,
        verificationTime: new Date().toISOString(),
        credential: credential.success ? credential : null,
        message: isValid ? 'Credential verified successfully' : 'Credential verification failed'
      };

    } catch (error) {
      console.error('Verify credential error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify credential',
        tokenId: tokenId?.toString()
      };
    }
  }

  /**
   * Get contract statistics
   * @returns {Promise<Object>} - Contract stats
   */
  async getContractStats() {
    try {
      // For development/testing, return mock stats
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          totalCredentials: 42,
          totalHolders: 15,
          contractAddress: this.contractAddress,
          network: 'Base Sepolia (Mock)'
        };
      }

      const provider = this.getProvider();
      
      // You would implement actual contract stats here
      return {
        success: true,
        totalCredentials: 0,
        totalHolders: 0,
        contractAddress: this.contractAddress,
        network: 'Base Sepolia'
      };

    } catch (error) {
      console.error('Get contract stats error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch contract stats'
      };
    }
  }
}

// Export singleton instance
const onchainKitService = new OnchainKitService();
export default onchainKitService;
