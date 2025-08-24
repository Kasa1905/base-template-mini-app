import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useWallet } from '../hooks/useWallet';
import { WalletConnect } from '../components/WalletConnect';
import CredentialCard from '../components/CredentialCard.tsx';

export default function ProfilePage() {
  const { isConnected, address } = useWallet();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserCredentials();
    }
  }, [isConnected, address]);

  const fetchUserCredentials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/credentials/${address}`);
      const data = await response.json();
      
      if (data.success) {
        setCredentials(data.credentials || []);
      }
    } catch (error) {
      console.error('Error fetching credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareOnFarcaster = async (credential) => {
    try {
      setSharing(true);
      
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tokenId: credential.tokenId,
          walletAddress: address,
          platform: 'farcaster'
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Open Farcaster composer or copy link
        const shareText = result.data.shareContent.text;
        const shareUrl = result.data.shareUrl;
        
        // Try to copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        alert('Share content copied to clipboard! You can now paste it on Farcaster.');
      } else {
        alert('Failed to generate share link');
      }
    } catch (error) {
      console.error('Share error:', error);
      alert('Error sharing credential');
    } finally {
      setSharing(false);
    }
  };

  if (!isConnected) {
    return (
      <>
        <Head>
          <title>Profile - ProofVault</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link href="/" className="flex justify-center">
              <h1 className="text-3xl font-bold text-indigo-600">ProofVault</h1>
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connect Your Wallet
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connect your Base wallet to view your profile and credentials
            </p>
          </div>
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <WalletConnect />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Profile - ProofVault</title>
        <meta name="description" content="Your ProofVault profile and credentials" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-indigo-600">
                  ProofVault
                </Link>
                <div className="hidden md:block ml-10">
                  <div className="flex items-baseline space-x-4">
                    <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link href="/mint" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Mint Credential
                    </Link>
                    <Link href="/verify" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                      Verify
                    </Link>
                    <Link href="/profile" className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <WalletConnect />
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Profile Header */}
            <div className="bg-white shadow sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5">
                    <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
                    <p className="text-sm text-gray-500">
                      Wallet: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Network: Base Sepolia
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Credentials
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {credentials.length}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Verified
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              {credentials.filter(c => c.isValid).length}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Network
                            </dt>
                            <dd className="text-lg font-medium text-gray-900">
                              Base
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white shadow sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/mint"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Mint New Credential
                  </Link>
                  <Link
                    href="/verify"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verify Credential
                  </Link>
                  <button
                    onClick={() => {
                      const profileUrl = `${window.location.origin}/profile`;
                      navigator.clipboard.writeText(profileUrl);
                      alert('Profile link copied to clipboard!');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Credentials Section */}
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    My Credentials
                  </h3>
                  <button
                    onClick={fetchUserCredentials}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading credentials...</p>
                  </div>
                ) : credentials.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">No credentials yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Start building your credential portfolio by minting your first credential
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/mint"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {credentials.map((credential) => (
                      <div key={credential.tokenId} className="relative">
                        <CredentialCard 
                          credential={credential}
                          onRefresh={fetchUserCredentials}
                        />
                        
                        {/* Share Button */}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => shareOnFarcaster(credential)}
                            disabled={sharing}
                            className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                            title="Share on Farcaster"
                          >
                            <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
