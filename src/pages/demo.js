import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import { useTheme } from '../context/ThemeContext';

// Sample credential data for demonstration
const sampleCredentials = [
  {
    tokenId: "1",
    title: "Computer Science Degree",
    issuer: "MIT",
    recipient: "John Smith",
    dateIssued: "2024-08-15",
    description: "Bachelor of Science in Computer Science",
    verified: true,
    type: "education"
  },
  {
    tokenId: "2", 
    title: "AWS Cloud Certification",
    issuer: "Amazon Web Services",
    recipient: "Sarah Johnson",
    dateIssued: "2024-08-20",
    description: "AWS Solutions Architect Associate",
    verified: true,
    type: "professional"
  },
  {
    tokenId: "3",
    title: "Blockchain Developer Certificate",
    issuer: "ConsenSys Academy", 
    recipient: "Mike Chen",
    dateIssued: "2024-07-10",
    description: "Professional Blockchain Development Course",
    verified: false,
    type: "skill"
  }
];

// Educational tooltips for users
const educationalTips = {
  share: "Sharing creates a secure link that anyone can use to verify this credential without needing special software.",
  qr: "QR codes work offline! Someone can scan this even without internet and verify the credential later.",
  verify: "Verification checks if this credential is real and hasn't been tampered with. It's like checking if money is real.",
  blockchain: "This credential is stored on blockchain - think of it like a permanent, tamper-proof digital filing cabinet."
};

