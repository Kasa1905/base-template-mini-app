import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useWallet } from '../hooks/useWallet';
import { WalletConnect } from '../components/WalletConnect';
import CredentialCard from '../components/CredentialCard.tsx';

export default function Dashboard() {
  const { isConnected, address, connect, disconnect } = useWallet();
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <Head>
        <title>Dashboard - ProofVault</title>
        <meta name="description" content="Manage your credentials on ProofVault" />
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
                    <Link
                      href="/dashboard"
                      className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/mint"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Mint Credential
                    </Link>
                    <Link
                      href="/verify"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Verify
                    </Link>
                    <Link
                      href="/profile"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
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
            {!isConnected ? (
              /* Wallet Connection Required */
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center">
                  <svg className="h-12 w-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Connect Your Wallet</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Connect your Base wallet to view and manage your credentials
                </p>
                <div className="mt-6">
                  <WalletConnect />
                </div>
              </div>
            ) : (
              /* Connected Dashboard */
              <div>
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">My Credentials</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/mint"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Mint New Credential
                    </Link>
                    <Link
                      href="/verify"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verify Credential
                    </Link>
                  </div>
                </div>

                {/* Credentials List */}
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading credentials...</p>
                  </div>
                ) : credentials.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="mt-6 text-lg font-medium text-gray-900">No credentials yet</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Get started by minting your first credential as a Soulbound token
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/mint"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Mint Your First Credential
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Credentials Grid */
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {credentials.map((credential) => (
                      <CredentialCard 
                        key={credential.tokenId} 
                        credential={credential}
                        onRefresh={fetchUserCredentials}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
