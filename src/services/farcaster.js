// Farcaster Service for social sharing integration
// This service handles Farcaster frame generation and Neynar API integration

class FarcasterService {
  constructor() {
    this.neynarApiKey = process.env.NEYNAR_API_KEY;
    this.neynarBaseUrl = 'https://api.neynar.com/v2';
    this.appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  /**
   * Create a Farcaster frame for credential sharing
   * @param {Object} credential - The credential to share
   * @returns {Object} - Frame metadata
   */
  createCredentialFrame(credential) {
    try {
      const frameUrl = `${this.appUrl}/verify/${credential.tokenId}`;
      const imageUrl = `${this.appUrl}/api/opengraph-image?tokenId=${credential.tokenId}`;

      return {
        'fc:frame': 'vNext',
        'fc:frame:image': imageUrl,
        'fc:frame:image:aspect_ratio': '1.91:1',
        'fc:frame:button:1': 'Verify Credential',
        'fc:frame:button:1:action': 'link',
        'fc:frame:button:1:target': frameUrl,
        'fc:frame:button:2': 'Learn More',
        'fc:frame:button:2:action': 'link',
        'fc:frame:button:2:target': this.appUrl,
        'og:title': `${credential.title} - ProofVault`,
        'og:description': `${credential.issuer} issued credential: ${credential.description}`,
        'og:image': imageUrl,
        'og:url': frameUrl,
        'twitter:card': 'summary_large_image',
        'twitter:title': `${credential.title} - ProofVault`,
        'twitter:description': `Verified credential issued by ${credential.issuer}`,
        'twitter:image': imageUrl
      };
    } catch (error) {
      console.error('Error creating Farcaster frame:', error);
      return null;
    }
  }

  /**
   * Generate share text for credential
   * @param {Object} credential - The credential to share
   * @returns {string} - Formatted share text
   */
  generateShareText(credential) {
    try {
      const verifyUrl = `${this.appUrl}/verify/${credential.tokenId}`;
      
      return [
        `🎓 Just got verified on ProofVault!`,
        ``,
        `📜 ${credential.title}`,
        `🏛️ Issued by: ${credential.issuer}`,
        `✅ Blockchain Verified`,
        ``,
        `Verify this credential: ${verifyUrl}`,
        ``,
        `#ProofVault #Credentials #Base #Blockchain`
      ].join('\n');
    } catch (error) {
      console.error('Error generating share text:', error);
      return 'Check out my verified credential on ProofVault!';
    }
  }

  /**
   * Get user profile from Farcaster (via Neynar)
   * @param {string} fid - Farcaster ID
   * @returns {Promise<Object>} - User profile data
   */
  async getUserProfile(fid) {
    try {
      if (!this.neynarApiKey) {
        console.log('Development mode: Mock Farcaster profile');
        return {
          success: true,
          user: {
            fid: fid,
            username: 'mockuser',
            displayName: 'Mock User',
            pfp: {
              url: 'https://via.placeholder.com/150'
            },
            profile: {
              bio: {
                text: 'Mock user for testing'
              }
            },
            followerCount: 100,
            followingCount: 50
          }
        };
      }

      const response = await fetch(`${this.neynarBaseUrl}/farcaster/user?fid=${fid}`, {
        headers: {
          'api_key': this.neynarApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        user: data.result?.user || data.user
      };

    } catch (error) {
      console.error('Get user profile error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch user profile'
      };
    }
  }

  /**
   * Post a cast to Farcaster (via Neynar)
   * @param {string} signerUuid - Signer UUID for posting
   * @param {string} text - Cast text
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Post result
   */
  async postCast(signerUuid, text, options = {}) {
    try {
      if (!this.neynarApiKey || !signerUuid) {
        console.log('Development mode: Mock cast posting');
        return {
          success: true,
          cast: {
            hash: '0x' + Math.random().toString(16).substring(2, 10),
            author: {
              username: 'mockuser',
              fid: 123
            },
            text,
            timestamp: new Date().toISOString()
          }
        };
      }

      const requestBody = {
        signer_uuid: signerUuid,
        text,
        ...options
      };

      const response = await fetch(`${this.neynarBaseUrl}/farcaster/cast`, {
        method: 'POST',
        headers: {
          'api_key': this.neynarApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Failed to post cast: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        cast: data.result?.cast || data.cast
      };

    } catch (error) {
      console.error('Post cast error:', error);
      return {
        success: false,
        error: error.message || 'Failed to post cast'
      };
    }
  }

  /**
   * Share credential on Farcaster
   * @param {Object} credential - The credential to share
   * @param {string} signerUuid - Optional signer UUID for direct posting
   * @returns {Promise<Object>} - Share result
   */
  async shareCredential(credential, signerUuid = null) {
    try {
      const shareText = this.generateShareText(credential);
      const verifyUrl = `${this.appUrl}/verify/${credential.tokenId}`;

      // If signer provided, post directly
      if (signerUuid) {
        return await this.postCast(signerUuid, shareText);
      }

      // Otherwise, return compose URL for manual sharing
      const composeUrl = this.createComposeUrl(shareText, verifyUrl);
      
      return {
        success: true,
        shareText,
        composeUrl,
        verifyUrl,
        message: 'Share URL generated successfully'
      };

    } catch (error) {
      console.error('Share credential error:', error);
      return {
        success: false,
        error: error.message || 'Failed to share credential'
      };
    }
  }

  /**
   * Create Warpcast compose URL
   * @param {string} text - Text to share
   * @param {string} url - URL to include
   * @returns {string} - Warpcast compose URL
   */
  createComposeUrl(text, url = '') {
    const params = new URLSearchParams();
    
    if (text) {
      params.append('text', text);
    }
    
    if (url) {
      params.append('embeds[]', url);
    }

    return `https://warpcast.com/~/compose?${params.toString()}`;
  }

  /**
   * Get channel information
   * @param {string} channelId - Channel ID to query
   * @returns {Promise<Object>} - Channel data
   */
  async getChannel(channelId) {
    try {
      if (!this.neynarApiKey) {
        return {
          success: true,
          channel: {
            id: channelId,
            name: 'Mock Channel',
            description: 'Mock channel for testing',
            followerCount: 1000
          }
        };
      }

      const response = await fetch(`${this.neynarBaseUrl}/farcaster/channel?id=${channelId}`, {
        headers: {
          'api_key': this.neynarApiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get channel: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        channel: data.result?.channel || data.channel
      };

    } catch (error) {
      console.error('Get channel error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get channel'
      };
    }
  }

  /**
   * Generate QR code for credential sharing
   * @param {Object} credential - The credential to generate QR for
   * @returns {Promise<Object>} - QR code data
   */
  async generateCredentialQR(credential) {
    try {
      const verifyUrl = `${this.appUrl}/verify/${credential.tokenId}`;
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verifyUrl)}`;
      
      return {
        success: true,
        qrCodeUrl: qrApiUrl,
        verifyUrl,
        credential: {
          tokenId: credential.tokenId,
          title: credential.title,
          issuer: credential.issuer
        }
      };

    } catch (error) {
      console.error('Generate QR code error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate QR code'
      };
    }
  }

  /**
   * Validate Farcaster signature
   * @param {string} message - Message that was signed
   * @param {string} signature - Signature to validate
   * @param {string} fid - Farcaster ID
   * @returns {Promise<Object>} - Validation result
   */
  async validateSignature(message, signature, fid) {
    try {
      if (!this.neynarApiKey) {
        return {
          success: true,
          valid: true,
          message: 'Mock signature validation'
        };
      }

      const response = await fetch(`${this.neynarBaseUrl}/farcaster/validate_message`, {
        method: 'POST',
        headers: {
          'api_key': this.neynarApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          signature,
          fid
        })
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        valid: data.valid || false,
        message: data.message || 'Signature validated'
      };

    } catch (error) {
      console.error('Validate signature error:', error);
      return {
        success: false,
        error: error.message || 'Failed to validate signature'
      };
    }
  }
}

// Export singleton instance
const farcasterService = new FarcasterService();
export default farcasterService;
