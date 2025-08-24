import solanaService from './solanaService.js';
import zkSyncService from './zkSyncService.js';
import { ethers } from 'ethers';

class MultiChainService {
  constructor() {
    this.defaultChain = process.env.DEFAULT_CHAIN || 'solana';
    this.privacyEnabled = process.env.PRIVACY_ENABLED === 'true';
  }

  /**
   * Initialize all blockchain services
   */
  async initialize() {
    const results = {
      solana: false,
      zkSync: false
    };

    try {
      // Initialize Solana
      await solanaService.initialize();
      results.solana = true;
      console.log('✅ Solana service initialized');
    } catch (error) {
      console.error('❌ Solana initialization failed:', error.message);
    }

    try {
      // Initialize zkSync if privacy is enabled
      if (this.privacyEnabled) {
        await zkSyncService.initialize();
        results.zkSync = true;
        console.log('✅ zkSync service initialized');
      }
    } catch (error) {
      console.error('❌ zkSync initialization failed:', error.message);
    }

    return results;
  }

  /**
   * Mint credential with multi-chain support
   */
  async mintCredential(params) {
    const { 
      chain = this.defaultChain,
      privacy = false,
      ...credentialParams 
    } = params;

    const results = {};

    try {
      // Primary minting on selected chain
      if (chain === 'solana') {
        console.log('🚀 Minting on Solana...');
        results.primary = await this.mintOnSolana(credentialParams);
      } else if (chain === 'zksync') {
        console.log('🔐 Minting on zkSync...');
        results.primary = await this.mintOnZkSync(credentialParams);
      }

      // Privacy layer on zkSync if enabled and not already primary
      if (privacy && this.privacyEnabled && chain !== 'zksync') {
        console.log('🔒 Adding privacy layer on zkSync...');
        results.privacy = await this.createPrivacyLayer(credentialParams, results.primary);
      }

      // Cross-chain verification setup
      results.verification = await this.setupCrossChainVerification(results);

      return {
        success: true,
        primaryChain: chain,
        privacyEnabled: privacy && this.privacyEnabled,
        results,
        crossChainVerification: !!results.verification
      };

    } catch (error) {
      console.error('❌ Multi-chain minting failed:', error);
      throw new Error(`Multi-chain credential minting failed: ${error.message}`);
    }
  }

  /**
   * Mint credential on Solana
   */
  async mintOnSolana(params) {
    try {
      const result = await solanaService.mintCredentialNFT(params);
      
      return {
        chain: 'solana',
        mintAddress: result.mintAddress,
        owner: result.owner,
        metadataUri: result.metadataUri,
        signature: result.signature,
        blockTime: result.blockTime,
        network: result.network,
        explorerUrl: `https://solscan.io/token/${result.mintAddress}${
          solanaService.getCurrentNetwork().network === 'devnet' ? '?cluster=devnet' : ''
        }`
      };
    } catch (error) {
      throw new Error(`Solana minting failed: ${error.message}`);
    }
  }

  /**
   * Mint credential on zkSync with privacy
   */
  async mintOnZkSync(params) {
    try {
      // Generate credential hash for privacy
      const credentialHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['string', 'string', 'string', 'uint256'],
          [params.title, params.issuer, params.to, Date.now()]
        )
      );

      // Generate ZK proof
      const zkProof = await zkSyncService.generateZkProof(params, credentialHash);

