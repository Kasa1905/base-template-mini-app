import mongoose from 'mongoose';

const credentialSchema = new mongoose.Schema({
  // Core credential data
  tokenId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  contractAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  
  // Owner information
  holder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  holderWalletAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  
  // Issuer information
  issuer: {
    name: { type: String, required: true },
    organization: String,
    website: String,
    logo: String, // IPFS hash or URL
    walletAddress: String,
    verified: { type: Boolean, default: false }
  },
  
  // Credential metadata
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Education', 'Professional', 'Technical', 'Language', 'Leadership',
      'Marketing', 'Design', 'Development', 'Finance', 'Healthcare',
      'Legal', 'Sales', 'Project Management', 'Data Science', 'Cybersecurity',
      'Cloud Computing', 'DevOps', 'AI/ML', 'Blockchain', 'Other'
    ],
    index: true
  },
  subcategory: String,
  
  // Skills and competencies
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
    }
  }],
  
  // Achievement details
  achievement: {
    type: {
      type: String,
      enum: ['Course Completion', 'Certification', 'Award', 'License', 'Degree', 'Training'],
      required: true
    },
    level: {
      type: String,
      enum: ['Basic', 'Intermediate', 'Advanced', 'Professional', 'Expert', 'Master']
    },
    duration: String, // "3 months", "40 hours", etc.
    scoreAchieved: Number,
    maxScore: Number,
    passingScore: Number,
    grade: String
  },
  
  // Dates and validity
  dateIssued: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  dateCompleted: Date,
  expiryDate: Date,
  isValid: {
    type: Boolean,
    default: true,
    index: true
  },
  
  // Blockchain and storage
  blockchain: {
    network: {
      type: String,
      enum: ['Base', 'Base Sepolia', 'Ethereum', 'Polygon'],
      default: 'Base Sepolia'
    },
    transactionHash: String,
    blockNumber: Number,
    gasUsed: Number
  },
  
  // IPFS storage
  ipfs: {
    metadataHash: String,
    imageHash: String,
    documentHash: String, // Additional documents/certificates
    gatewayUrl: String
  },
  
  // Visual and display
  visual: {
    backgroundColor: { type: String, default: '#3B82F6' },
    textColor: { type: String, default: '#FFFFFF' },
    badgeStyle: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'elegant'],
      default: 'modern'
    },
    template: String // Template ID for rendering
  },
  
  // Verification and trust
  verification: {
    method: {
      type: String,
      enum: ['blockchain', 'api', 'manual'],
      default: 'blockchain'
    },
    verifiedAt: Date,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed', 'revoked'],
      default: 'pending'
    },
    verifier: String,
    verificationNotes: String
  },
  
  // Privacy and sharing
  privacy: {
    isPublic: { type: Boolean, default: true },
    shareableLink: String,
    allowDownload: { type: Boolean, default: true },
    showOnProfile: { type: Boolean, default: true }
  },
  
  // Social and engagement
  social: {
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    linkedinPosts: [{
      postId: String,
      postedAt: Date,
      engagement: {
        likes: Number,
        comments: Number,
        shares: Number
      }
    }],
    twitterPosts: [{
      tweetId: String,
      postedAt: Date,
      engagement: {
        likes: Number,
        retweets: Number,
        replies: Number
      }
    }]
  },
  
  // QR Code for sharing
  qrCode: {
    data: String, // QR code data
    imageUrl: String, // Generated QR code image
    shortUrl: String // Shortened URL for sharing
  },
  
  // Tags and searchability
  tags: [String],
  searchKeywords: [String],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance and queries
credentialSchema.index({ category: 1, 'dateIssued': -1 });
credentialSchema.index({ 'holder': 1, 'dateIssued': -1 });
credentialSchema.index({ 'issuer.name': 1 });
credentialSchema.index({ tags: 1 });
credentialSchema.index({ searchKeywords: 1 });
credentialSchema.index({ 'verification.verificationStatus': 1 });

// Compound indexes
credentialSchema.index({ holderWalletAddress: 1, isValid: 1, dateIssued: -1 });
credentialSchema.index({ category: 1, subcategory: 1, dateIssued: -1 });

