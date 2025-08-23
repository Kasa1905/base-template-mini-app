import React from "react";
import type { Tab } from "../Demo";

interface FooterProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 mx-4 mb-4 bg-white dark:bg-gray-800 border shadow-lg px-2 py-2 rounded-lg z-50">
    <div className="flex justify-around items-center h-14">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center w-full h-full ${
          activeTab === 'dashboard' ? 'text-blue-500' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">📊</span>
        <span className="text-xs mt-1">Dashboard</span>
      </button>
      <button
        onClick={() => setActiveTab('add')}
        className={`flex flex-col items-center justify-center w-full h-full ${
          activeTab === 'add' ? 'text-blue-500' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">➕</span>
        <span className="text-xs mt-1">Mint</span>
      </button>
      <button
        onClick={() => setActiveTab('verify')}
        className={`flex flex-col items-center justify-center w-full h-full ${
          activeTab === 'verify' ? 'text-blue-500' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">✅</span>
        <span className="text-xs mt-1">Verify</span>
      </button>
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center w-full h-full ${
          activeTab === 'profile' ? 'text-blue-500' : 'text-gray-500'
        }`}
      >
        <span className="text-xl">👤</span>
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  </div>
);
