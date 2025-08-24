import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Button } from './Button';

interface QRCodeGeneratorProps {
  data: {
    tokenId: string;
    title: string;
    issuer: string;
    holder: string;
    dateIssued: string;
    ipfsHash?: string;
  };
  onClose?: () => void;
}

export function QRCodeGenerator({ data, onClose }: QRCodeGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Create verification URL with credential data
  const verificationUrl = `${window.location.origin}/verify?token=${data.tokenId}&hash=${data.ipfsHash}`;
  
  // Create offline data payload
  const offlineData = {
    credential: {
      tokenId: data.tokenId,
      title: data.title,
      issuer: data.issuer,
      holder: data.holder,
      dateIssued: data.dateIssued,
      ipfsHash: data.ipfsHash,
    },
    verificationUrl,
    timestamp: new Date().toISOString(),
    type: 'ProofVault-Certificate'
  };

  const qrData = JSON.stringify(offlineData);

  const downloadQR = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 512;
      canvas.height = 700;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ProofVault Certificate', canvas.width / 2, 40);

      // Certificate details
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      const details = [
        `Title: ${data.title}`,
        `Issuer: ${data.issuer}`,
        `Holder: ${data.holder}`,
        `Date: ${new Date(data.dateIssued).toLocaleDateString()}`,
        `Token ID: ${data.tokenId}`
      ];

      details.forEach((detail, index) => {
        ctx.fillText(detail, 20, 80 + (index * 25));
      });

      // Get QR code as SVG and convert to image
      const qrElement = qrRef.current?.querySelector('svg');
      if (qrElement) {
        const svgData = new XMLSerializer().serializeToString(qrElement);
        const img = new Image();
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          // Draw QR code
          ctx.drawImage(img, (canvas.width - 300) / 2, 220, 300, 300);

          // Instructions
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Scan to verify certificate offline', canvas.width / 2, 560);
          ctx.fillText('or visit: ' + verificationUrl.substring(0, 40) + '...', canvas.width / 2, 580);

          // Download
          const link = document.createElement('a');
          link.download = `ProofVault-${data.tokenId}-QR.png`;
          link.href = canvas.toDataURL();
          link.click();

          URL.revokeObjectURL(url);
        };
        img.src = url;
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyData = () => {
    navigator.clipboard.writeText(qrData);
    alert('Certificate data copied to clipboard!');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    alert('Verification URL copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Certificate QR Code</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Certificate Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{data.title}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Issuer:</strong> {data.issuer}</p>
              <p><strong>Holder:</strong> {data.holder}</p>
              <p><strong>Date:</strong> {new Date(data.dateIssued).toLocaleDateString()}</p>
              <p><strong>Token ID:</strong> {data.tokenId}</p>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex justify-center bg-white p-4 rounded-lg border" ref={qrRef}>
            <QRCode
              value={qrData}
              size={200}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">How to use this QR code:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Scan with any QR code reader to view certificate data</li>
              <li>• Contains complete credential information for offline verification</li>
              <li>• Includes verification URL for online checking</li>
              <li>• Safe to print or save for document archival</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={downloadQR}
              disabled={isGenerating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? 'Generating...' : 'Download QR Code Image'}
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={copyData}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Copy Data
              </Button>
              <Button
                onClick={copyUrl}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Copy URL
              </Button>
            </div>
          </div>

          {/* Verification URL */}
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600 mb-1">Verification URL:</p>
            <code className="text-xs bg-white p-2 rounded border block break-all">
              {verificationUrl}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
