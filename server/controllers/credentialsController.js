import { ethers } from 'ethers';
import { User, Credential } from '../models/index.js';
import multiChainService from '../services/multiChainService.js';
import { uploadToIPFS } from '../services/ipfs.js';

/**
 * Mint a new credential NFT
 * @route POST /api/credentials/mint
 */
export const mintCredential = async (req, res) => {
  try {
    const { 
      walletAddress, 
      title, 
      description,
      category,
      issuer, 
      dateIssued, 
      proofFile,
      skills = [],
      achievement = {},
      visual = {},
      blockchain = 'solana', // New: allow chain selection
      privacy = false // New: privacy features
    } = req.body;

    console.log('🔄 Processing credential mint request:', { 
      walletAddress, 
      title, 
      category, 
      blockchain,
      privacy 
    });

    // Validate required fields
    if (!walletAddress || !title || !issuer?.name || !dateIssued || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: walletAddress, title, issuer.name, dateIssued, category'
      });
    }

    // Validate wallet address (support both Ethereum and Solana formats)
    const isEthereumAddress = ethers.isAddress(walletAddress);
    const isSolanaAddress = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress);
    
    if (!isEthereumAddress && !isSolanaAddress) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format (must be Ethereum or Solana format)'
      });
    }

    // Initialize multi-chain service
    await multiChainService.initialize();

    // Find or create user
    let user = await User.findByWallet(walletAddress);
    if (!user) {
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        auth: {
          lastLogin: new Date(),
          loginCount: 1
        }
      });
      await user.save();
      console.log('👤 Created new user:', user._id);
    }

    // Create metadata for IPFS
    const metadata = {
      title,
      description: description || `${title} issued by ${issuer.name}`,
      category,
      issuer,
      dateIssued,
      holder: walletAddress.toLowerCase(),
      skills,
      achievement,
      visual: {
        backgroundColor: visual.backgroundColor || '#3B82F6',
        textColor: visual.textColor || '#FFFFFF',
        badgeStyle: visual.badgeStyle || 'modern',
        ...visual
      },
      blockchain,
      privacy,
      timestamp: new Date().toISOString(),
      version: '2.0' // Updated version for multi-chain
    };

    // Upload metadata to IPFS
    let ipfsHash = '';
    try {
      console.log('📤 Uploading metadata to IPFS...');
      ipfsHash = await uploadToIPFS(metadata, proofFile);
      console.log('✅ IPFS upload successful:', ipfsHash);
    } catch (error) {
      console.error('❌ IPFS upload failed:', error.message);
      return res.status(500).json({
        success: false,
        error: `IPFS upload failed: ${error.message}`
      });
    }

    // Mint credential on selected blockchain(s)
    let mintResult;
    try {
      console.log(`⛓️ Minting credential on ${blockchain} ${privacy ? 'with privacy features' : ''}...`);
      
      mintResult = await multiChainService.mintCredential({
        to: walletAddress,
        title,
        description: metadata.description,
        category,
        issuer: issuer.name,
        dateIssued,
        skills,
        achievement,
        metadataUri: `https://ipfs.io/ipfs/${ipfsHash}`,
        chain: blockchain,
        privacy
      });
      
      console.log('✅ Multi-chain minting completed:', mintResult);
    } catch (error) {
      console.error('❌ Multi-chain minting failed:', error.message);
      return res.status(500).json({
        success: false,
        error: `Blockchain minting failed: ${error.message}`
      });
    }

    // Save credential to database with multi-chain data
    const credential = new Credential({
      tokenId: mintResult.results.primary?.mintAddress || 
               mintResult.results.primary?.credentialId || 
               Date.now(), // Fallback ID
      contractAddress: process.env.PROOFVAULT_CONTRACT_ADDRESS || 'multi-chain',
      holder: user._id,
      holderWalletAddress: walletAddress.toLowerCase(),
      title,
      description: metadata.description,
      category,
      issuer,
      skills: skills.map(skill => ({
        name: skill.name || skill,
        level: skill.level || 'Intermediate'
      })),
      achievement: {
        type: achievement.type || 'Certification',
        level: achievement.level || 'Professional',
        duration: achievement.duration,
        scoreAchieved: achievement.scoreAchieved,
        maxScore: achievement.maxScore,
        grade: achievement.grade
      },
      dateIssued: new Date(dateIssued),
      dateCompleted: achievement.dateCompleted ? new Date(achievement.dateCompleted) : new Date(dateIssued),
      blockchain: {
        primaryChain: mintResult.primaryChain,
        privacyEnabled: mintResult.privacyEnabled,
        networks: {
          [mintResult.primaryChain]: mintResult.results.primary,
          ...(mintResult.results.privacy && { zkSync: mintResult.results.privacy })
        },
        crossChainVerification: mintResult.crossChainVerification
      },
      ipfs: {
        metadataHash: ipfsHash,
        gatewayUrl: `https://ipfs.io/ipfs/${ipfsHash}`
      },
      visual,
      verification: {
        method: 'multi-chain',
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        chains: [mintResult.primaryChain],
        ...(mintResult.privacyEnabled && { 
          privacy: true, 
          chains: [...new Set([mintResult.primaryChain, 'zkSync'])]
        })
      }
    });

    // Generate shareable link and QR code data
    credential.generateShareableLink();
    credential.qrCode = {
      data: credential.privacy.shareableLink,
      shortUrl: credential.privacy.shareableLink
    };

    await credential.save();

    // Update user stats
    await user.incrementCredentialCount();

    console.log('✅ Credential saved to database:', credential._id);

    // Return success response
    res.status(201).json({
      success: true,
      message: `Credential minted successfully on ${mintResult.primaryChain}${mintResult.privacyEnabled ? ' with privacy features' : ''}`,
      data: {
        credential: credential.getPublicData(),
        blockchain: mintResult,
        multiChain: {
          primary: mintResult.primaryChain,
          privacy: mintResult.privacyEnabled,
          crossChain: mintResult.crossChainVerification
        },
        ipfs: {
          hash: ipfsHash,
          url: `https://ipfs.io/ipfs/${ipfsHash}`
        },
        shareUrl: credential.privacy.shareableLink,
        explorerUrls: {
          primary: mintResult.results.primary?.explorerUrl,
          ...(mintResult.results.privacy && { 
            privacy: mintResult.results.privacy.explorerUrl 
          })
        }
      }
    });

  } catch (error) {
    console.error('❌ Credential minting failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during credential minting'
    });
  }
};