// Simple Credential Card Component
function SimpleCredentialCard({ credential, onAction, theme }) {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'education': return '🎓';
      case 'professional': return '💼';
      case 'skill': return '⚡';
      default: return '📜';
    }
  };

  return (
    <div className={`${theme.bgSecondary} p-6 rounded-lg shadow ${theme.border} border hover:shadow-lg transition-all duration-200`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{getTypeIcon(credential.type)}</span>
            <h3 className={`text-lg font-semibold ${theme.text}`}>{credential.title}</h3>
          </div>
          <p className={`${theme.textSecondary} text-sm`}>Issued by {credential.issuer}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded ${
          credential.verified 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {credential.verified ? 'Verified ✅' : 'Pending ⏳'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className={`${theme.textSecondary} text-sm`}>
          <strong>Recipient:</strong> {credential.recipient}
        </p>
        <p className={`${theme.textSecondary} text-sm`}>
          <strong>Date:</strong> {new Date(credential.dateIssued).toLocaleDateString()}
        </p>
        <p className={`${theme.textSecondary} text-sm`}>
          <strong>Description:</strong> {credential.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => onAction('share', credential)}
          className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          title={educationalTips.share}
        >
          📤 Share
        </Button>
        <Button
          onClick={() => onAction('qr', credential)}
          className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          title={educationalTips.qr}
        >
          📱 QR Code
        </Button>
        <Button
          onClick={() => onAction('verify', credential)}
          className="text-xs px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          title={educationalTips.verify}
        >
          ✅ Verify
        </Button>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const { theme } = useTheme();
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentTip, setCurrentTip] = useState('');

  const handleAction = (action, credential) => {
    setSelectedCredential(credential);
    
    switch(action) {
      case 'share':
        setCurrentTip('💡 In real life, this would create a secure shareable link!');
        if (navigator.share) {
          navigator.share({
            title: `${credential.title} Certificate`,
            text: `Check out this verified credential: ${credential.title} from ${credential.issuer}`,
            url: `${window.location.origin}/verify?token=${credential.tokenId}`
          });
        } else {
          navigator.clipboard.writeText(`${window.location.origin}/verify?token=${credential.tokenId}`);
          alert('🔗 Share link copied to clipboard!');
        }
        break;
        
      case 'qr':
        setCurrentTip('💡 QR codes work offline and can be scanned with any phone camera!');
        setShowQRModal(true);
        break;
        
      case 'verify':
        setCurrentTip('💡 Verification checks if the credential is authentic and unmodified!');
        // Simulate verification process
        setTimeout(() => {
          alert(`✅ Verification Result: This ${credential.title} from ${credential.issuer} is ${credential.verified ? 'AUTHENTIC' : 'PENDING VERIFICATION'}`);
        }, 1000);
        break;
    }
  };

  return (
    <>
      <Head>
        <title>Demo - ProofVault</title>
        <meta name="description" content="See how digital credentials work with real examples" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen ${theme.bg} transition-all duration-300`}>
        {/* Navigation */}
        <nav className={`${theme.bgSecondary} shadow ${theme.border} border-b`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className={`text-2xl font-bold ${theme.accent.replace('bg-', 'text-')}`}>
                  ProofVault
                </Link>
                <span className={`ml-2 px-2 py-1 text-xs ${theme.accent} text-white rounded`}>
                  DEMO
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/"
                  className={`${theme.textSecondary} hover:${theme.text.replace('text-', '')} px-3 py-2 text-sm font-medium transition-colors`}
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold ${theme.text} mb-4`}>
              See Digital Credentials in Action! 🚀
            </h1>
            <p className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto mb-6`}>
              Here are some sample credentials. Try the buttons to see how sharing, QR codes, and verification work.
            </p>
            
            {/* Educational Tip Display */}
            {currentTip && (
              <div className={`${theme.accent.replace('bg-', 'bg-').replace('600', '100')} ${theme.accent.replace('bg-', 'text-').replace('600', '700')} p-4 rounded-lg mb-6 mx-auto max-w-2xl`}>
                <p className="text-sm font-medium">{currentTip}</p>
              </div>
            )}

            {/* Quick Guide */}
            <div className={`${theme.bgSecondary} p-6 rounded-lg mb-8 text-left max-w-4xl mx-auto`}>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>
                🎯 Quick Guide: What You Can Do Here
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h4 className={`font-medium ${theme.text} flex items-center gap-2`}>
                    📤 Share Button
                  </h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Creates a secure link that anyone can use to verify the credential. Like sending a photo, but tamper-proof!
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className={`font-medium ${theme.text} flex items-center gap-2`}>
                    📱 QR Code Button
                  </h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Generates a QR code that works offline. Perfect for showing credentials in person or on printed materials.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className={`font-medium ${theme.text} flex items-center gap-2`}>
                    ✅ Verify Button
                  </h4>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    Checks if the credential is authentic and hasn't been faked. Instant verification, no phone calls needed!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Credentials */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {sampleCredentials.map((credential) => (
              <SimpleCredentialCard
                key={credential.tokenId}
                credential={credential}
                onAction={handleAction}
                theme={theme}
              />
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className={`${theme.bgSecondary} p-8 rounded-lg max-w-2xl mx-auto`}>
              <h3 className={`text-2xl font-bold ${theme.text} mb-4`}>
                Ready to Create Your Own? 🎉
              </h3>
              <p className={`${theme.textSecondary} mb-6`}>
                Now that you've seen how it works, create your first credential in just a few clicks!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/mint"
                  className={`${theme.accent} text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-200 text-center`}
                >
                  🚀 Create Credential
                </Link>
                <Link
                  href="/verify"
                  className={`${theme.bgSecondary} ${theme.text} px-6 py-3 rounded-lg font-medium ${theme.border} border hover:${theme.border.replace('border-', 'border-')} transition-all duration-200 text-center`}
                >
                  🔍 Verify Existing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {showQRModal && selectedCredential && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`${theme.bg} rounded-lg p-6 max-w-md w-full`}>
              <div className="text-center">
                <h3 className={`text-xl font-bold ${theme.text} mb-4`}>
                  QR Code for {selectedCredential.title}
                </h3>
                
                {/* Placeholder QR Code */}
                <div className="bg-white p-4 rounded-lg mx-auto mb-4 w-48 h-48 flex items-center justify-center">
                  <div className="text-4xl">📱</div>
                </div>
                
                <p className={`text-sm ${theme.textSecondary} mb-4`}>
                  Anyone can scan this QR code to verify this credential instantly!
                </p>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => alert('📥 QR code downloaded!')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    📥 Download
                  </Button>
                  <Button
                    onClick={() => setShowQRModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Close
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
