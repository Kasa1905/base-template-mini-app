import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { ThemeSelector } from '../components/ui/ThemeSelector';
import SafeDate, { SafeCurrentDate } from '../components/ui/SafeDate';

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
    issueDate: '',
    description: '',
    skills: []
  });
  const [loading, setLoading] = useState(false);

  // Initialize date on client side only
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      issueDate: new Date().toISOString().split('T')[0]
    }));
  }, []);

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

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>
                What type of credential do you want to create?
              </h2>
              <p className={`${theme.textSecondary} text-lg`}>
                Choose the category that best describes your certificate
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {credentialTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`p-6 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-lg ${
                    formData.credentialType === type.id
                      ? `${theme.accent} border-transparent text-white`
                      : `${theme.bgSecondary} ${theme.border} ${theme.text} hover:${theme.border.replace('border-', 'border-')}}`
                  }`}
                >
                  <div className="text-3xl mb-3">{type.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                  <p className={`text-sm mb-3 ${formData.credentialType === type.id ? 'text-white/80' : theme.textSecondary}`}>
                    {type.description}
                  </p>
                  <p className={`text-xs italic ${formData.credentialType === type.id ? 'text-white/60' : theme.textSecondary}`}>
                    Examples: {type.examples}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>
                Tell us about the recipient
              </h2>
              <p className={`${theme.textSecondary} text-lg`}>
                Who is receiving this credential? (This could be yourself or someone else)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  👤 Recipient's Full Name
                  <span className={`text-xs ${theme.textSecondary} ml-2`}>
                    (This will appear on the certificate)
                  </span>
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="e.g., John Smith"
                  className={`w-full p-3 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  📧 Email Address
                  <span className={`text-xs ${theme.textSecondary} ml-2`}>
                    (For verification and notifications)
                  </span>
                </label>
                <input
                  type="email"
                  name="recipientEmail"
                  value={formData.recipientEmail}
                  onChange={handleInputChange}
                  placeholder="e.g., john@example.com"
                  className={`w-full p-3 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                ← Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!formData.recipientName || !formData.recipientEmail}
                className={`px-6 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 disabled:opacity-50`}
              >
                Continue →
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>
                Credential Details
              </h2>
              <p className={`${theme.textSecondary} text-lg`}>
                What achievement or qualification is this credential for?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  🏢 Issuing Organization
                  <span className={`text-xs ${theme.textSecondary} ml-2`}>
                    (School, company, or institution issuing this credential)
                  </span>
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  placeholder="e.g., Stanford University, Google, Microsoft"
                  className={`w-full p-3 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  🎯 Achievement Title
                  <span className={`text-xs ${theme.textSecondary} ml-2`}>
                    (The main title of the credential)
                  </span>
                </label>
                <input
                  type="text"
                  name="achievementTitle"
                  value={formData.achievementTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor of Computer Science, AWS Solutions Architect"
                  className={`w-full p-3 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  📅 Issue Date
                  <span className={`text-xs ${theme.textSecondary} ml-2`}>
                    (When was this achievement earned?)
                  </span>
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  📝 Description
                  <span className={`text-xs ${theme.textSecondary} ml-2`}>
                    (Brief description of what this credential represents)
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Completed 4-year degree program in Computer Science with focus on software engineering and data structures."
                  rows={3}
                  className={`w-full p-3 rounded-lg border ${theme.border} ${theme.bg} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={prevStep}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                ← Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!formData.organizationName || !formData.achievementTitle}
                className={`px-6 py-2 ${theme.accent} text-white rounded-lg hover:opacity-90 disabled:opacity-50`}
              >
                Review →
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className={`text-2xl font-bold ${theme.text} mb-3`}>
                Review & Create
              </h2>
              <p className={`${theme.textSecondary} text-lg`}>
                Double-check everything looks correct before creating your credential
              </p>
            </div>

            <div className={`${theme.bgSecondary} p-6 rounded-lg ${theme.border} border`}>
              <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Credential Preview</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${theme.textSecondary}`}>Type:</span>
                  <span className={`${theme.text} font-medium`}>
                    {credentialTypes.find(t => t.id === formData.credentialType)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textSecondary}`}>Recipient:</span>
                  <span className={`${theme.text} font-medium`}>{formData.recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textSecondary}`}>Organization:</span>
                  <span className={`${theme.text} font-medium`}>{formData.organizationName}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textSecondary}`}>Achievement:</span>
                  <span className={`${theme.text} font-medium`}>{formData.achievementTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textSecondary}`}>Date:</span>
                  <span className={`${theme.text} font-medium`}>
                    <SafeDate dateValue={formData.issueDate} format="locale" />
                  </span>
                </div>
                {formData.description && (
                  <div>
                    <span className={`${theme.textSecondary}`}>Description:</span>
                    <p className={`${theme.text} mt-1`}>{formData.description}</p>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  ← Edit
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 ${theme.accent} text-white rounded-lg hover:opacity-90 disabled:opacity-50 text-lg font-semibold`}
                >
                  {loading ? '🔄 Creating...' : '🚀 Create Credential'}
                </Button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Create Credential - ProofVault</title>
        <meta name="description" content="Create verifiable digital credentials in just a few simple steps" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`min-h-screen ${theme.bg} transition-all duration-300`}>
        {/* Navigation */}
        <nav className={`${theme.bgSecondary} shadow-sm ${theme.border} border-b`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className={`text-2xl font-bold ${theme.accent.replace('bg-', 'text-')}`}>
                  ProofVault
                </Link>
                <span className={`ml-2 px-2 py-1 text-xs ${theme.accent} text-white rounded`}>
                  CREATE
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeSelector />
                <Link
                  href="/"
                  className={`${theme.textSecondary} hover:${theme.text} px-3 py-2 text-sm font-medium transition-colors`}
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    step <= currentStep
                      ? `${theme.accent} text-white`
                      : `${theme.bgSecondary} ${theme.textSecondary} border ${theme.border}`
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < 4 && (
                  <div
                    className={`h-1 w-20 mx-2 transition-all duration-200 ${
                      step < currentStep ? theme.accent : `${theme.bgSecondary}`
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm">
              <span className={currentStep >= 1 ? theme.text : theme.textSecondary}>
                Choose Type
              </span>
              <span className={currentStep >= 2 ? theme.text : theme.textSecondary}>
                Recipient Info
              </span>
              <span className={currentStep >= 3 ? theme.text : theme.textSecondary}>
                Details
              </span>
              <span className={currentStep >= 4 ? theme.text : theme.textSecondary}>
                Review
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className={`${theme.bgSecondary} rounded-lg shadow-lg p-8`}>
            {renderStepContent()}
          </div>
        </main>
      </div>
    </>
  );
}