/**
 * Get all credentials with advanced filtering and search
 * @route GET /api/credentials
 */
export const getCredentials = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search, 
      issuer, 
      sortBy = 'dateIssued',
      sortOrder = 'desc'
    } = req.query;

    // Build search filters
    const filters = {};
    if (category) filters.category = category;
    if (issuer) filters['issuer.name'] = new RegExp(issuer, 'i');
    if (search) {
      filters.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { 'issuer.name': new RegExp(search, 'i') }
      ];
    }

    // Build sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [credentials, totalCount] = await Promise.all([
      Credential.find(filters)
        .populate('holder', 'walletAddress profile.name')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Credential.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: credentials.map(cred => ({
        ...cred,
        holder: cred.holder?.walletAddress || 'Unknown'
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum)
      },
      filters: { category, search, issuer, sortBy, sortOrder }
    });

  } catch (error) {
    console.error('❌ Get credentials error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch credentials'
    });
  }
};

/**
 * Get specific credential by token ID
 * @route GET /api/credentials/:tokenId
 */
export const getCredential = async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    if (!tokenId || isNaN(tokenId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credential token ID'
      });
    }

    const credential = await Credential.findOne({ tokenId: parseInt(tokenId) })
      .populate('holder', 'walletAddress profile.name profile.bio')
      .lean();

    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    res.json({
      success: true,
      data: credential
    });

  } catch (error) {
    console.error('❌ Get credential error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch credential'
    });
  }
};

/**
 * Get user's credentials
 * @route GET /api/credentials/user/:walletAddress
 */
export const getUserCredentials = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { category, limit = 50 } = req.query;
    
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }

    // Find user first
    const user = await User.findByWallet(walletAddress);
    if (!user) {
      return res.json({
        success: true,
        data: [],
        count: 0,
        message: 'User not found'
      });
    }

    // Build filters
    const filters = { holder: user._id };
    if (category) filters.category = category;

    const credentials = await Credential.find(filters)
      .sort({ dateIssued: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      data: credentials,
      count: credentials.length,
      user: {
        walletAddress: user.walletAddress,
        credentialCount: user.stats.credentialCount,
        joinedAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Get user credentials error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user credentials'
    });
  }
};

