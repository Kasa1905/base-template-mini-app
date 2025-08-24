"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { QRCodeGenerator } from "./ui/QRCodeGenerator";

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

interface CredentialCardProps {
  credential: Credential;
  onShare?: (credentialId: string) => void;
  onVerify?: (credentialId: string) => void;
}

export function CredentialCard({ credential, onShare, onVerify }: CredentialCardProps) {
  const [showQR, setShowQR] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!onShare) return;
    
    setSharing(true);
    try {
      await onShare(credential.tokenId);
    } catch (error) {
      console.error('Share error:', error);
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {credential.title}
          </h3>
          <p className="text-sm text-gray-600">
            Issued by <span className="font-medium">{credential.issuer}</span>
          </p>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          credential.isValid 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {credential.isValid ? '✓ Valid' : '✗ Revoked'}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Token ID:</span>
          <span className="font-mono text-gray-900">#{credential.tokenId}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Date Issued:</span>
          <span className="text-gray-900">{credential.dateIssued}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Holder:</span>
          <span className="font-mono text-gray-900">
            {credential.holder.slice(0, 6)}...{credential.holder.slice(-4)}
          </span>
        </div>
        
        {credential.ipfsHash && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">IPFS:</span>
            <button
              onClick={() => copyToClipboard(credential.ipfsHash)}
              className="font-mono text-blue-600 hover:text-blue-800 cursor-pointer"
              title="Click to copy IPFS hash"
            >
              {credential.ipfsHash.slice(0, 8)}...
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 bg-gray-600 hover:bg-gray-700"
        >
          {showQR ? 'Hide QR' : 'Show QR'}
        </Button>
        
        {onVerify && (
          <Button
            onClick={() => onVerify(credential.tokenId)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Verify
          </Button>
        )}
        
        {onShare && credential.isValid && (
          <Button
            onClick={handleShare}
            disabled={sharing}
            isLoading={sharing}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {sharing ? 'Sharing...' : 'Share'}
          </Button>
        )}
      </div>

      {/* Timestamp */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Minted on {new Date(parseInt(credential.timestamp) * 1000).toLocaleDateString()}
        </p>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <QRCodeGenerator
          data={{
            tokenId: credential.tokenId,
            title: credential.title,
            issuer: credential.issuer,
            holder: credential.holder,
            dateIssued: credential.dateIssued,
            ipfsHash: credential.ipfsHash,
          }}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
