"use client";

import { useState } from "react";
import { useConnect, useDisconnect, useAccount, useSwitchChain, useChainId } from "wagmi";
import { Button } from "./ui/Button";
import { truncateAddress } from "../lib/truncateAddress";
import { baseSepolia, base } from "wagmi/chains";

export function WalletConnectButton() {
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting } = useAccount();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const [error, setError] = useState("");

  const targetChain = process.env.NODE_ENV === 'production' ? base : baseSepolia;

  const handleConnect = async (connector: any) => {
    try {
      setError("");
      await connect({ connector });
      
      // Switch to correct network after connection
      if (chainId !== targetChain.id) {
        await switchChain({ chainId: targetChain.id });
      }
    } catch (err: any) {
      console.error("Connection error:", err);
      setError(err.message || "Failed to connect wallet");
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      setError("");
      await switchChain({ chainId: targetChain.id });
    } catch (err: any) {
      console.error("Network switch error:", err);
      setError(err.message || "Failed to switch network");
    }
  };

  if (isConnected && address) {
    const isWrongNetwork = chainId !== targetChain.id;
    
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div>
            <p className="text-sm font-medium text-green-800">Connected</p>
            <p className="text-xs text-green-600">{truncateAddress(address)}</p>
          </div>
          <Button
            onClick={() => disconnect()}
            className="ml-auto bg-red-500 hover:bg-red-600 w-auto max-w-none px-3 py-1 text-sm"
          >
            Disconnect
          </Button>
        </div>
        
        {isWrongNetwork && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 mb-2">
              Wrong Network. Please switch to {targetChain.name}
            </p>
            <Button
              onClick={handleNetworkSwitch}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              Switch to {targetChain.name}
            </Button>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Connect your wallet to get started</p>
      </div>
      
      {connectors
        .filter(connector => connector.id !== 'injected') // Filter out generic injected connector
        .map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => handleConnect(connector)}
          disabled={isPending || isConnecting}
          className="w-full justify-start border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
        >
          {isPending || isConnecting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Connecting...
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              {connector.name}
            </div>
          )}
        </Button>
      ))}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Supported on {targetChain.name} network
        </p>
      </div>
    </div>
  );
}
