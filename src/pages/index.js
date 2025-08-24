import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import { useTheme } from '../context/ThemeContext';

export default function LandingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { theme, currentTheme, themes } = useTheme();

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
        {/* Clean Navigation */}
        <nav className="relative">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-lg border-b border-white/10"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ProofVault
                </h1>
                <span className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full font-medium border border-blue-400/30">
                  SECURE
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/demo"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Try Demo
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Clean Hero Section */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Certificates That{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Actually Work
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed">
              No more calling schools to verify degrees. No more fake certificates.{" "}
              Create digital credentials that employers can verify instantly.
            </p>
            
            {/* Simple Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/mint">
                <Button 
                  variant="custom"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-colors duration-200"
                >
                  Create Credential
                </Button>
              </Link>
              
              <Link href="/demo">
                <Button 
                  variant="custom"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 text-lg font-semibold rounded-lg transition-all duration-200"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
            
            {/* Clean Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                <div className="text-4xl font-bold text-blue-400 mb-2">1-Click</div>
                <div className="text-gray-300">Credential Creation</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                <div className="text-4xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-300">Blockchain Verified</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50">
                <div className="text-4xl font-bold text-purple-400 mb-2">QR Code</div>
                <div className="text-gray-300">Instant Sharing</div>
              </div>
            </div>
          </div>

          {/* Simple Step Guide */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-10 mb-16 border border-gray-700/50">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Get Started in 4 Easy Steps
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 transition-colors duration-200"
                  onMouseEnter={() => setCurrentStep(index)}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4 mx-auto">
                      {index + 1}
                    </div>
                    <div className="text-xl font-semibold mb-4 text-white">{step.title}</div>
                    <p className="text-gray-400 mb-6 text-sm">{step.description}</p>
                    <Link href={step.link}>
                      <Button 
                        variant="custom"
                        className={`w-full ${step.color} text-white rounded-lg py-3 px-4 font-medium transition-colors duration-200`}
                      >
                        {step.action}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4">🔒</span>
                Why ProofVault?
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <div>
                    <div className="font-medium text-white">Blockchain Security Without Complexity</div>
                    <div className="text-sm text-gray-400">Enterprise-grade security made simple</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <div>
                    <div className="font-medium text-white">No Wallet Setup Required</div>
                    <div className="text-sm text-gray-400">Get started immediately</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <div>
                    <div className="font-medium text-white">QR Codes for Offline Verification</div>
                    <div className="text-sm text-gray-400">Works anywhere, even without internet</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-3 mt-1">✓</span>
                  <div>
                    <div className="font-medium text-white">Share Credentials Instantly</div>
                    <div className="text-sm text-gray-400">One click sharing via link or QR code</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center">
                <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">🚀</span>
                Perfect For
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🎓</span>
                  <div>
                    <div className="font-medium text-white">Universities & Schools</div>
                    <div className="text-sm text-gray-400">Digital diplomas and certificates</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🏢</span>
                  <div>
                    <div className="font-medium text-white">Companies & Organizations</div>
                    <div className="text-sm text-gray-400">Employee certifications and achievements</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">📜</span>
                  <div>
                    <div className="font-medium text-white">Certification Bodies</div>
                    <div className="text-sm text-gray-400">Professional licenses and industry certs</div>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💼</span>
                  <div>
                    <div className="font-medium text-white">Professional Training</div>
                    <div className="text-sm text-gray-400">Course completions and skill assessments</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Secure Your Credentials?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join the future of digital verification. Start issuing tamper-proof credentials today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button variant="primary" className="text-lg px-8 py-3">
                  Try Live Demo
                </Button>
              </Link>
              <Link href="/mint">
                <Button variant="secondary" className="text-lg px-8 py-3">
                  Create Credential
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800/40 backdrop-blur-sm border-t border-gray-700/50 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">ProofVault</h3>
              <p className="text-gray-400 mb-4">Secure Credential Verification on Base Blockchain</p>
              <div className="border-t border-gray-700/50 pt-4">
                <p className="text-gray-500 text-sm">© 2024 ProofVault. Building the future of digital identity.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