      const result = await zkSyncService.createPrivateCredential({
        recipient: params.to,
        credentialHash,
        metadataHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(params))),
        zkProof: zkProof.proof
      });

      return {
        chain: 'zksync',
        credentialId: result.credentialId,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        recipient: result.recipient,
        credentialHash: result.credentialHash,
        zkProof: result.zkProof,
        explorerUrl: `${zkSyncService.getCurrentNetwork().explorer}/tx/${result.transactionHash}`
      };
    } catch (error) {
      throw new Error(`zkSync minting failed: ${error.message}`);
    }
  }

  /**
   * Create privacy layer on zkSync for credentials minted on other chains
   */
  async createPrivacyLayer(originalParams, primaryResult) {
    try {
      console.log('🔐 Creating privacy layer...');

      // Create privacy proof linking to primary chain credential
      const privacyHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
          ['string', 'string', 'string'],
          [primaryResult.chain, primaryResult.mintAddress || primaryResult.credentialId, originalParams.to]
        )
      );

      const zkProof = await zkSyncService.generateZkProof(originalParams, privacyHash);

      const privacyResult = await zkSyncService.createPrivateCredential({
        recipient: originalParams.to,
        credentialHash: privacyHash,
        metadataHash: ethers.utils.keccak256(ethers.utils.toUtf8Bytes('privacy_layer')),
        zkProof: zkProof.proof
      });

      return {
        ...privacyResult,
        linkedToPrimary: primaryResult.chain,
        privacyProof: zkProof.proof
      };

    } catch (error) {
      console.warn('⚠️  Privacy layer creation failed:', error.message);
      return null;
    }
  }

  /**
   * Setup cross-chain verification
   */
  async setupCrossChainVerification(results) {
    try {
      const verification = {
        primary: results.primary?.chain,
        privacy: results.privacy ? 'zksync' : null,
        verificationMethods: []
      };

      // Add verification methods based on chains used
      if (results.primary?.chain === 'solana') {
        verification.verificationMethods.push({
          chain: 'solana',
          method: 'nft_verification',
          address: results.primary.mintAddress
        });
      }

      if (results.primary?.chain === 'zksync' || results.privacy) {
        verification.verificationMethods.push({
          chain: 'zksync',
          method: 'zk_proof_verification',
          credentialId: results.primary?.credentialId || results.privacy?.credentialId
        });
      }

      return verification;

    } catch (error) {
      console.warn('⚠️  Cross-chain verification setup failed:', error.message);
      return null;
    }
  }

  /**
   * Verify credential across chains
   */
  async verifyCredential(params) {
    const { chain, identifier, verificationKey } = params;
    const results = {};

    try {
      // Verify on specified chain
      if (chain === 'solana') {
        results.solana = await solanaService.verifyCredentialNFT(identifier);
      } else if (chain === 'zksync') {
        results.zkSync = await zkSyncService.verifyPrivateCredential(identifier, verificationKey);
      }

      // Cross-chain verification if multiple chains involved
      const crossChainValid = await this.performCrossChainVerification(results);

      return {
        success: true,
        primaryVerification: results[chain],
        crossChainVerification: crossChainValid,
        verifiedChains: Object.keys(results).filter(key => results[key]?.isValid)
      };

    } catch (error) {
      console.error('❌ Multi-chain verification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Perform cross-chain verification
   */
  async performCrossChainVerification(verificationResults) {
    try {
      const validChains = Object.keys(verificationResults).filter(
        chain => verificationResults[chain]?.isValid
      );

      return {
        isValid: validChains.length > 0,
        validChains,
        consensus: validChains.length > 1 ? 'multi-chain' : 'single-chain'
      };

    } catch (error) {
      console.error('❌ Cross-chain verification failed:', error);
      return { isValid: false, error: error.message };
    }
  }

  /**
   * Get user credentials from all chains
   */
  async getUserCredentials(userAddress) {
    const credentials = {
      solana: [],
      zkSync: [],
      total: 0
    };

    try {
      // Get Solana credentials
      if (solanaService.isReady()) {
        credentials.solana = await solanaService.getUserCredentials(userAddress);
      }

      // Get zkSync credentials (if privacy enabled)
      if (this.privacyEnabled && zkSyncService.isReady()) {
        credentials.zkSync = await zkSyncService.getUserPrivateCredentials(userAddress);
      }

      credentials.total = credentials.solana.length + credentials.zkSync.length;

      return {
        success: true,
        credentials,
        chains: {
          solana: solanaService.isReady(),
          zkSync: this.privacyEnabled && zkSyncService.isReady()
        }
      };

    } catch (error) {
      console.error('❌ Failed to get user credentials:', error);
      return {
        success: false,
        error: error.message,
        credentials
      };
    }
  }

  /**
   * Get multi-chain service status
   */
  async getStatus() {
    const status = {
      multiChain: true,
      defaultChain: this.defaultChain,
      privacyEnabled: this.privacyEnabled,
      chains: {}
    };

    try {
      // Get Solana status
      status.chains.solana = await solanaService.getStatus();

      // Get zkSync status if enabled
      if (this.privacyEnabled) {
        status.chains.zkSync = await zkSyncService.getStatus();
      }

      // Overall health check
      const connectedChains = Object.keys(status.chains).filter(
        chain => status.chains[chain].status === 'connected'
      );

      status.overallStatus = connectedChains.length > 0 ? 'operational' : 'degraded';
      status.connectedChains = connectedChains;

      return status;

    } catch (error) {
      return {
        ...status,
        overallStatus: 'error',
        error: error.message
      };
    }
  }
}

// Export singleton instance
const multiChainService = new MultiChainService();
export default multiChainService;
export { multiChainService };
