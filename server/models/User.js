import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Core user data
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    sparse: true, // Allow null but unique if provided
    lowercase: true
  },
  username: {
    type: String,
    sparse: true,
    trim: true
  },
  
  // Profile information
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String, // IPFS hash or URL
    location: String,
    website: String,
    linkedin: String,
    twitter: String
  },
  
  // Professional information
  professional: {
    currentRole: String,
    company: String,
    industry: String,
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Executive', 'Student'],
      default: 'Entry'
    },
    skills: [String],
    interests: [String],
    careerGoals: String
  },
  
  // App-specific data
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'connections'],
        default: 'public'
      },
      showCredentials: { type: Boolean, default: true }
    },
    autoPost: {
      linkedin: { type: Boolean, default: false },
      twitter: { type: Boolean, default: false }
    }
  },
  
  // Metrics and analytics
  stats: {
    credentialsEarned: { type: Number, default: 0 },
    credentialsIssued: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    socialShares: { type: Number, default: 0 },
    chatbotInteractions: { type: Number, default: 0 }
  },
  
  // Authentication and security
  auth: {
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationMethod: String, // 'email', 'phone', 'social'
    twoFactorEnabled: { type: Boolean, default: false }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ 'professional.industry': 1 });
userSchema.index({ 'professional.skills': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Methods
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save();
};

userSchema.methods.incrementCredentialCount = function() {
  this.stats.credentialsEarned += 1;
  return this.save();
};

userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    fullName: this.fullName,
    avatar: this.profile.avatar,
    bio: this.profile.bio,
    location: this.profile.location,
    currentRole: this.professional.currentRole,
    company: this.professional.company,
    skills: this.professional.skills,
    credentialsEarned: this.stats.credentialsEarned
  };
};

// Static methods
userSchema.statics.findByWallet = function(walletAddress) {
  return this.findOne({ walletAddress: walletAddress.toLowerCase() });
};

userSchema.statics.getTopUsers = function(limit = 10) {
  return this.find()
    .sort({ 'stats.credentialsEarned': -1 })
    .limit(limit)
    .select('username profile.firstName profile.lastName profile.avatar stats.credentialsEarned');
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.walletAddress) {
    this.walletAddress = this.walletAddress.toLowerCase();
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
