"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { CredentialCard } from "./CredentialCard";

interface Credential {
  tokenId: string;
  title: string;
  issuer: string;
  dateIssued: string;
  ipfsHash: string;
  holder: string;
  timestamp: string;
  isValid: boolean;
}

interface VerificationResult {
  isValid: boolean;
  credential?: Credential;
  verifiedAt: string;
}

export function CredentialVerifier() {
  const [credentialId, setCredentialId] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!credentialId.trim()) {
      setError("Please enter a credential ID");
      return;
    }

    setIsVerifying(true);
    setError("");
    setVerificationResult(null);

    try {
      const response = await fetch(`/api/verify/${credentialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setVerificationResult({
        isValid: data.data.isValid,
        credential: data.data.credential,
        verifiedAt: data.data.verifiedAt
      });

    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify credential');
      setVerificationResult({
        isValid: false,
        verifiedAt: new Date().toISOString()
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setCredentialId("");
    setVerificationResult(null);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Verification Form */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Credential</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="credentialId" className="block text-sm font-medium text-gray-700 mb-2">
              Credential ID or Token ID
            </label>
            <input
              type="text"
              id="credentialId"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="Enter credential ID (e.g., 123)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isVerifying}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleVerify}
              disabled={isVerifying || !credentialId.trim()}
              isLoading={isVerifying}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isVerifying ? "Verifying..." : "Verify Credential"}
            </Button>
            
            {verificationResult && (
              <Button
                onClick={handleReset}
                className="bg-gray-600 hover:bg-gray-700 w-auto max-w-none px-6"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className="space-y-4">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${
            verificationResult.isValid
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                verificationResult.isValid
                  ? 'bg-green-500'
                  : 'bg-red-500'
              }`}>
                {verificationResult.isValid ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <div className="ml-3">
                <h3 className={`text-lg font-medium ${
                  verificationResult.isValid
                    ? 'text-green-800'
                    : 'text-red-800'
                }`}>
                  {verificationResult.isValid
                    ? 'Credential Verified ✓'
                    : 'Credential Not Valid ✗'
                  }
                </h3>
                <p className={`text-sm ${
                  verificationResult.isValid
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {verificationResult.isValid
                    ? 'This credential is authentic and has not been revoked.'
                    : 'This credential was not found or has been revoked.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Credential Details */}
          {verificationResult.isValid && verificationResult.credential && (
            <CredentialCard
              credential={verificationResult.credential}
            />
          )}

          {/* Verification Metadata */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Verification Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Verified At:</span>
                <span>{new Date(verificationResult.verifiedAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Credential ID:</span>
                <span className="font-mono">#{credentialId}</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span>Base {process.env.NODE_ENV === 'production' ? 'Mainnet' : 'Sepolia'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Verification Works</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Each credential is stored as a Soulbound Token on the Base blockchain</p>
          <p>• Verification checks if the token exists and hasn't been revoked</p>
          <p>• All credential data is cryptographically secured and immutable</p>
          <p>• Supporting documents are stored on IPFS for decentralized access</p>
        </div>
      </div>
    </div>
  );
}