// Virtual for credential URL
credentialSchema.virtual('shareUrl').get(function() {
  return `${process.env.NEXTAUTH_URL}/credential/${this.tokenId}`;
});

// Virtual for age of credential
credentialSchema.virtual('age').get(function() {
  const now = new Date();
  const issued = new Date(this.dateIssued);
  const diffTime = Math.abs(now - issued);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for status
credentialSchema.virtual('status').get(function() {
  if (!this.isValid) return 'Invalid';
  if (this.expiryDate && new Date() > this.expiryDate) return 'Expired';
  return this.verification.verificationStatus;
});

// Methods
credentialSchema.methods.incrementViews = function() {
  this.social.views += 1;
  return this.save();
};

credentialSchema.methods.incrementShares = function() {
  this.social.shares += 1;
  return this.save();
};

credentialSchema.methods.addLinkedInPost = function(postData) {
  this.social.linkedinPosts.push(postData);
  return this.save();
};

credentialSchema.methods.generateShareableLink = function() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  this.privacy.shareableLink = `${baseUrl}/verify/${this.tokenId}`;
  return this.privacy.shareableLink;
};

credentialSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    tokenId: this.tokenId,
    title: this.title,
    description: this.description,
    category: this.category,
    issuer: this.issuer,
    dateIssued: this.dateIssued,
    skills: this.skills,
    visual: this.visual,
    verification: {
      verificationStatus: this.verification.verificationStatus,
      verifiedAt: this.verification.verifiedAt
    },
    shareUrl: this.shareUrl,
    age: this.age,
    status: this.status
  };
};

// Static methods
credentialSchema.statics.findByTokenId = function(tokenId) {
  return this.findOne({ tokenId });
};

credentialSchema.statics.findByHolder = function(holderAddress) {
  return this.find({ 
    holderWalletAddress: holderAddress.toLowerCase(),
    isValid: true 
  }).sort({ dateIssued: -1 });
};

credentialSchema.statics.findByCategory = function(category, limit = 20) {
  return this.find({ 
    category,
    isValid: true,
    'privacy.isPublic': true 
  })
  .populate('holder', 'username profile.firstName profile.lastName profile.avatar')
  .sort({ dateIssued: -1 })
  .limit(limit);
};

credentialSchema.statics.getTrendingCredentials = function(limit = 10) {
  return this.find({
    isValid: true,
    'privacy.isPublic': true
  })
  .sort({ 'social.views': -1, 'social.shares': -1, dateIssued: -1 })
  .limit(limit)
  .populate('holder', 'username profile.firstName profile.lastName profile.avatar');
};

credentialSchema.statics.searchCredentials = function(query, filters = {}) {
  const searchQuery = {
    isValid: true,
    'privacy.isPublic': true,
    ...filters
  };

  if (query) {
    searchQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { 'issuer.name': { $regex: query, $options: 'i' } },
      { tags: { $regex: query, $options: 'i' } },
      { searchKeywords: { $regex: query, $options: 'i' } }
    ];
  }

  return this.find(searchQuery)
    .populate('holder', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ dateIssued: -1 });
};

// Pre-save middleware
credentialSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Generate search keywords for better discoverability
  if (this.isModified('title') || this.isModified('description') || this.isModified('category')) {
    const keywords = [];
    keywords.push(...this.title.toLowerCase().split(' '));
    keywords.push(...this.description.toLowerCase().split(' '));
    keywords.push(this.category.toLowerCase());
    if (this.subcategory) keywords.push(this.subcategory.toLowerCase());
    if (this.issuer.name) keywords.push(...this.issuer.name.toLowerCase().split(' '));
    
    // Remove duplicates and filter out common words
    const commonWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    this.searchKeywords = [...new Set(keywords)]
      .filter(word => word.length > 2 && !commonWords.includes(word));
  }
  
  // Ensure wallet addresses are lowercase
  if (this.holderWalletAddress) {
    this.holderWalletAddress = this.holderWalletAddress.toLowerCase();
  }
  
  next();
});

const Credential = mongoose.model('Credential', credentialSchema);

export default Credential;
