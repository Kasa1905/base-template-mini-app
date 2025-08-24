import mongoose from 'mongoose';

const chatbotConversationSchema = new mongoose.Schema({
  // User identification
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  userWalletAddress: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  
  // Session information
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  
  // Message data
  message: {
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'resume', 'credential_request'],
      default: 'text'
    },
    metadata: {
      fileUrl: String,
      fileName: String,
      fileType: String,
      fileSize: Number
    }
  },
  
  // AI Response
  response: {
    content: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'recommendation', 'analysis', 'action_items', 'certification_list'],
      default: 'text'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    metadata: {
      model: String, // 'gpt-4', 'gpt-3.5-turbo', etc.
      tokensUsed: Number,
      processingTime: Number,
      context: String
    }
  },
  
  // Intent and context
  intent: {
    category: {
      type: String,
      enum: [
        'certification_inquiry', 'career_advice', 'resume_analysis', 
        'skill_assessment', 'certification_recommendation', 'general_chat',
        'verification_help', 'platform_support', 'credential_management'
      ]
    },
    confidence: Number,
    entities: [{ // Extracted entities from the message
      type: String, // 'skill', 'certification', 'company', 'role', etc.
      value: String,
      confidence: Number
    }]
  },
  
  // Context and state
  context: {
    previousMessages: Number, // Count of previous messages in session
    userProfile: {
      currentRole: String,
      industry: String,
      experienceLevel: String,
      skills: [String],
      goals: String
    },
    conversationState: {
      topic: String,
      stage: String, // 'greeting', 'questioning', 'analyzing', 'recommending', 'concluding'
      lastAction: String
    }
  },
  
  // Recommendations and actions (if applicable)
  recommendations: [{
    type: {
      type: String,
      enum: ['certification', 'skill', 'career_path', 'learning_resource']
    },
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    estimatedTime: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    url: String,
    cost: {
      amount: Number,
      currency: String,
      isFree: Boolean
    },
    provider: String,
    rating: Number
  }],
  
  // User feedback and satisfaction
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    helpful: Boolean,
    comment: String,
    submittedAt: Date
  },
  
  // Analytics and tracking
  analytics: {
    responseTime: Number, // Time taken to generate response (ms)
    userEngagement: {
      followUpQuestions: Number,
      actionsTaken: Number,
      linksClicked: Number
    },
    aiMetrics: {
      hallucination: Boolean,
      accuracy: Number,
      relevance: Number
    }
  },
  
  // Flags and moderation
  flags: {
    inappropriate: Boolean,
    spam: Boolean,
    error: Boolean,
    escalated: Boolean,
    resolved: Boolean
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
chatbotConversationSchema.index({ user: 1, timestamp: -1 });
chatbotConversationSchema.index({ sessionId: 1, timestamp: 1 });
chatbotConversationSchema.index({ conversationId: 1, timestamp: 1 });
chatbotConversationSchema.index({ 'intent.category': 1, timestamp: -1 });
chatbotConversationSchema.index({ timestamp: -1 });

// Compound indexes
chatbotConversationSchema.index({ userWalletAddress: 1, sessionId: 1, timestamp: 1 });

// Virtual for conversation summary
chatbotConversationSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    userMessage: this.message.content.substring(0, 100),
    aiResponse: this.response.content.substring(0, 100),
    intent: this.intent.category,
    timestamp: this.timestamp,
    hasRecommendations: this.recommendations && this.recommendations.length > 0
  };
});

// Methods
chatbotConversationSchema.methods.addFeedback = function(rating, helpful, comment) {
  this.feedback = {
    rating,
    helpful,
    comment,
    submittedAt: new Date()
  };
  return this.save();
};

chatbotConversationSchema.methods.markAsHelpful = function() {
  this.feedback.helpful = true;
  this.feedback.submittedAt = new Date();
  return this.save();
};

chatbotConversationSchema.methods.flag = function(flagType, reason) {
  this.flags[flagType] = true;
  if (reason) {
    this.flags.reason = reason;
  }
  return this.save();
};

// Static methods
chatbotConversationSchema.statics.getConversationHistory = function(sessionId, limit = 50) {
  return this.find({ sessionId })
    .sort({ timestamp: 1 })
    .limit(limit)
    .select('message.content response.content timestamp intent.category');
};

chatbotConversationSchema.statics.getUserConversations = function(userWalletAddress, limit = 100) {
  return this.find({ userWalletAddress: userWalletAddress.toLowerCase() })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('user', 'username profile.firstName profile.lastName');
};

chatbotConversationSchema.statics.getConversationsByIntent = function(intent, limit = 100) {
  return this.find({ 'intent.category': intent })
    .sort({ timestamp: -1 })
    .limit(limit);
};

chatbotConversationSchema.statics.getPopularQuestions = function(days = 30, limit = 10) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return this.aggregate([
    { $match: { timestamp: { $gte: cutoff } } },
    { $group: {
      _id: '$message.content',
      count: { $sum: 1 },
      avgRating: { $avg: '$feedback.rating' },
      lastAsked: { $max: '$timestamp' }
    }},
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

chatbotConversationSchema.statics.getAnalytics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        timestamp: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          intent: '$intent.category'
        },
        count: { $sum: 1 },
        avgConfidence: { $avg: '$response.confidence' },
        avgRating: { $avg: '$feedback.rating' },
        totalTokens: { $sum: '$response.metadata.tokensUsed' }
      }
    },
    { $sort: { '_id.date': 1 } }
  ]);
};

// Pre-save middleware
chatbotConversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Ensure wallet address is lowercase
  if (this.userWalletAddress) {
    this.userWalletAddress = this.userWalletAddress.toLowerCase();
  }
  
  // Auto-detect intent if not provided
  if (!this.intent.category && this.message.content) {
    const content = this.message.content.toLowerCase();
    
    if (content.includes('certification') || content.includes('certificate')) {
      this.intent.category = 'certification_inquiry';
    } else if (content.includes('career') || content.includes('job')) {
      this.intent.category = 'career_advice';
    } else if (content.includes('resume') || content.includes('cv')) {
      this.intent.category = 'resume_analysis';
    } else if (content.includes('skill') || content.includes('learn')) {
      this.intent.category = 'skill_assessment';
    } else if (content.includes('recommend') || content.includes('suggest')) {
      this.intent.category = 'certification_recommendation';
    } else {
      this.intent.category = 'general_chat';
    }
  }
  
  next();
});

const ChatbotConversation = mongoose.model('ChatbotConversation', chatbotConversationSchema);

export default ChatbotConversation;
