// src/hooks/useWeb3.ts
import { useContext } from 'react';
import { Web3Context, IWeb3Context } from '../contexts/web3-context-definition'; // <-- Update import

export const useWeb3 = (): IWeb3Context => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};