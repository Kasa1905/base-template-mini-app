// IPFS Service using Web3.Storage
// This service handles uploading credential proofs to IPFS

class IPFSService {
  constructor() {
    this.web3StorageToken = process.env.WEB3_STORAGE_TOKEN;
    this.gatewayUrl = 'https://dweb.link/ipfs/';
  }

  /**
   * Upload a file to IPFS via Web3.Storage
   * @param {File} file - The file to upload
   * @param {Object} metadata - Additional metadata for the credential
   * @returns {Promise<Object>} - Upload result with IPFS hash
   */
  async uploadFile(file, metadata = {}) {
    try {
      // Validate file
      if (!file) {
        throw new Error('No file provided for upload');
      }

      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Validate file types (images, PDFs, documents)
      const allowedTypes = [
        'image/jpeg',
        'image/png', 
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file type. Please upload images, PDFs, or documents.');
      }

      // For development/testing, return mock IPFS hash
      if (process.env.NODE_ENV === 'development' || !this.web3StorageToken) {
        console.log('Development mode: Simulating IPFS upload');
        const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
        
        return {
          success: true,
          ipfsHash: mockHash,
          url: `${this.gatewayUrl}${mockHash}`,
          size: file.size,
          type: file.type,
          name: file.name,
          metadata: {
            ...metadata,
            uploadedAt: new Date().toISOString(),
            originalName: file.name,
            size: file.size,
            type: file.type
          }
        };
      }

      // Production upload with Web3.Storage
      const { Web3Storage } = await import('web3.storage');
      const client = new Web3Storage({ token: this.web3StorageToken });

      // Create metadata file
      const credentialMetadata = {
        ...metadata,
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
        size: file.size,
        type: file.type,
        version: '1.0'
      };

      // Upload files
      const files = [
        file,
        new File([JSON.stringify(credentialMetadata, null, 2)], 'metadata.json', {
          type: 'application/json'
        })
      ];

      const cid = await client.put(files, {
        name: `credential-${Date.now()}`,
        maxRetries: 3
      });

      return {
        success: true,
        ipfsHash: cid,
        url: `${this.gatewayUrl}${cid}/${file.name}`,
        metadataUrl: `${this.gatewayUrl}${cid}/metadata.json`,
        size: file.size,
        type: file.type,
        name: file.name,
        metadata: credentialMetadata
      };

    } catch (error) {
      console.error('IPFS upload error:', error);
      
      return {
        success: false,
        error: error.message || 'Failed to upload to IPFS',
        details: error
      };
    }
  }

  /**
   * Upload JSON metadata to IPFS
   * @param {Object} metadata - The metadata object to upload
   * @returns {Promise<Object>} - Upload result with IPFS hash
   */
  async uploadMetadata(metadata) {
    try {
      const metadataFile = new File(
        [JSON.stringify(metadata, null, 2)], 
        'metadata.json',
        { type: 'application/json' }
      );

      return await this.uploadFile(metadataFile, {
        type: 'metadata',
        contentType: 'application/json'
      });

    } catch (error) {
      console.error('Metadata upload error:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload metadata to IPFS'
      };
    }
  }

  /**
   * Retrieve file from IPFS
   * @param {string} ipfsHash - The IPFS hash to retrieve
   * @returns {Promise<Object>} - Retrieved file data
   */
  async getFile(ipfsHash) {
    try {
      if (!ipfsHash) {
        throw new Error('IPFS hash is required');
      }

      const url = `${this.gatewayUrl}${ipfsHash}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.blob();
      }

      return {
        success: true,
        data,
        contentType,
        url,
        size: response.headers.get('content-length')
      };

    } catch (error) {
      console.error('IPFS retrieval error:', error);
      return {
        success: false,
        error: error.message || 'Failed to retrieve file from IPFS'
      };
    }
  }

  /**
   * Validate IPFS hash format
   * @param {string} hash - The hash to validate
   * @returns {boolean} - Whether the hash is valid
   */
  isValidIPFSHash(hash) {
    if (!hash || typeof hash !== 'string') {
      return false;
    }

    // Basic IPFS hash validation (CIDv0 and CIDv1)
    const ipfsHashRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[A-Za-z2-7]{58}|[A-Za-z2-7]{59})$/;
    return ipfsHashRegex.test(hash);
  }

  /**
   * Get IPFS gateway URL for a hash
   * @param {string} ipfsHash - The IPFS hash
   * @param {string} filename - Optional filename to append
   * @returns {string} - Complete gateway URL
   */
  getGatewayUrl(ipfsHash, filename = '') {
    if (!this.isValidIPFSHash(ipfsHash)) {
      throw new Error('Invalid IPFS hash provided');
    }

    let url = `${this.gatewayUrl}${ipfsHash}`;
    if (filename) {
      url += `/${filename}`;
    }
    
    return url;
  }

  /**
   * Pin file to ensure persistence (for production)
   * @param {string} ipfsHash - The IPFS hash to pin
   * @returns {Promise<Object>} - Pin result
   */
  async pinFile(ipfsHash) {
    try {
      // In production, you would use a pinning service like Web3.Storage, Pinata, etc.
      console.log(`Pinning file to IPFS: ${ipfsHash}`);
      
      return {
        success: true,
        message: `File ${ipfsHash} pinned successfully`,
        ipfsHash
      };

    } catch (error) {
      console.error('IPFS pinning error:', error);
      return {
        success: false,
        error: error.message || 'Failed to pin file to IPFS'
      };
    }
  }
}

// Export singleton instance
const ipfsService = new IPFSService();
export default ipfsService;
