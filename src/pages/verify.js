import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { WalletConnect } from '../components/WalletConnect';

export default function VerifyPage() {
  const [tokenId, setTokenId] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [credential, setCredential] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!tokenId.trim()) {
      setError('Please enter a token ID');
      return;
    }

    setLoading(true);
    setError('');
    setCredential(null);
    setVerified(false);

    try {
      const params = new URLSearchParams();
      params.append('tokenId', tokenId.trim());
      if (walletAddress.trim()) {
        params.append('walletAddress', walletAddress.trim());
      }

      const response = await fetch(`/api/verify?${params}`);
      const result = await response.json();

      if (result.success && result.isValid) {
        setCredential(result.data);
        setVerified(true);
      } else if (result.success && !result.isValid) {
        setError(result.message || 'Credential is not valid or has been revoked');
      } else {
        setError(result.error || 'Credential not found');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTokenId('');
    setWalletAddress('');
    setCredential(null);
    setError('');
    setVerified(false);
  };

  const generateQRCode = () => {
    const verificationUrl = `${window.location.origin}/verify?tokenId=${tokenId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;
  };

  return (
    <>
      <Head>
        <title>Verify Credential - ProofVault</title>
        <meta name="description" content="Verify credentials on the blockchain" />
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
                    <Link href="/verify" className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                      Verify
                    </Link>
                    <Link href="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
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
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Verify Credential</h1>
              <p className="mt-2 text-lg text-gray-600">
                Enter a token ID to verify credential authenticity on the blockchain
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Verification Form */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Credential Verification
                  </h3>
                  
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                      <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700">
                        Token ID *
                      </label>
                      <input
                        type="text"
                        name="tokenId"
                        id="tokenId"
                        required
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        placeholder="Enter token ID (e.g., 123)"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-700">
                        Wallet Address (Optional)
                      </label>
                      <input
                        type="text"
                        name="walletAddress"
                        id="walletAddress"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        placeholder="0x... (optional verification)"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Optional: Verify that the credential belongs to this specific wallet
                      </p>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Verifying...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verify Credential
                          </>
                        )}
                      </button>
                      
                      {(credential || error) && (
                        <button
                          type="button"
                          onClick={handleReset}
                          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    QR Code Verification
                  </h3>
                  
                  {tokenId ? (
                    <div className="text-center">
                      <div className="bg-gray-50 p-4 rounded-lg inline-block">
                        <img 
                          src={generateQRCode()}
                          alt="QR Code for verification"
                          className="mx-auto"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Scan this QR code to verify token #{tokenId}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="mt-2 text-sm">Enter a token ID to generate QR code</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Verification Result */}
            {verified && credential && (
              <div className="mt-8 bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-800">
                        ✅ Credential Verified Successfully
                      </h3>
                      <p className="text-sm text-green-600">
                        This credential is authentic and valid on the blockchain
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Credential Details</h4>
                        <dl className="mt-3 space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Title</dt>
                            <dd className="text-sm text-gray-700">{credential.title}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Issuer</dt>
                            <dd className="text-sm text-gray-700">{credential.issuer}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Date Issued</dt>
                            <dd className="text-sm text-gray-700">{credential.dateIssued}</dd>
                          </div>
                        </dl>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Blockchain Details</h4>
                        <dl className="mt-3 space-y-3">
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Token ID</dt>
                            <dd className="text-sm text-gray-700 font-mono">{credential.tokenId}</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Holder</dt>
                            <dd className="text-sm text-gray-700 font-mono break-all">
                              {credential.holder.slice(0, 6)}...{credential.holder.slice(-4)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-900">Timestamp</dt>
                            <dd className="text-sm text-gray-700">
                              {new Date(parseInt(credential.timestamp) * 1000).toLocaleString()}
                            </dd>
                          </div>
                          {credential.ipfsHash && (
                            <div>
                              <dt className="text-sm font-medium text-gray-900">IPFS Hash</dt>
                              <dd className="text-sm text-gray-700 font-mono break-all">{credential.ipfsHash}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          const shareUrl = `${window.location.origin}/verify?tokenId=${credential.tokenId}`;
                          navigator.clipboard.writeText(shareUrl);
                          alert('Verification link copied to clipboard!');
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy Verification Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
