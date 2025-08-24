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
        {/* Enhanced Navigation */}
        <nav className="relative group">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-lg border-b border-white/10 group-hover:bg-black/30 group-hover:border-white/20 transition-all duration-300"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4 group/logo">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover/logo:from-blue-300 group-hover/logo:to-purple-300 transition-all duration-300 cursor-pointer transform group-hover/logo:scale-105">
                  ProofVault
                </h1>
                <span className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full font-medium border border-blue-400/30 hover:bg-blue-500/30 hover:border-blue-400/50 transition-all duration-200 cursor-pointer">
                  SECURE
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/demo"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  Try Demo
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Hero Section */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight group cursor-default">
              Certificates That{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300">
                Actually Work
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed hover:text-gray-100 transition-colors duration-300">
              No more calling schools to verify degrees. No more fake certificates.{" "}
              Create digital credentials that employers can verify instantly.
            </p>
            
            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/mint">
                <Button 
                  variant="custom"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
                >
                  Create Credential
                </Button>
              </Link>
              
              <Link href="/demo">
                <Button 
                  variant="custom"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white/50 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Try Demo
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/60 transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors duration-300">1-Click</div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Credential Creation</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/60 transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                <div className="text-4xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors duration-300">100%</div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Blockchain Verified</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 hover:bg-gray-800/70 hover:border-gray-600/60 transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                <div className="text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors duration-300">QR Code</div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Instant Sharing</div>
              </div>
            </div>
          </div>

          {/* Enhanced Step Guide */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-10 mb-16 border border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/60 transition-all duration-300">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Get Started in 4 Easy Steps
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group cursor-pointer"
                  onMouseEnter={() => setCurrentStep(index)}
                >
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mb-4 mx-auto group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                      {index + 1}
                    </div>
                    <div className="text-xl font-semibold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">{step.title}</div>
                    <p className="text-gray-400 mb-6 text-sm group-hover:text-gray-300 transition-colors duration-300">{step.description}</p>
                    <Link href={step.link}>
                      <Button 
                        variant="custom"
                        className={`w-full ${step.color} text-white rounded-lg py-3 px-4 font-medium transition-all duration-200 transform group-hover:scale-105 hover:shadow-md`}
                      >
                        {step.action}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/60 transition-all duration-300 transform hover:scale-[1.02] group">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center group-hover:text-blue-300 transition-colors duration-300">
                <span className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500 group-hover:scale-110 transition-all duration-300">🔒</span>
                Why ProofVault?
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-green-400 mr-3 mt-1 group-hover/item:text-green-300 transition-colors duration-200">✓</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-blue-300 transition-colors duration-200">Blockchain Security Without Complexity</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">Enterprise-grade security made simple</div>
                  </div>
                </li>
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-green-400 mr-3 mt-1 group-hover/item:text-green-300 transition-colors duration-200">✓</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-blue-300 transition-colors duration-200">No Wallet Setup Required</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">Get started immediately</div>
                  </div>
                </li>
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-green-400 mr-3 mt-1 group-hover/item:text-green-300 transition-colors duration-200">✓</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-blue-300 transition-colors duration-200">QR Codes for Offline Verification</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">Works anywhere, even without internet</div>
                  </div>
                </li>
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-green-400 mr-3 mt-1 group-hover/item:text-green-300 transition-colors duration-200">✓</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-blue-300 transition-colors duration-200">Share Credentials Instantly</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">One click sharing via link or QR code</div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:bg-gray-800/60 hover:border-gray-600/60 transition-all duration-300 transform hover:scale-[1.02] group">
              <h3 className="text-2xl font-bold mb-6 text-white flex items-center group-hover:text-purple-300 transition-colors duration-300">
                <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">🚀</span>
                Perfect For
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform duration-200">🎓</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-purple-300 transition-colors duration-200">Universities & Schools</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">Digital diplomas and certificates</div>
                  </div>
                </li>
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform duration-200">🏢</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-purple-300 transition-colors duration-200">Companies & Organizations</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">Employee certifications and achievements</div>
                  </div>
                </li>
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform duration-200">📜</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-purple-300 transition-colors duration-200">Certification Bodies</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">Professional licenses and industry certs</div>
                  </div>
                </li>
                <li className="flex items-start group/item hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200">
                  <span className="text-2xl mr-3 group-hover/item:scale-110 transition-transform duration-200">💼</span>
                  <div>
                    <div className="font-medium text-white group-hover/item:text-purple-300 transition-colors duration-200">Professional Training</div>
                    <div className="text-sm text-gray-400 group-hover/item:text-gray-300 transition-colors duration-200">Course completions and skill assessments</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Enhanced Call to Action */}
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 text-center hover:bg-gray-800/60 hover:border-gray-600/60 transition-all duration-300 transform hover:scale-[1.02] group">
            <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
              Ready to Secure Your Credentials?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto group-hover:text-gray-200 transition-colors duration-300">
              Join the future of digital verification. Start issuing tamper-proof credentials today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button variant="primary" className="text-lg px-8 py-3 transform hover:scale-105 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25">
                  Try Live Demo
                </Button>
              </Link>
              <Link href="/mint">
                <Button variant="secondary" className="text-lg px-8 py-3 transform hover:scale-105 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/25">
                  Create Credential
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Enhanced Footer */}
        <footer className="bg-gray-800/40 backdrop-blur-sm border-t border-gray-700/50 mt-16 hover:bg-gray-800/60 hover:border-gray-600/60 transition-all duration-300">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center group">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300 cursor-pointer">ProofVault</h3>
              <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">Secure Credential Verification on Base Blockchain</p>
              <div className="border-t border-gray-700/50 pt-4 group-hover:border-gray-600/60 transition-colors duration-300">
                <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors duration-300">© 2024 ProofVault. Building the future of digital identity.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