/**
 * Verify credential authenticity across multiple chains
 * @route GET /api/credentials/:tokenId/verify
 */
export const verifyCredential = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { chain, verificationKey } = req.query;
    
    if (!tokenId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credential token ID'
      });
    }

    // Get credential from database
    const dbCredential = await Credential.findOne({ 
      $or: [
        { tokenId: tokenId },
        { tokenId: parseInt(tokenId) }
      ]
    })
    .populate('holder', 'walletAddress')
    .lean();

    if (!dbCredential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found in database'
      });
    }

    // Initialize multi-chain service
    await multiChainService.initialize();

    // Determine verification chain(s)
    const primaryChain = dbCredential.blockchain?.primaryChain || 'ethereum';
    const hasPrivacy = dbCredential.blockchain?.privacyEnabled || false;
    const verificationChains = dbCredential.verification?.chains || [primaryChain];

    const verificationResults = {};

    // Verify on primary chain
    try {
      console.log(`🔍 Verifying credential on ${primaryChain}...`);
      
      let identifier;
      if (primaryChain === 'solana') {
        identifier = dbCredential.blockchain?.networks?.solana?.mintAddress || tokenId;
      } else if (primaryChain === 'zksync') {
        identifier = dbCredential.blockchain?.networks?.zksync?.credentialId || tokenId;
      } else {
        identifier = tokenId; // Fallback for other chains
      }

      const primaryResult = await multiChainService.verifyCredential({
        chain: primaryChain,
        identifier,
        verificationKey
      });

      verificationResults.primary = {
        chain: primaryChain,
        ...primaryResult
      };

    } catch (error) {
      console.error(`❌ Primary chain verification failed:`, error.message);
      verificationResults.primary = {
        chain: primaryChain,
        success: false,
        error: error.message
      };
    }

    // Verify privacy layer if enabled
    if (hasPrivacy) {
      try {
        console.log('🔐 Verifying privacy layer on zkSync...');
        
        const privacyCredentialId = dbCredential.blockchain?.networks?.zkSync?.credentialId;
        if (privacyCredentialId) {
          const privacyResult = await multiChainService.verifyCredential({
            chain: 'zksync',
            identifier: privacyCredentialId,
            verificationKey
          });

          verificationResults.privacy = {
            chain: 'zksync',
            ...privacyResult
          };
        }

      } catch (error) {
        console.error(`❌ Privacy layer verification failed:`, error.message);
        verificationResults.privacy = {
          chain: 'zksync',
          success: false,
          error: error.message
        };
      }
    }

    // Cross-chain consensus
    const successfulVerifications = Object.values(verificationResults)
      .filter(result => result.success && result.primaryVerification?.isValid);
    
    const isValid = successfulVerifications.length > 0;
    const consensus = successfulVerifications.length > 1 ? 'multi-chain' : 'single-chain';

    // Update verification status in database
    if (isValid) {
      await Credential.updateOne(
        { _id: dbCredential._id },
        { 
          'verification.verificationStatus': 'verified',
          'verification.lastVerifiedAt': new Date(),
          'verification.verificationCount': (dbCredential.verification?.verificationCount || 0) + 1
        }
      );
    }

    res.json({
      success: true,
      data: {
        tokenId,
        isValid,
        consensus,
        multiChain: {
          primary: primaryChain,
          privacy: hasPrivacy,
          chains: verificationChains
        },
        verification: verificationResults,
        credential: {
          title: dbCredential.title,
          issuer: dbCredential.issuer,
          holder: dbCredential.holderWalletAddress,
          dateIssued: dbCredential.dateIssued,
          category: dbCredential.category,
          skills: dbCredential.skills,
          ipfsHash: dbCredential.ipfs?.metadataHash
        },
        verifiedAt: new Date().toISOString(),
        explorerUrls: {
          ...(verificationResults.primary?.success && {
            primary: dbCredential.blockchain?.networks?.[primaryChain]?.explorerUrl
          }),
          ...(verificationResults.privacy?.success && {
            privacy: dbCredential.blockchain?.networks?.zkSync?.explorerUrl
          })
        }
      }
    });

  } catch (error) {
    console.error('❌ Multi-chain credential verification failed:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to verify credential'
    });
  }
};

