import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/ui/ThemeSelector';

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "🎯 Try the Demo",
      description: "See how ProofVault works with sample credentials",
      action: "View Demo",
      link: "/demo",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "🏭 Mint Credentials", 
      description: "Create your first digital certificate",
      action: "Start Minting",
      link: "/mint",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "✅ Verify Credentials",
      description: "Check if a credential is authentic",
      action: "Verify Now",
      link: "/verify", 
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "📊 Your Dashboard",
      description: "Manage all your credentials in one place",
      action: "Open Dashboard",
      link: "/dashboard",
      color: "bg-indigo-600 hover:bg-indigo-700"
    }
  ];

  return (
    <>
      <Head>
        <title>ProofVault - Simple Credential Verification</title>
        <meta name="description" content="The easiest way to create, verify, and share digital credentials on blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Simple Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-indigo-600">ProofVault</h1>
                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  SIMPLE & SECURE
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/demo"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Demo
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section - Simplified */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Digital Credentials Made <span className="text-indigo-600">Simple</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Create, verify, and share certificates on blockchain in just a few clicks. 
              No crypto knowledge required!
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-indigo-600">1-Click</div>
                <div className="text-gray-600">Credential Creation</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-gray-600">Blockchain Verified</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl font-bold text-purple-600">QR Code</div>
                <div className="text-gray-600">Instant Sharing</div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Guide */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Get Started in 4 Easy Steps</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    currentStep === index 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onMouseEnter={() => setCurrentStep(index)}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-3">{step.title}</div>
                    <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
                    <Link href={step.link}>
                      <Button className={`w-full ${step.color} text-white`}>
                        {step.action}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">🔒 Why ProofVault?</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Blockchain security without complexity
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  No wallet setup required to get started
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  QR codes for offline verification
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✅</span>
                  Share credentials instantly
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4">🚀 Perfect For</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">🎓</span>
                  Universities & Schools
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">🏢</span>
                  Companies & Organizations  
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">📜</span>
                  Certification Bodies
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">💼</span>
                  Professional Training
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-6">Join thousands of organizations using ProofVault for secure credential verification</p>
            <div className="space-x-4">
              <Link href="/demo">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3">
                  Try the Demo
                </Button>
              </Link>
              <Link href="/mint">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  Create Your First Credential
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-600">
            <p>ProofVault - Secure Credential Verification on Base Blockchain</p>
          </div>
        </footer>
      </div>
    </>
  );
}
