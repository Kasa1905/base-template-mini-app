import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/ui/ThemeSelector';

// Sample credential data for demonstration
const sampleCredentials = [
  {
    tokenId: "1",
    title: "Computer Science Degree",
    issuer: "MIT University",
    recipient: "0x1234...5678",
    dateIssued: "2024-05-15",
    description: "Bachelor of Science in Computer Science",
    verified: true
  },
  {
    tokenId: "2", 
    title: "AWS Cloud Certification",
    issuer: "Amazon Web Services",
    recipient: "0x1234...5678",
    dateIssued: "2024-08-20",
    description: "AWS Solutions Architect Associate",
    verified: true
  },
  {
    tokenId: "3",
    title: "Blockchain Developer Certificate",
    issuer: "ConsenSys Academy", 
    recipient: "0x1234...5678",
    dateIssued: "2024-07-10",
    description: "Professional Blockchain Development Course",
    verified: false
  }
];

// Simple Credential Card Component
function SimpleCredentialCard({ credential, onAction }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{credential.title}</h3>
        <span className={`px-2 py-1 text-xs rounded ${
          credential.verified 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {credential.verified ? 'Verified ✅' : 'Pending ⏳'}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p><strong>Issuer:</strong> {credential.issuer}</p>
        <p><strong>Date:</strong> {credential.dateIssued}</p>
        <p><strong>Recipient:</strong> {credential.recipient}</p>
        <p><strong>Description:</strong> {credential.description}</p>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          onClick={() => onAction('share', credential)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Share
        </Button>
        <Button 
          onClick={() => onAction('qr', credential)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          QR Code
        </Button>
        <Button 
          onClick={() => onAction('verify', credential)}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm"
        >
          Verify
        </Button>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const handleAction = (action, credential) => {
    setSelectedCredential(credential);
    setModalType(action);
    
    if (action === 'share') {
      const shareUrl = `${window.location.origin}/verify?tokenId=${credential.tokenId}`;
      if (navigator.share) {
        navigator.share({
          title: `${credential.title} Certificate`,
          text: `Check out my ${credential.title} certificate from ${credential.issuer}`,
          url: shareUrl
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert('Share link copied to clipboard!');
      }
    } else if (action === 'verify') {
      alert(`Verifying credential: ${credential.title}\nStatus: ${credential.verified ? 'Verified ✅' : 'Pending ⏳'}`);
    } else if (action === 'qr') {
      setShowModal(true);
    }
  };

  return (
    <>
      <Head>
        <title>Demo - ProofVault</title>
        <meta name="description" content="See how ProofVault works with sample credentials" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                  ProofVault
                </Link>
                <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                  DEMO
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Demo Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              🎯 ProofVault Demo - How It Works
            </h2>
            <div className="text-blue-800 space-y-2">
              <p><strong>1. View Credentials:</strong> Browse sample digital certificates below</p>
              <p><strong>2. Share:</strong> Click "Share" to copy verification links</p>
              <p><strong>3. QR Codes:</strong> Generate QR codes for offline access</p>
              <p><strong>4. Themes:</strong> Try different color themes using the selector above</p>
              <p><strong>5. Verification:</strong> Check credential authenticity</p>
            </div>
          </div>

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl mb-2">🔐</div>
              <h3 className="font-semibold mb-2">Blockchain Security</h3>
              <p className="text-gray-600 text-sm">
                All credentials are stored on Base blockchain for immutable verification
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold mb-2">QR Code Access</h3>
              <p className="text-gray-600 text-sm">
                Generate QR codes for easy offline sharing and verification
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-2xl mb-2">🎨</div>
              <h3 className="font-semibold mb-2">Custom Themes</h3>
              <p className="text-gray-600 text-sm">
                Personalize your experience with multiple color themes
              </p>
            </div>
          </div>

          {/* Sample Credentials */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Sample Credentials ({sampleCredentials.length})
              </h2>
              <Link href="/mint">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Create Your Own
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleCredentials.map((credential) => (
                <SimpleCredentialCard
                  key={credential.tokenId}
                  credential={credential}
                  onAction={handleAction}
                />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Try These Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/mint">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  🏭 Mint New Credential
                </Button>
              </Link>
              <Link href="/verify">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  ✅ Verify Credential
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  📊 View Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  👤 User Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Simple QR Modal */}
        {showModal && selectedCredential && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">QR Code for {selectedCredential.title}</h3>
                <div className="bg-gray-100 p-8 rounded-lg mb-4">
                  <div className="text-6xl">📱</div>
                  <p className="text-sm text-gray-600 mt-2">
                    QR Code would appear here<br />
                    Token ID: {selectedCredential.tokenId}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      alert('QR code download would start here');
                      setShowModal(false);
                    }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