/**
 * Search credentials with advanced filters
 * @route GET /api/credentials/search
 */
export const searchCredentials = async (req, res) => {
  try {
    const { 
      q, 
      category, 
      issuer, 
      skills,
      dateFrom,
      dateTo,
      page = 1, 
      limit = 20 
    } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }

    // Build search filters
    const filters = {
      $or: [
        { title: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') },
        { 'issuer.name': new RegExp(q, 'i') },
        { 'skills.name': new RegExp(q, 'i') }
      ]
    };

    // Add additional filters
    if (category) filters.category = category;
    if (issuer) filters['issuer.name'] = new RegExp(issuer, 'i');
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      filters['skills.name'] = { $in: skillsArray.map(s => new RegExp(s, 'i')) };
    }
    if (dateFrom || dateTo) {
      filters.dateIssued = {};
      if (dateFrom) filters.dateIssued.$gte = new Date(dateFrom);
      if (dateTo) filters.dateIssued.$lte = new Date(dateTo);
    }

    // Execute search with pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [credentials, totalCount] = await Promise.all([
      Credential.find(filters)
        .populate('holder', 'walletAddress profile.name')
        .sort({ dateIssued: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Credential.countDocuments(filters)
    ]);

    res.json({
      success: true,
      data: credentials,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum)
      },
      searchQuery: q,
      appliedFilters: { category, issuer, skills, dateFrom, dateTo }
    });

  } catch (error) {
    console.error('❌ Search credentials error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to search credentials'
    });
  }
};

/**
 * Get credential analytics and stats
 * @route GET /api/credentials/analytics
 */
export const getCredentialAnalytics = async (req, res) => {
  try {
    const [
      totalCredentials,
      categoryCounts,
      recentActivity,
      topIssuers,
      verificationStats
    ] = await Promise.all([
      Credential.countDocuments(),
      Credential.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Credential.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title issuer.name dateIssued category')
        .lean(),
      Credential.aggregate([
        { $group: { _id: '$issuer.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Credential.aggregate([
        { 
          $group: { 
            _id: '$verification.verificationStatus', 
            count: { $sum: 1 } 
          } 
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCredentials,
          totalIssuers: topIssuers.length,
          categories: categoryCounts.length
        },
        categories: categoryCounts,
        topIssuers,
        recentActivity,
        verification: verificationStats,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Get analytics error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch analytics'
    });
  }
};

/**
 * Revoke credential (admin only)
 * @route PUT /api/credentials/:tokenId/revoke
 */
export const revokeCredential = async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { reason = 'Administrative action' } = req.body;
    
    if (!tokenId || isNaN(tokenId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid credential token ID'
      });
    }

    // Find credential in database
    const credential = await Credential.findOne({ tokenId: parseInt(tokenId) });
    if (!credential) {
      return res.status(404).json({
        success: false,
        error: 'Credential not found'
      });
    }

    // Initialize Web3 service if not ready
    if (!web3Service.isReady()) {
      await web3Service.initialize();
    }

    // Revoke on blockchain (if contract supports it)
    let blockchainResult;
    try {
      // Note: This depends on contract implementation
      blockchainResult = await web3Service.revokeCredential(parseInt(tokenId));
    } catch (error) {
      console.warn('⚠️ Blockchain revocation failed:', error.message);
      // Continue with database revocation even if blockchain fails
    }

    // Update credential in database
    await Credential.updateOne(
      { tokenId: parseInt(tokenId) },
      {
        'verification.verificationStatus': 'revoked',
        'verification.revokedAt': new Date(),
        'verification.revocationReason': reason,
        'verification.revokedBy': 'admin' // In future, get from auth context
      }
    );

    res.json({
      success: true,
      data: {
        tokenId: parseInt(tokenId),
        revoked: true,
        reason,
        revokedAt: new Date().toISOString(),
        blockchain: blockchainResult || null
      },
      message: 'Credential revoked successfully'
    });

  } catch (error) {
    console.error('❌ Revoke credential error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to revoke credential'
    });
  }
};
