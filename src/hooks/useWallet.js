import { useState, useEffect, useCallback } from 'react';

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState(null);

  // Base network configuration
  const BASE_MAINNET_CHAIN_ID = '0x2105'; // 8453
  const BASE_SEPOLIA_CHAIN_ID = '0x14A34'; // 84532

  // Check wallet connection on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          handleDisconnect();
        } else {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          fetchBalance(accounts[0]);
        }
      };

      const handleChainChanged = (newChainId) => {
        setChainId(newChainId);
        // Reload page to avoid state issues
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkWalletConnection = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        
        setChainId(currentChainId);
        
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await fetchBalance(accounts[0]);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setError(error.message);
    }
  };

  const fetchBalance = async (address) => {
    try {
      if (window.ethereum && address) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        // Convert from wei to ETH
        const balanceInETH = parseInt(balance, 16) / Math.pow(10, 18);
        setBalance(balanceInETH.toFixed(4));
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const connectWallet = useCallback(async () => {
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

      // Check and switch to Base network if needed
      await ensureBaseNetwork();

      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      await fetchBalance(address);

      return address;

    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const ensureBaseNetwork = async () => {
    try {
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (currentChainId !== BASE_MAINNET_CHAIN_ID && currentChainId !== BASE_SEPOLIA_CHAIN_ID) {
        try {
          // Try to switch to Base Sepolia first (for development)
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
          });
        } catch (switchError) {
          // If Base Sepolia is not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: BASE_SEPOLIA_CHAIN_ID,
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
      
      // Update chain ID after switch
      const newChainId = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(newChainId);
      
    } catch (error) {
      console.error('Error ensuring Base network:', error);
      throw new Error('Please switch to Base network to continue');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setError(null);
    setBalance(null);
  };

  const signMessage = async (message) => {
    if (!isConnected || !walletAddress) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      });
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  const switchNetwork = async (targetChainId) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  // Helper functions
  const isBaseNetwork = () => {
    return chainId === BASE_MAINNET_CHAIN_ID || chainId === BASE_SEPOLIA_CHAIN_ID;
  };

  const getNetworkName = () => {
    switch (chainId) {
      case BASE_MAINNET_CHAIN_ID:
        return 'Base Mainnet';
      case BASE_SEPOLIA_CHAIN_ID:
        return 'Base Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    // State
    isConnected,
    walletAddress,
    isConnecting,
    error,
    chainId,
    balance,
    
    // Actions
    connectWallet,
    handleDisconnect,
    signMessage,
    switchNetwork,
    ensureBaseNetwork,
    
    // Helpers
    isBaseNetwork,
    getNetworkName,
    truncateAddress,
    
    // Constants
    BASE_MAINNET_CHAIN_ID,
    BASE_SEPOLIA_CHAIN_ID,
  };
}
