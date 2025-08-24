import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.initialized = false;
    
    // Network configurations
    this.networks = {
      baseSepolia: {
        name: 'Base Sepolia',
        rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
        chainId: 84532,
        explorer: 'https://sepolia.basescan.org'
      },
      base: {
        name: 'Base',
        rpcUrl: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
        chainId: 8453,
        explorer: 'https://basescan.org'
      },
      localhost: {
        name: 'Localhost',
        rpcUrl: 'http://localhost:8545',
        chainId: 31337,
        explorer: null
      }
    };
    
    this.currentNetwork = process.env.NODE_ENV === 'production' ? 'base' : 'baseSepolia';
  }

  // Initialize the Web3 service
  async initialize() {
    try {
      console.log(`🔄 Initializing Web3Service for ${this.networks[this.currentNetwork].name}...`);
      
      // Set up provider
      this.provider = new ethers.JsonRpcProvider(
        this.networks[this.currentNetwork].rpcUrl
      );
      
      // Test connection
      const network = await this.provider.getNetwork();
      console.log(`🌐 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
      
      // Set up signer if private key is available
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        console.log(`🔑 Signer address: ${this.signer.address}`);
      }
      
      // Load contract if address is available
      if (process.env.PROOFVAULT_CONTRACT_ADDRESS) {
        await this.loadContract();
      }
      
      this.initialized = true;
      console.log('✅ Web3Service initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Web3Service:', error.message);
      throw error;
    }
  }

  // Load the ProofVault smart contract
  async loadContract() {
    try {
      // Load contract ABI
      const abiPath = join(__dirname, '../config/ProofVaultABI.json');
      const contractABI = JSON.parse(readFileSync(abiPath, 'utf8'));
      
      const contractAddress = process.env.PROOFVAULT_CONTRACT_ADDRESS;
      
      if (!contractAddress) {
        throw new Error('PROOFVAULT_CONTRACT_ADDRESS not set in environment');
      }
      
      // Create contract instance
      this.contract = new ethers.Contract(
        contractAddress,
        contractABI,
        this.signer || this.provider
      );
      
      // Test contract connection
      const name = await this.contract.name();
      const symbol = await this.contract.symbol();
      
      console.log(`📜 Contract loaded: ${name} (${symbol}) at ${contractAddress}`);
      
      return this.contract;
    } catch (error) {
      console.error('❌ Failed to load contract:', error.message);
      throw error;
    }
  }

  // Mint a new credential NFT
  async mintCredential(credentialData) {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not initialized');
      }

      const {
        to,           // Recipient address
        title,        // Credential title
        issuer,       // Issuer name
        dateIssued,   // Date issued
        ipfsHash      // IPFS hash for metadata
      } = credentialData;

      console.log(`🔄 Minting credential "${title}" for ${to}...`);

      // Call the mint function on the smart contract
      const tx = await this.contract.mintCredential(
        to,
        title,
        issuer,
        dateIssued,
        ipfsHash,
        {
          gasLimit: 500000, // Set gas limit
        }
      );

      console.log(`⏳ Transaction submitted: ${tx.hash}`);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Extract token ID from events
      const mintEvent = receipt.logs.find(
        log => log.topics[0] === ethers.id('Transfer(address,address,uint256)')
      );
      
      let tokenId = null;
      if (mintEvent) {
        tokenId = ethers.getBigInt(mintEvent.topics[3]).toString();
      }

      console.log(`✅ Credential minted successfully! Token ID: ${tokenId}`);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        tokenId: tokenId,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'success' : 'failed'
      };

    } catch (error) {
      console.error('❌ Failed to mint credential:', error.message);
      
      // Parse common error types
      let errorMessage = error.message;
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds for gas fees';
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Network connection error';
      }

      throw new Error(`Minting failed: ${errorMessage}`);
    }
  }

  // Verify a credential by token ID
  async verifyCredential(tokenId) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      console.log(`🔍 Verifying credential with token ID: ${tokenId}`);

      // Get credential data from blockchain
      const credential = await this.contract.credentials(tokenId);
      
      if (!credential.holder || credential.holder === ethers.ZeroAddress) {
        throw new Error('Credential not found');
      }

      // Check if credential is still valid
      const isValid = credential.isValid;

      return {
        tokenId: tokenId,
        title: credential.title,
        issuer: credential.issuer,
        dateIssued: credential.dateIssued,
        ipfsHash: credential.ipfsHash,
        holder: credential.holder,
        timestamp: credential.timestamp.toString(),
        isValid: isValid,
        verified: true
      };

    } catch (error) {
      console.error('❌ Failed to verify credential:', error.message);
      throw new Error(`Verification failed: ${error.message}`);
    }
  }

  // Get all credentials for a specific holder
  async getHolderCredentials(holderAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      console.log(`📋 Getting credentials for holder: ${holderAddress}`);

      // Get credential token IDs for holder
      const tokenIds = await this.contract.holderCredentials(holderAddress);
      
      const credentials = [];
      
      // Fetch details for each credential
      for (const tokenId of tokenIds) {
        try {
          const credential = await this.verifyCredential(tokenId.toString());
          credentials.push(credential);
        } catch (error) {
          console.warn(`⚠️ Failed to get credential ${tokenId}:`, error.message);
        }
      }

      return credentials;

    } catch (error) {
      console.error('❌ Failed to get holder credentials:', error.message);
      throw new Error(`Failed to get credentials: ${error.message}`);
    }
  }

  // Revoke a credential (only issuer can do this)
  async revokeCredential(tokenId) {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract or signer not initialized');
      }

      console.log(`🚫 Revoking credential with token ID: ${tokenId}`);

      const tx = await this.contract.revokeCredential(tokenId);
      const receipt = await tx.wait();

      console.log(`✅ Credential revoked successfully!`);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };

    } catch (error) {
      console.error('❌ Failed to revoke credential:', error.message);
      throw new Error(`Revocation failed: ${error.message}`);
    }
  }

  // Get total supply of credentials
  async getTotalSupply() {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const totalSupply = await this.contract.totalSupply();
      return totalSupply.toString();

    } catch (error) {
      console.error('❌ Failed to get total supply:', error.message);
      throw new Error(`Failed to get total supply: ${error.message}`);
    }
  }

  // Get contract information
  async getContractInfo() {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const [name, symbol, totalSupply, owner] = await Promise.all([
        this.contract.name(),
        this.contract.symbol(),
        this.contract.totalSupply(),
        this.contract.owner()
      ]);

      return {
        name,
        symbol,
        totalSupply: totalSupply.toString(),
        owner,
        address: await this.contract.getAddress(),
        network: this.networks[this.currentNetwork].name,
        chainId: this.networks[this.currentNetwork].chainId
      };

    } catch (error) {
      console.error('❌ Failed to get contract info:', error.message);
      throw new Error(`Failed to get contract info: ${error.message}`);
    }
  }

  // Estimate gas for minting
  async estimateGasForMint(credentialData) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }

      const { to, title, issuer, dateIssued, ipfsHash } = credentialData;

      const gasEstimate = await this.contract.mintCredential.estimateGas(
        to, title, issuer, dateIssued, ipfsHash
      );

      const gasPrice = await this.provider.getFeeData();

      return {
        gasLimit: gasEstimate.toString(),
        gasPrice: gasPrice.gasPrice.toString(),
        estimatedCost: (gasEstimate * gasPrice.gasPrice).toString()
      };

    } catch (error) {
      console.error('❌ Failed to estimate gas:', error.message);
      throw new Error(`Gas estimation failed: ${error.message}`);
    }
  }

  // Check if service is ready
  isReady() {
    return this.initialized && this.provider !== null;
  }

  // Get current network info
  getCurrentNetwork() {
    return this.networks[this.currentNetwork];
  }

  // Switch network (for development/testing)
  switchNetwork(networkName) {
    if (!this.networks[networkName]) {
      throw new Error(`Unknown network: ${networkName}`);
    }
    
    this.currentNetwork = networkName;
    this.initialized = false;
    
    // Re-initialize with new network
    return this.initialize();
  }
}

// Create singleton instance
const web3Service = new Web3Service();

export default web3Service;
export { Web3Service };
