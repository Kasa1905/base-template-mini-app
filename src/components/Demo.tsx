"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useMiniApp } from "@neynar/react";
import { Header } from "./ui/Header";
import { Footer } from "./ui/Footer";

export type Tab = "dashboard" | "add" | "verify" | "profile";

export default function ProofVaultDemo() {
  const { isSDKLoaded } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const { address, isConnected } = useAccount();

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
            <p className="text-gray-600">
              {isConnected 
                ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                : "Connect wallet to view credentials"
              }
            </p>
          </div>
        );
      case "add":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mint Credential</h2>
            <p className="text-gray-600">Credential minting form will go here</p>
          </div>
        );
      case "verify":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify Credential</h2>
            <p className="text-gray-600">Credential verification will go here</p>
          </div>
        );
      case "profile":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
            <p className="text-gray-600">User profile will go here</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard" },
              { id: "add", label: "Mint" },
              { id: "verify", label: "Verify" },
              { id: "profile", label: "Profile" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {renderTabContent()}
      </main>

      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
