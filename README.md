# ProofVault - Decentralized Credential Verification on Base

![ProofVault Banner](https://img.shields.io/badge/ProofVault-Base%20Miniapp-blue?style=for-the-badge&logo=ethereum)

A decentralized credential verification system built on Base blockchain, featuring Soulbound tokens for immutable credentials, IPFS storage for proofs, and seamless Farcaster integration.

## 🌟 Features

- **🔐 Wallet Integration**: Connect Base wallets using OnchainKit
- **🎓 Credential Minting**: Mint NFT/Soulbound tokens for credentials
- **📁 IPFS Storage**: Store credential proofs on decentralized storage
- **📱 QR Verification**: Generate QR codes for instant verification
- **✅ Onchain Verification**: Verify credentials directly on blockchain
- **🚀 Farcaster Sharing**: Share verified credentials on Farcaster
- **⚡ Real-time Updates**: Live notifications for credential events

## 🏗️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS
- **Blockchain**: Base (Layer 2), Solidity, OnchainKit, Ethers.js
- **Storage**: IPFS (Web3.Storage, Pinata)
- **Social**: Farcaster, Neynar API
- **Backend**: Node.js, Express.js
- **Database**: Redis (caching), Optional MongoDB/PostgreSQL
- **Development**: Hardhat, TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- Metamask or compatible wallet
- Base Sepolia ETH for testing

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd base-template-mini-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Fill in your configuration in `.env.local`:

```bash
# Base Network Configuration
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_RPC_URL=https://sepolia.base.org

# Smart Contract (Deploy first, then add address)
NEXT_PUBLIC_PROOFVAULT_CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_deployer_private_key

# IPFS Configuration  
WEB3_STORAGE_TOKEN=your_web3_storage_token
PINATA_API_KEY=your_pinata_key

# Farcaster/Neynar
NEYNAR_API_KEY=your_neynar_key
NEYNAR_CLIENT_ID=your_client_id

# Redis (for notifications)
KV_REST_API_TOKEN=your_upstash_token
KV_REST_API_URL=your_upstash_url
```

### 4. Smart Contract Deployment

Deploy the ProofVault contract to Base Sepolia:

```bash
# Compile contracts
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.js --network baseSepolia

# Update .env.local with deployed contract address
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see ProofVault in action!

## 📋 API Endpoints

### Credentials
- `POST /api/credentials` - Mint new credential
- `GET /api/credentials` - Get all credentials (admin)
- `GET /api/credentials/[wallet]` - Get user credentials
- `DELETE /api/credentials/[wallet]` - Revoke credential

### Verification
- `POST /api/verify` - Verify credential
- `GET /api/verify?tokenId=123` - Quick verification

### Sharing
- `POST /api/share` - Generate share link
- `GET /api/share?tokenId=123` - Get shareable info

### Notifications
- `POST /api/send-notification` - Send notification
- `GET /api/send-notification?fid=123` - Get user notifications

### Webhooks
- `POST /api/webhook` - Handle Farcaster webhooks
- `GET /api/webhook` - Webhook verification
     ```
     ACCOUNT_ASSOCIATION_HEADER
     ACCOUNT_ASSOCIATION_PAYLOAD
     ACCOUNT_ASSOCIATION_SIGNATURE
     ```

3. Redeploy to update the build with new environment variables

## Authentication

### Making Authenticated Requests

1. Import the auth utilities:

```typescript
import { fetchWithAuth } from "~/lib/auth";
```

2. Use `fetchWithAuth` for API calls:

```typescript
// Example API call
const response = await fetchWithAuth("/api/protected-route");
const data = await response.json();
```

### Protected API Routes

1. Import the auth utilities:

```typescript
import { verifyAuth } from "~/lib/auth";
```

2. Verify authentication in your route:

```typescript
export async function GET(request: Request) {
  const auth = await verifyAuth(request);
  if (!auth) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Your protected route logic here
  return NextResponse.json({ fid: auth.fid });
}
```

## Learn More

- [MiniApps Documentation](https://miniapps.farcaster.xyz/)
- [Next.js Documentation](https://nextjs.org/docs)

## Guide

This is made using Neynar's StarterKit [this Neynar docs page](https://docs.neynar.com/docs/create-farcaster-miniapp-in-60s) for a simple guide on how to create a Farcaster Mini App in less than 60 seconds!

## Getting Started

To create a new mini app project, run:

Click on use this template.

To run the project:

```{bash}
cd <PROJECT_NAME>
npm run dev
```

## Building for Production

To create a production build, run:

```{bash}
npm run build
```

The above command will generate a `.env` file based on the `.env.local` file and user input. Be sure to configure those environment variables on your hosting platform.

## Building with AI

AI guide for FC Mini Apps SDK - https://miniapps.farcaster.xyz/docs/getting-started#building-with-ai

AI guide for Neynar - https://docs.neynar.com/docs/neynar-farcaster-with-cursor

## Why MiniApps?

Lets u open Apps inside social feed.
Leverage and build on social Data so add social component to make your app viral.
Send Notifications to retain the users.

Simple flow

- Build your simple App just like u bulid webapps
- Wrap it inside the NeynarProvider (FrameContext) to get the context of the user [username, fid, walletadd, pfp and with fid his entire social graph]
- Access the inbuilt Farcaster Wallet for any onchain activity
