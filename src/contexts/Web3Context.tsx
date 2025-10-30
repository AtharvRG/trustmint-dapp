// src/contexts/Web3Context.tsx

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { ReactNode, useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract, Signer } from 'ethers';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers/react';

import { Web3Context } from './web3-context-definition';
import { TRUSTMINT_FACTORY_ADDRESS, TARGET_CHAIN_ID, TARGET_CHAIN_NAME } from '../constants';
import TrustMintFactoryABI from '../contracts/TrustMintFactory.json';

// --- Configuration: The Single Source of Truth ---

// 1. Read environment variables. This is the ONLY place we do this.
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
const rpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL;

// 2. Validate the environment variables to prevent runtime errors.
if (!projectId) {
  throw new Error("CRITICAL: VITE_WALLETCONNECT_PROJECT_ID is not defined in your .env.local file.");
}
if (!rpcUrl) {
  throw new Error("CRITICAL: VITE_SEPOLIA_RPC_URL is not defined in your .env.local file. Please get one from Infura or Alchemy.");
}

console.log("Using RPC URL:", rpcUrl); // Final diagnostic check

// 3. Define metadata for WalletConnect.
const metadata = {
  name: 'TrustMint',
  description: 'The foundational layer of trust for the global freelance economy.',
  url: window.location.origin, // Dynamically use the current URL
  icons: [`${window.location.origin}/logo.png`] // Dynamically use the current URL
};

// 4. Configure Ethers.js using our single source of truth.
const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: TARGET_CHAIN_ID,
  rpcUrl: rpcUrl // <-- Use the validated variable
});

// 5. Configure Web3Modal using the exact same single source of truth.
createWeb3Modal({
  ethersConfig,
  projectId,
  chains: [{
    chainId: TARGET_CHAIN_ID,
    name: TARGET_CHAIN_NAME,
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: rpcUrl // <-- Use the validated variable HERE AS WELL
  }],
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#111827',
    '--w3m-accent': '#4ADE80',
    '--w3m-border-radius-master': '1px'
  }
});

// --- The React Provider Component ---

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [factoryContract, setFactoryContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const initializeProvider = useCallback(async () => {
    if (isConnected && walletProvider) {
      setIsLoading(true);
      try {
        const ethersProvider = new BrowserProvider(walletProvider);
        const network = await ethersProvider.getNetwork();

        if (Number(network.chainId) !== TARGET_CHAIN_ID) {
          setIsWrongNetwork(true);
          console.warn("User is on the wrong network.");
        } else {
          setIsWrongNetwork(false);
        }

        const ethersSigner = await ethersProvider.getSigner();
        const factory = new Contract(TRUSTMINT_FACTORY_ADDRESS, TrustMintFactoryABI, ethersSigner);

        setProvider(ethersProvider);
        setSigner(ethersSigner);
        setFactoryContract(factory);
      } catch (error) {
        console.error("Failed to initialize provider:", error);
        setProvider(null);
        setSigner(null);
        setFactoryContract(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Clear state when disconnected
      setIsLoading(false);
      setProvider(null);
      setSigner(null);
      setFactoryContract(null);
    }
  }, [isConnected, walletProvider]); 

  useEffect(() => {
    initializeProvider();
  }, [initializeProvider]);

  const value = {
    provider,
    signer,
    factoryContract,
    address,
    chainId,
    isConnected,
    isLoading,
    isWrongNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};