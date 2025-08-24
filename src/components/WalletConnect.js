import { useState, useEffect } from 'react';
import { Button } from './ui/Button';

export function WalletConnect({ onConnect, className }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);

  // Check if wallet is already connected
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          if (onConnect) onConnect(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure your wallet is unlocked.');
      }

      // Check if connected to Base network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const baseChainId = '0x2105'; // Base mainnet chain ID (8453 in decimal)
      const baseSepoliaChainId = '0x14A34'; // Base Sepolia testnet chain ID (84532 in decimal)

      if (chainId !== baseChainId && chainId !== baseSepoliaChainId) {
        try {
          // Try to switch to Base network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseSepoliaChainId }],
          });
        } catch (switchError) {
          // If Base network is not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: baseSepoliaChainId,
                chainName: 'Base Sepolia',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://sepolia.base.org'],
                blockExplorerUrls: ['https://sepolia-explorer.base.org'],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      
      if (onConnect) {
        onConnect(address);
      }

      // Listen for account changes (only in browser)
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            setIsConnected(false);
            setWalletAddress(null);
          } else {
            setWalletAddress(accounts[0]);
            if (onConnect) onConnect(accounts[0]);
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      }

    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setError(null);
    
    // Note: MetaMask doesn't have a programmatic disconnect method
    // Users need to disconnect from their wallet manually
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-green-800">
            {truncateAddress(walletAddress)}
          </span>
        </div>
        <Button 
          onClick={disconnectWallet}
          variant="outline"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Button 
        onClick={connectWallet}
        disabled={isConnecting}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isConnecting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting...</span>
          </div>
        ) : (
          'Connect Wallet'
        )}
      </Button>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      {typeof window !== 'undefined' && !window?.ethereum && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            MetaMask not detected. 
            <a 
              href="https://metamask.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline ml-1 hover:text-yellow-900"
            >
              Install MetaMask
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
