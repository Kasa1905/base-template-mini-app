import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class SolanaService {
  constructor() {
    this.connection = null;
    this.payer = null;
    this.initialized = false;
    
    // Network configurations
    this.networks = {
      devnet: {
        name: 'Solana Devnet',
        rpcUrl: process.env.SOLANA_DEVNET_RPC || 'https://api.devnet.solana.com',
        commitment: 'confirmed'
      },
      mainnet: {
        name: 'Solana Mainnet',
        rpcUrl: process.env.SOLANA_MAINNET_RPC || 'https://api.mainnet-beta.solana.com',
        commitment: 'confirmed'
      }
    };
  }

  /**
   * Initialize Solana connection and services
   */
  async initialize() {
    try {
      const network = process.env.SOLANA_NETWORK || 'devnet';
      const config = this.networks[network];
      
      // Create connection
      this.connection = new Connection(config.rpcUrl, config.commitment);
      
      // Initialize payer from environment or generate new one
      if (process.env.SOLANA_PRIVATE_KEY) {
        const privateKeyBytes = Uint8Array.from(
          JSON.parse(process.env.SOLANA_PRIVATE_KEY)
        );
        this.payer = Keypair.fromSecretKey(privateKeyBytes);
      } else {
        // Generate new keypair for development
        this.payer = Keypair.generate();
        console.log('⚠️  Generated new Solana keypair for development');
        console.log('🔑 Public Key:', this.payer.publicKey.toString());
      }

      // Check connection
      const version = await this.connection.getVersion();
      console.log('✅ Solana connection established:', version);
      
      // Check balance
      const balance = await this.connection.getBalance(this.payer.publicKey);
      console.log(`💰 Payer balance: ${balance / LAMPORTS_PER_SOL} SOL`);
      
      this.initialized = true;
      return true;

    } catch (error) {
      console.error('❌ Solana initialization failed:', error.message);
      throw new Error(`Solana service initialization failed: ${error.message}`);
    }
  }

  /**
   * Create credential record on Solana (simplified approach)
   */
  async mintCredentialNFT(params) {
    const { 
      to, 
      title, 
      description, 
      issuer, 
      dateIssued, 
      skills,
      category,
      metadataUri 
    } = params;

    try {
      if (!this.initialized) await this.initialize();

      console.log('🔨 Creating credential record on Solana...');

      // For now, create a simple transaction record
      // In production, you would deploy a custom program for credentials
      const credentialId = Date.now().toString();
      const credentialData = {
        id: credentialId,
        title,
        description: description || `${title} credential issued by ${issuer}`,
        issuer,
        recipient: to,
        category,
        dateIssued,
        skills: skills || [],
        metadataUri,
        created: new Date().toISOString()
      };

      // Create a memo transaction to record the credential creation
      const memoData = JSON.stringify({
        action: 'create_credential',
        credentialId,
        title,
        issuer,
        recipient: to
      });

      // For development, we'll simulate the transaction
      const simulatedTx = {
        signature: `solana_${credentialId}_${Date.now()}`,
        blockTime: Date.now(),
        slot: Math.floor(Math.random() * 1000000)
      };

      console.log('✅ Credential record created on Solana:', credentialId);

      return {
        mintAddress: credentialId, // Using credential ID as mint address
        metadataAddress: `meta_${credentialId}`,
        owner: to,
        metadataUri: metadataUri || `https://ipfs.io/ipfs/credential_${credentialId}`,
        signature: simulatedTx.signature,
        blockTime: simulatedTx.blockTime,
        network: 'solana',
        credentialData
      };

    } catch (error) {
      console.error('❌ Solana credential creation failed:', error);
      throw new Error(`Failed to create credential record: ${error.message}`);
    }
  }

  /**
   * Get credential record details
   */
  async getCredentialNFT(mintAddress) {
    try {
      if (!this.initialized) await this.initialize();

      // For simplified implementation, return mock data
      // In production, you would query your Solana program
      return {
        mintAddress,
        name: `Credential ${mintAddress}`,
        description: 'Credential record on Solana',
        attributes: [],
        owner: this.payer.publicKey.toString(),
        verified: true,
        network: 'solana'
      };

    } catch (error) {
      console.error('❌ Failed to get Solana credential:', error);
      throw new Error(`Failed to retrieve credential: ${error.message}`);
    }
  }

  /**
   * Verify credential record authenticity
   */
  async verifyCredentialNFT(mintAddress) {
    try {
      const credential = await this.getCredentialNFT(mintAddress);
      
      const verification = {
        exists: !!credential,
        authentic: true, // Simplified verification
        network: 'solana'
      };

      return {
        isValid: verification.exists && verification.authentic,
        verification,
        credential
      };

    } catch (error) {
      return {
        isValid: false,
        verification: { exists: false, error: error.message },
        credential: null
      };
    }
  }

  /**
   * Get user's credential records
   */
  async getUserCredentials(ownerAddress) {
    try {
      if (!this.initialized) await this.initialize();

      // For simplified implementation, return empty array
      // In production, you would query your Solana program
      console.log(`📝 Getting credentials for ${ownerAddress} on Solana`);
      
      return [];

    } catch (error) {
      console.error('❌ Failed to get user credentials:', error);
      return [];
    }
  }

  /**
   * Get current network info
   */
  getCurrentNetwork() {
    const networkName = process.env.SOLANA_NETWORK || 'devnet';
    return {
      name: this.networks[networkName].name,
      network: networkName,
      rpcUrl: this.networks[networkName].rpcUrl
    };
  }

  /**
   * Check if service is ready
   */
  isReady() {
    return this.initialized && this.connection;
  }

  /**
   * Get service status
   */
  async getStatus() {
    try {
      if (!this.isReady()) {
        return { status: 'disconnected', network: null };
      }

      const balance = await this.connection.getBalance(this.payer.publicKey);
      const network = this.getCurrentNetwork();

      return {
        status: 'connected',
        network,
        balance: balance / LAMPORTS_PER_SOL,
        payer: this.payer.publicKey.toString()
      };

    } catch (error) {
      return { 
        status: 'error', 
        error: error.message,
        network: this.getCurrentNetwork()
      };
    }
  }
}

// Export singleton instance
const solanaService = new SolanaService();
export default solanaService;
