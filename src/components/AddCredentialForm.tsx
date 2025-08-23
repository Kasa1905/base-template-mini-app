"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "./ui/Button";

interface AddCredentialFormProps {
  onSubmit: (data: CredentialData) => Promise<void>;
  isLoading?: boolean;
}

interface CredentialData {
  title: string;
  issuer: string;
  dateIssued: string;
  description: string;
  proofFile?: string;
}

export function AddCredentialForm({ onSubmit, isLoading = false }: AddCredentialFormProps) {
  const { address } = useAccount();
  const [formData, setFormData] = useState<CredentialData>({
    title: "",
    issuer: "",
    dateIssued: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({ ...prev, proofFile: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    
    if (!formData.issuer.trim()) {
      setError("Issuer is required");
      return;
    }
    
    if (!formData.dateIssued) {
      setError("Date issued is required");
      return;
    }

    if (!address) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      await onSubmit(formData);
      
      // Reset form on success
      setFormData({
        title: "",
        issuer: "",
        dateIssued: "",
        description: "",
      });
      
    } catch (err: any) {
      setError(err.message || "Failed to mint credential");
    }
  };

  if (!address) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p>Connect your wallet to mint credentials</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mint New Credential</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Credential Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Bachelor of Science in Computer Science"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Issuer */}
        <div>
          <label htmlFor="issuer" className="block text-sm font-medium text-gray-700 mb-2">
            Issuing Organization *
          </label>
          <input
            type="text"
            id="issuer"
            name="issuer"
            value={formData.issuer}
            onChange={handleInputChange}
            placeholder="e.g., University of California"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Date Issued */}
        <div>
          <label htmlFor="dateIssued" className="block text-sm font-medium text-gray-700 mb-2">
            Date Issued *
          </label>
          <input
            type="date"
            id="dateIssued"
            name="dateIssued"
            value={formData.dateIssued}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Additional details about the credential..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Proof Document (Optional)
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {formData.proofFile ? (
              <div className="text-green-600">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">File uploaded successfully</p>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, proofFile: undefined }))}
                  className="text-xs text-red-600 hover:text-red-800 mt-1"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm mb-2">Drag and drop a file here, or click to select</p>
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm underline"
                >
                  Choose file
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Max size: 10MB. Supported: PDF, images, documents
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Minting Credential..." : "Mint Credential"}
        </Button>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            This will mint a Soulbound Token on Base that cannot be transferred.
          </p>
        </div>
      </form>
    </div>
  );
}
