import { ethers } from 'ethers';
import ProofVaultABI from '../config/ProofVaultABI.json' assert { type: 'json' };

export class ProofVaultService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.init();
  }

  async init() {
    try {
      // Initialize provider
      const rpcUrl = process.env.NODE_ENV === 'production' 
        ? process.env.BASE_RPC_URL 
        : process.env.BASE_SEPOLIA_RPC_URL;

      if (!rpcUrl) {
        throw new Error('RPC URL not configured');
      }

      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Initialize signer (for admin operations)
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      }

      // Initialize contract
      if (!process.env.PROOFVAULT_CONTRACT_ADDRESS) {
        throw new Error('ProofVault contract address not configured');
      }

      this.contract = new ethers.Contract(
        process.env.PROOFVAULT_CONTRACT_ADDRESS,
        ProofVaultABI,
        this.signer || this.provider
      );

      console.log('✅ ProofVault service initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize ProofVault service:', error);
      throw error;
    }
  }

  async ensureInitialized() {
    if (!this.contract) {
      await this.init();
    }
  }

  /**
   * Mint a new credential
   */
  async mintCredential(to, title, issuer, dateIssued, ipfsHash) {
    await this.ensureInitialized();

    if (!this.signer) {
      throw new Error('Signer not configured for minting');
    }

    try {
      const tx = await this.contract.mintCredential(
        to,
        title,
        issuer,
        dateIssued,
        ipfsHash
      );

      const receipt = await tx.wait();
      
      // Extract tokenId from events
      const event = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed && parsed.name === 'CredentialMinted';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = this.contract.interface.parseLog(event);
        return parsed.args.tokenId;
      }

      throw new Error('TokenId not found in transaction receipt');

    } catch (error) {
      console.error('Mint credential error:', error);
      
      if (error.reason) {
        throw new Error(`Smart contract error: ${error.reason}`);
      }
      
      if (error.message.includes('gas')) {
        throw new Error('Insufficient gas for transaction');
      }

      throw new Error(`Minting failed: ${error.message}`);
    }
  }

  /**
   * Get credential details
   */
  async getCredential(tokenId) {
    await this.ensureInitialized();

    try {
      const credential = await this.contract.getCredential(tokenId);
      
      return {
        title: credential.title,
        issuer: credential.issuer,
        dateIssued: credential.dateIssued,
        ipfsHash: credential.ipfsHash,
        holder: credential.holder,
        timestamp: credential.timestamp.toString(),
        isValid: credential.isValid
      };

    } catch (error) {
      console.error('Get credential error:', error);
      
      if (error.reason && error.reason.includes('does not exist')) {
        throw new Error('Credential does not exist');
      }

      throw new Error(`Failed to get credential: ${error.message}`);
    }
  }

  /**
   * Get all credentials for a holder
   */
  async getHolderCredentials(holderAddress) {
    await this.ensureInitialized();

    try {
      const tokenIds = await this.contract.getHolderCredentials(holderAddress);
      return tokenIds.map(id => id.toString());

    } catch (error) {
      console.error('Get holder credentials error:', error);
      throw new Error(`Failed to get holder credentials: ${error.message}`);
    }
  }

  /**
   * Verify credential validity
   */
  async verifyCredential(tokenId) {
    await this.ensureInitialized();

    try {
      return await this.contract.verifyCredential(tokenId);

    } catch (error) {
      console.error('Verify credential error:', error);
      
      if (error.reason && error.reason.includes('does not exist')) {
        return false;
      }

      throw new Error(`Failed to verify credential: ${error.message}`);
    }
  }

  /**
   * Revoke credential (admin only)
   */
  async revokeCredential(tokenId) {
    await this.ensureInitialized();

    if (!this.signer) {
      throw new Error('Signer not configured for revoking');
    }

    try {
      const tx = await this.contract.revokeCredential(tokenId);
      const receipt = await tx.wait();
      
      return receipt.hash;

    } catch (error) {
      console.error('Revoke credential error:', error);
      
      if (error.reason) {
        throw new Error(`Smart contract error: ${error.reason}`);
      }

      throw new Error(`Revocation failed: ${error.message}`);
    }
  }

  /**
   * Get total number of credentials
   */
  async getTotalCredentials() {
    await this.ensureInitialized();

    try {
      const total = await this.contract.totalCredentials();
      return parseInt(total.toString());

    } catch (error) {
      console.error('Get total credentials error:', error);
      throw new Error(`Failed to get total credentials: ${error.message}`);
    }
  }

  /**
   * Check if contract is deployed and accessible
   */
  async healthCheck() {
    try {
      await this.ensureInitialized();
      
      const total = await this.contract.totalCredentials();
      const contractAddress = await this.contract.getAddress();
      
      return {
        status: 'healthy',
        contractAddress,
        totalCredentials: total.toString(),
        network: await this.provider.getNetwork()
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }
}
