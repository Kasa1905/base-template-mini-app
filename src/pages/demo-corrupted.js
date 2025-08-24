import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function DemoCorruptedPage() {
  return (
    <>
      <Head>
        <title>Demo - Corrupted Credential | ProofVault</title>
        <meta name="description" content="Example of a corrupted credential verification" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🚫 Corrupted Credential Demo
            </h1>
            <p className="text-gray-300 text-lg">
              This demonstrates what happens when someone tries to verify a tampered credential.
            </p>
          </div>

          <div className="bg-red-900/40 backdrop-blur-sm p-8 rounded-2xl border border-red-500/50 mb-8">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-300 mb-4">Verification Failed</h2>
              <p className="text-red-200 mb-6">
                This credential has been tampered with and cannot be verified.
                The blockchain hash does not match the credential data.
              </p>
              <div className="bg-red-800/50 p-4 rounded-lg">
                <p className="text-red-100 text-sm font-mono">
                  Error: Hash mismatch detected<br/>
                  Expected: 0x1a2b3c4d5e6f...<br/>
                  Received: 0x9z8y7x6w5v4u...<br/>
                  Status: INVALID
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button variant="primary" className="px-8 py-3">
                  View Valid Demo
                </Button>
              </Link>
              <Link href="/">
                <Button variant="secondary" className="px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}