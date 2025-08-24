import Head from 'next/head';

export default function Layout({ children, title = 'ProofVault - Decentralized Credential Platform' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="ProofVault - Secure, decentralized credential verification on Base blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://proofvault.xyz/" />
        <meta property="og:title" content="ProofVault - Decentralized Credential Platform" />
        <meta property="og:description" content="Secure, verifiable credentials on the blockchain. Mint, verify, and share your achievements with confidence." />
        <meta property="og:image" content="/icon.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://proofvault.xyz/" />
        <meta property="twitter:title" content="ProofVault - Decentralized Credential Platform" />
        <meta property="twitter:description" content="Secure, verifiable credentials on the blockchain. Mint, verify, and share your achievements with confidence." />
        <meta property="twitter:image" content="/icon.png" />

        {/* Farcaster Frame Meta Tags (will be overridden by specific pages) */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="/icon.png" />
        <meta name="fc:frame:button:1" content="Explore ProofVault" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://proofvault.xyz/" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  );
}
