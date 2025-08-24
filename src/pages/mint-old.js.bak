import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/ui/ThemeSelector';

export default function MintPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    credentialType: '',
    recipientName: '',
    recipientEmail: '',
    organizationName: '',
    achievementTitle: '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
    skills: []
  });
  const [loading, setLoading] = useState(false);

  const credentialTypes = [
    { 
      id: 'education', 
      name: 'Educational Certificate', 
      description: 'Diplomas, degrees, course completions',
      icon: '🎓',
      examples: 'Bachelor\'s Degree, Certificate of Completion, Training Course'
    },
    { 
      id: 'professional', 
      name: 'Professional Certification', 
      description: 'Industry certifications, licenses',
      icon: '💼',
      examples: 'AWS Certification, PMP License, Driver\'s License'
    },
    { 
      id: 'achievement', 
      name: 'Achievement Award', 
      description: 'Awards, recognitions, competitions',
      icon: '🏆',
      examples: 'Employee of the Month, Competition Winner, Volunteer Award'
    },
    { 
      id: 'skill', 
      name: 'Skill Verification', 
      description: 'Technical skills, competencies',
      icon: '⚡',
      examples: 'Programming Skills, Language Proficiency, Tool Expertise'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTypeSelect = (type) => {
    setFormData({
      ...formData,
      credentialType: type
    });
    setCurrentStep(2);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate credential creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, just show success and redirect to demo
      alert('🎉 Credential created successfully! You can see it in the demo page.');
      router.push('/demo');
    } catch (error) {
      alert('Error creating credential. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setProofFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!formData.title || !formData.issuer || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const mintData = new FormData();
      mintData.append('title', formData.title);
      mintData.append('issuer', formData.issuer);
      mintData.append('date', formData.date);
      mintData.append('description', formData.description);
      mintData.append('walletAddress', address);
      
      if (proofFile) {
        mintData.append('proofFile', proofFile);
      }

      // Call mint API
      const response = await fetch('/api/mint', {
        method: 'POST',
        body: mintData,
      });

      const result = await response.json();

      if (result.success) {
        setTxHash(result.transactionHash);
        setIpfsHash(result.ipfsHash);
        
        // Reset form
        setFormData({ title: '', issuer: '', date: '', description: '' });
        setProofFile(null);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setError(result.error || 'Failed to mint credential');
      }
    } catch (err) {
      console.error('Mint error:', err);
      setError('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <>
        <Head>
          <title>Mint Credential - ProofVault</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link href="/" className="flex justify-center">
              <h1 className="text-3xl font-bold text-indigo-600">ProofVault</h1>
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connect Wallet to Mint
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              You need to connect your Base wallet to mint credentials
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

  // Show success state
  if (txHash) {
    return (
      <>
        <Head>
          <title>Credential Minted Successfully - ProofVault</title>
        </Head>
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Credential Minted Successfully!</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your credential has been minted as a Soulbound token on Base blockchain
                </p>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-gray-50 px-4 py-3 rounded-md">
                    <p className="text-xs text-gray-500">Transaction Hash:</p>
                    <p className="text-sm font-mono text-gray-900 break-all">{txHash}</p>
                  </div>
                  
                  {ipfsHash && (
                    <div className="bg-gray-50 px-4 py-3 rounded-md">
                      <p className="text-xs text-gray-500">IPFS Hash:</p>
                      <p className="text-sm font-mono text-gray-900 break-all">{ipfsHash}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    href="/dashboard"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View in Dashboard
                  </Link>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Mint Another
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Redirecting to dashboard in 3 seconds...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Mint Credential - ProofVault</title>
        <meta name="description" content="Mint your credential as a Soulbound token" />
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
                    <Link href="/mint" className="bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium">
                      Mint Credential
                    </Link>
                    <Link href="/verify" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
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
        <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mint New Credential</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Credential Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Bachelor of Computer Science"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">
                      Issuing Institution *
                    </label>
                    <input
                      type="text"
                      name="issuer"
                      id="issuer"
                      required
                      value={formData.issuer}
                      onChange={handleInputChange}
                      placeholder="e.g., MIT, Google, Coursera"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date Issued *
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      required
                      value={formData.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Optional: Add details about the credential"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="proof" className="block text-sm font-medium text-gray-700">
                      Proof Document
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="proof" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input
                              id="proof"
                              name="proof"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, PNG, JPG, DOC up to 5MB
                        </p>
                        {proofFile && (
                          <p className="text-sm text-green-600">
                            Selected: {proofFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end space-x-3">
                      <Link
                        href="/dashboard"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={loading}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Minting...
                          </>
                        ) : (
                          'Mint Credential'
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
