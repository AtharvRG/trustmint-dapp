// src/contexts/web3-context-definition.ts
import { createContext } from 'react';
import { BrowserProvider, Contract, Signer } from 'ethers';

export interface IWeb3Context {
  provider: BrowserProvider | null;
  signer: Signer | null;
  factoryContract: Contract | null;
  address: string | undefined;
  chainId: number | undefined;
  isConnected: boolean;
  isLoading: boolean;
  isWrongNetwork: boolean;
}

export const Web3Context = createContext<IWeb3Context | null>(null);