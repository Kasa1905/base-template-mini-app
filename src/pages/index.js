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
    },
    {
      title: "🎉 Share & Verify",
      description: "Once created, instantly share your credential via QR code or link. Anyone can verify its authenticity in seconds!",
      action: "Start Now",
      link: "/mint", 
      color: "bg-orange-600 hover:bg-orange-700",
      tooltip: "Share and verify credentials instantly with QR codes"
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

      <div className={`min-h-screen ${theme.bg} transition-all duration-300 center-content`}>
        {/* Enhanced Organic Navigation */}
        <nav className="relative group w-full">
          <div className="glass-card border-b transition-all duration-500" style={{ borderColor: theme.border }}></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4 group/logo organic-hover">
                <h1 className="text-2xl font-bold gradient-text-modern group-hover/logo:scale-105 transition-all duration-300 cursor-pointer float-smooth">
                  ProofVault
                </h1>
                <span className="px-3 py-1 text-xs rounded-full font-medium border transition-all duration-300 cursor-pointer breathe glass-card" style={{ color: theme.text, borderColor: theme.border }}>
                  SECURE
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/demo"
                  className="fluid-button text-sm"
                >
                  Try Demo
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Hero Section - Properly Centered */}
        <main className="center-content w-full py-20">
          <div className="center-content mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className={`text-5xl md:text-6xl font-bold ${theme.text} mb-6 leading-tight group cursor-default text-center`}>
              Certificates That{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all duration-300">
                Actually Work
              </span>
            </h1>
            <p className={`text-xl md:text-2xl ${theme.textSecondary} max-w-4xl mx-auto mb-12 leading-relaxed hover:opacity-80 transition-opacity duration-300 text-center`}>
              No more calling schools to verify degrees. No more fake certificates.{" "}
              Create digital credentials that employers can verify instantly.
            </p>
            
            {/* Enhanced Organic Action Buttons - Properly Centered */}
            <div className="center-flex flex-col sm:flex-row gap-6 mb-16">
              <Link href="/mint">
                <Button 
                  variant="custom"
                  className="fluid-button illuminating-hover text-lg px-10 py-4 organic-hover"
                >
                  Create Credential
                </Button>
              </Link>
              
              <Link href="/demo">
                <Button 
                  variant="custom"
                  className="glass-card illuminating-purple px-10 py-4 text-lg font-semibold transition-all duration-300 organic-hover"
                  style={{ color: theme.text, borderColor: theme.border }}
                >
                  Try Demo
                </Button>
              </Link>
            </div>
            
            {/* Enhanced Organic Stats - Properly Centered */}
            <div className="center-content w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto w-full">
                <div className="enhanced-card organic-card illuminating-hover p-10 group cursor-pointer center-content scale-in stagger-1" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border, minHeight: '180px' }}>
                  <div className="center-content space-y-4">
                    <div className="text-5xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300 group-hover:scale-110 transform">1-Click</div>
                    <div className="text-lg font-medium group-hover:opacity-80 transition-opacity duration-300 text-center" style={{ color: theme.textSecondary }}>Credential Creation</div>
                  </div>
                </div>
                <div className="enhanced-card organic-card illuminating-green p-10 group cursor-pointer center-content scale-in stagger-2" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border, minHeight: '180px' }}>
                  <div className="center-content space-y-4">
                    <div className="text-5xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300 group-hover:scale-110 transform">100%</div>
                    <div className="text-lg font-medium group-hover:opacity-80 transition-opacity duration-300 text-center" style={{ color: theme.textSecondary }}>Blockchain Verified</div>
                  </div>
                </div>
                <div className="enhanced-card organic-card illuminating-purple p-10 group cursor-pointer center-content scale-in stagger-3" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border, minHeight: '180px' }}>
                  <div className="center-content space-y-4">
                    <div className="text-5xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors duration-300 group-hover:scale-110 transform">QR Code</div>
                    <div className="text-lg font-medium group-hover:opacity-80 transition-opacity duration-300 text-center" style={{ color: theme.textSecondary }}>Instant Sharing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Organic Step Guide - Properly Centered */}
          <div className="center-content mb-16">
            <div className="glass-card p-12 w-full max-w-7xl mx-auto" style={{ borderColor: theme.border }}>
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 gradient-text-modern fade-in-up">
                Get Started in 4 Easy Steps
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {steps.map((step, index) => {
                  const illuminationClass = index === 0 ? 'illuminating-green' : 
                                          index === 1 ? 'illuminating-hover' : 
                                          index === 2 ? 'illuminating-purple' : 'illuminating-orange';
                  return (
                    <div 
                      key={index}
                      className={`enhanced-card organic-card ${illuminationClass} p-8 group cursor-pointer center-content scale-in stagger-${index + 1}`}
                      style={{ 
                        backgroundColor: theme.bgSecondary, 
                        borderColor: theme.border,
                        minHeight: '320px'
                      }}
                      onMouseEnter={() => setCurrentStep(index)}
                    >
                      <div className="center-content space-y-6 w-full">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl center-flex text-white text-2xl font-bold shadow-2xl group-hover:pulse-glow transition-all duration-500 transform group-hover:scale-125 group-hover:rotate-12">
                          {index + 1}
                        </div>
                        <div className="center-content space-y-4">
                          <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors duration-300 text-center" style={{ color: theme.text }}>
                            {step.title}
                          </h3>
                          <p className="text-sm leading-relaxed group-hover:opacity-80 transition-all duration-300 text-center max-w-xs" style={{ color: theme.textSecondary }}>
                            {step.description}
                          </p>
                        </div>
                        <Link href={step.link} className="w-full">
                          <Button 
                            variant="custom"
                            className={`w-full ${step.color} text-white rounded-2xl py-4 px-6 font-semibold transition-all duration-300 transform group-hover:scale-105 hover:shadow-xl`}
                          >
                            {step.action}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Enhanced Organic Features - Properly Centered */}
          <div className="center-content mb-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto w-full">
              <div className="enhanced-card organic-card illuminating-green p-10 group fade-in-up stagger-1" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}>
                <div className="center-content space-y-8">
                  <div className="center-flex space-x-4">
                    <span className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl center-flex shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-2xl">🔒</span>
                    <h3 className="text-3xl font-bold group-hover:text-blue-500 transition-colors duration-300" style={{ color: theme.text }}>
                      Why ProofVault?
                    </h3>
                  </div>
                  <ul className="space-y-6 w-full" style={{ color: theme.textSecondary }}>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-green-400 text-xl">✓</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>Blockchain Security Without Complexity</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>Enterprise-grade security made simple</div>
                      </div>
                    </li>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-green-400 text-xl">✓</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>No Wallet Setup Required</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>Get started immediately</div>
                      </div>
                    </li>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-green-400 text-xl">✓</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>QR Codes for Offline Verification</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>Works anywhere, even without internet</div>
                      </div>
                    </li>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-green-400 text-xl">✓</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>Share Credentials Instantly</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>One click sharing via link or QR code</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="enhanced-card organic-card illuminating-purple p-10 group fade-in-up stagger-2" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}>
                <div className="center-content space-y-8">
                  <div className="center-flex space-x-4">
                    <span className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl center-flex shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-2xl">🚀</span>
                    <h3 className="text-3xl font-bold group-hover:text-purple-500 transition-colors duration-300" style={{ color: theme.text }}>
                      Perfect For
                    </h3>
                  </div>
                  <ul className="space-y-6 w-full" style={{ color: theme.textSecondary }}>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-3xl">🎓</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>Universities & Schools</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>Digital diplomas and certificates</div>
                      </div>
                    </li>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-3xl">🏢</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>Companies & Organizations</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>Employee certifications and achievements</div>
                      </div>
                    </li>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-3xl">📜</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>Certification Bodies</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>Professional licenses and industry certs</div>
                      </div>
                    </li>
                    <li className="center-flex space-x-4 p-4 rounded-2xl transition-all duration-300 hover:bg-opacity-50" style={{ backgroundColor: theme.theme === 'dark' ? 'rgba(55, 65, 81, 0.1)' : 'rgba(243, 244, 246, 0.3)' }}>
                      <span className="text-3xl">�</span>
                      <div className="center-content space-y-2">
                        <div className="font-semibold text-lg" style={{ color: theme.text }}>Professional Training</div>
                        <div className="text-sm" style={{ color: theme.textSecondary }}>Course completions and skill assessments</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Organic Call to Action - Properly Centered */}
          <div className="center-content mb-16 w-full">
            <div className="glass-card illuminating-hover p-12 text-center group breathe max-w-4xl mx-auto w-full" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text-modern fade-in-up">
                Ready to Secure Your Credentials?
              </h2>
              <p className="text-xl mb-12 max-w-2xl mx-auto group-hover:opacity-80 transition-all duration-300 scale-in stagger-1" style={{ color: theme.textSecondary }}>
                Join the future of digital verification. Start issuing tamper-proof credentials today.
              </p>
              <div className="center-flex flex-col sm:flex-row gap-8">
                <Link href="/demo">
                  <Button variant="primary" className="fluid-button text-lg px-12 py-5 scale-in stagger-2">
                    Try Live Demo
                  </Button>
                </Link>
                <Link href="/mint">
                  <Button variant="secondary" className="glass-card px-12 py-5 text-lg font-semibold organic-hover scale-in stagger-3" style={{ color: theme.text, borderColor: theme.border }}>
                    Create Credential
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Enhanced Footer - Properly Centered */}
        <footer className="backdrop-blur-sm border-t mt-16 transition-all duration-300 center-content" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}>
          <div className="max-w-6xl mx-auto px-4 py-12 w-full">
            <div className="center-content space-y-6 group">
              <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors duration-300 cursor-pointer gradient-text-modern">ProofVault</h3>
              <p className="text-lg group-hover:opacity-80 transition-all duration-300" style={{ color: theme.textSecondary }}>Secure Credential Verification on Base Blockchain</p>
              <div className="border-t pt-6 transition-colors duration-300 w-full center-content" style={{ borderColor: theme.border }}>
                <p className="text-sm group-hover:opacity-80 transition-all duration-300" style={{ color: theme.textSecondary }}>© 2024 ProofVault. Building the future of digital identity.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
