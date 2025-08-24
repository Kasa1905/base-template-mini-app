# ProofVault - Simple Credential Verification 🎓

![ProofVault](https://img.shields.io/badge/ProofVault-Simple%20%26%20Secure-green?style=for-the-badge&logo=shield)

**The easiest way to create, verify, and share digital credentials on blockchain!**

No crypto knowledge required. Just click, create, and share.

## 🚀 Quick Start (30 seconds)

1. **Try the Demo**: Visit [localhost:3000/demo](http://localhost:3000/demo)
2. **Start Development**: `npm run dev`
3. **Create Credential**: Click "Mint New Credential"
4. **Share & Verify**: Use QR codes or direct links

## ✨ What Makes ProofVault Special?

- **🎯 1-Click Setup**: No wallet needed to start
- **📱 QR Code Sharing**: Offline verification anywhere
- **🔒 Blockchain Security**: Tamper-proof credentials
- **🎨 Beautiful Themes**: Customize your experience
- **⚡ Instant Verification**: Real-time credential checking

## 📋 Features Overview

### Core Features
- ✅ Create digital certificates
- ✅ Verify credential authenticity  
- ✅ Share via QR codes or links
- ✅ Blockchain-backed security
- ✅ Theme customization
- ✅ Offline verification support

### Technical Features
- ✅ Next.js with TypeScript
- ✅ Base blockchain integration
- ✅ IPFS decentralized storage
- ✅ Responsive design
- ✅ Service worker for offline use
- ✅ PWA-ready

## 🎮 How to Use (Examples)

### Example 1: University Degree
```javascript
// Sample credential data
{
  title: "Computer Science Degree",
  issuer: "MIT University", 
  recipient: "0x1234...5678",
  dateIssued: "2024-05-15",
  description: "Bachelor of Science in Computer Science"
}
```

### Example 2: Professional Certificate
```javascript
{
  title: "AWS Cloud Certification",
  issuer: "Amazon Web Services",
  recipient: "0x1234...5678", 
  dateIssued: "2024-08-20",
  description: "AWS Solutions Architect Associate"
}
```

### Example 3: Training Completion
```javascript
{
  title: "Blockchain Developer Certificate",
  issuer: "ConsenSys Academy",
  recipient: "0x1234...5678",
  dateIssued: "2024-07-10", 
  description: "Professional Blockchain Development Course"
}
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI elements
│   ├── CredentialCard.tsx
│   └── WalletConnect.js
├── pages/              # Next.js pages
│   ├── index.js        # Homepage
│   ├── demo.js         # Interactive demo
│   ├── mint.js         # Create credentials
│   ├── verify.js       # Verify credentials
│   └── dashboard.js    # User dashboard
├── services/           # External integrations
└── styles/            # Global styles
```

## 📖 Usage Guide

### 1. Creating Your First Credential

1. Go to [localhost:3000/mint](http://localhost:3000/mint)
2. Fill in the credential details:
   - **Title**: Certificate name
   - **Issuer**: Organization issuing the credential
   - **Recipient**: Wallet address or email
   - **Description**: Additional details
3. Click "Create Credential"
4. Share the generated QR code or link

### 2. Verifying a Credential

1. Go to [localhost:3000/verify](http://localhost:3000/verify)
2. Enter the Token ID or scan QR code
3. View verification results instantly
4. Check blockchain proof

### 3. Managing Credentials

1. Visit [localhost:3000/dashboard](http://localhost:3000/dashboard)
2. Connect your wallet (optional)
3. View all your credentials
4. Share, verify, or download QR codes

## 🎨 Customization

### Themes
Choose from multiple color themes:
- Default (Blue)
- Green
- Purple  
- Orange
- Dark mode

### Environment Variables
Create a `.env.local` file:
```env
# Base Network Configuration
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_RPC_URL=https://mainnet.base.org

# IPFS Configuration  
NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token_here

# Farcaster Integration
NEXT_PUBLIC_NEYNAR_API_KEY=your_key_here
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Utility
npm run cleanup      # Kill processes on port 3000
npm run lint         # Check code quality
```

## 📱 Mobile & PWA Support

ProofVault works perfectly on mobile devices:
- Responsive design for all screen sizes
- QR code scanning via camera
- Offline credential verification
- Add to home screen support

## 🔒 Security Features

- **Blockchain Verification**: All credentials stored on Base blockchain
- **IPFS Storage**: Decentralized proof storage
- **Tamper Protection**: Immutable credential records
- **Wallet Integration**: Secure user authentication
- **QR Code Security**: Cryptographically signed QR codes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Demo**: [localhost:3000/demo](http://localhost:3000/demo)
- **Documentation**: [localhost:3000](http://localhost:3000)
- **Issue Tracker**: GitHub Issues

## 💡 Need Help?

- 📚 Check the [demo page](http://localhost:3000/demo) for examples
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

---

**Built with ❤️ for secure, simple credential verification**
