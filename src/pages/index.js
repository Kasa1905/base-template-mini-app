import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();

  const steps = [
    {
      title: "🤔 What are Digital Credentials?",
      description: "Think of them like digital certificates that can't be faked - similar to a diploma or driver's license, but stored securely online.",
      action: "See Examples",
      link: "/demo",
      color: "bg-green-600 hover:bg-green-700",
      tooltip: "Digital credentials are tamper-proof certificates that prove your achievements"
    },
    {
      title: "💡 Why Do You Need Them?", 
      description: "Employers and schools can instantly verify your achievements without calling anyone. It's like having a trusted referee available 24/7.",
      action: "Learn Benefits",
      link: "/demo",
      color: "bg-blue-600 hover:bg-blue-700",
      tooltip: "Save time and build trust with instant verification"
    },
    {
      title: "🚀 How Easy Is It?",
      description: "Just like taking a photo with your phone - click, fill in basic info, and you're done. No technical knowledge needed!",
      action: "Try It Now",
      link: "/mint", 
      color: "bg-purple-600 hover:bg-purple-700",
      tooltip: "Create your first credential in under 2 minutes"
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

      <div className={`min-h-screen ${theme.bg} transition-all duration-300`}>
        {/* Simple Navigation */}
        <nav className={`${theme.bgSecondary} shadow-sm ${theme.border} border-b`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className={`text-2xl font-bold ${theme.accent.replace('bg-', 'text-')}`}>ProofVault</h1>
                <span className={`ml-2 px-2 py-1 text-xs ${theme.accent} text-white rounded`}>
                  SIMPLE & SECURE
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/demo"
                  className={`${theme.accent} hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
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
            <h1 className={`text-4xl font-bold ${theme.text} mb-4`}>
              Certificates That <span className={theme.accent.replace('bg-', 'text-')}>Actually Work</span>
            </h1>
            <p className={`text-xl ${theme.textSecondary} max-w-3xl mx-auto mb-8`}>
              No more calling schools to verify degrees. No more fake certificates. 
              Create digital credentials that employers can verify instantly - as easy as sending a text message.
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
