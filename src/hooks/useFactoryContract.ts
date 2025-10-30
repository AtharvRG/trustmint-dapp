// src/hooks/useFactoryContract.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseEther, isAddress, Interface, Log } from 'ethers';
import { useWeb3 } from './useWeb3';
import TrustMintFactoryABI from '../contracts/TrustMintFactory.json';

type CreationStatus = 'idle' | 'pending' | 'success' | 'error';

export interface CreateEscrowResult {
  status: CreationStatus;
  error: string | null;
  createEscrow: (freelancer: string, descriptions: string[], amounts: string[]) => Promise<void>;
}

export const useFactoryContract = (): CreateEscrowResult => {
  const { factoryContract, address: clientAddress, provider } = useWeb3();
  const navigate = useNavigate();
  const [status, setStatus] = useState<CreationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const createEscrow = async (freelancer: string, descriptions: string[], amounts: string[]): Promise<void> => {
    if (!provider || !factoryContract || !clientAddress) {
      setError("Wallet is not connected or the application is not properly initialized.");
      setStatus('error');
      return;
    }
    if (!isAddress(freelancer) || freelancer.toLowerCase() === clientAddress.toLowerCase()) {
      setError("Invalid or identical freelancer wallet address provided.");
      setStatus('error');
      return;
    }
    setStatus('pending');
    setError(null);
    try {
      const amountsInWei = amounts.map(amount => parseEther(amount));
      const tx = await factoryContract.createEscrow(clientAddress, freelancer, descriptions, amountsInWei);
      console.log('Transaction successfully submitted. Hash:', tx.hash);
      const receipt = await tx.wait(1);
      if (!receipt) {
        throw new Error("Transaction failed: Receipt was not returned.");
      }
      console.log('Transaction mined successfully. Parsing receipt for EscrowCreated event...');
      const factoryInterface = new Interface(TrustMintFactoryABI);
      let newEscrowAddress: string | null = null;
      for (const log of receipt.logs as Log[]) {
        try {
          const parsedLog = factoryInterface.parseLog(log);
          if (parsedLog && parsedLog.name === 'EscrowCreated') {
            const eventClient = parsedLog.args.client;
            const eventFreelancer = parsedLog.args.freelancer;
            if (eventClient.toLowerCase() === clientAddress.toLowerCase() && eventFreelancer.toLowerCase() === freelancer.toLowerCase()) {
              newEscrowAddress = parsedLog.args.escrowAddress;
              break;
            }
          }
        } catch (e) { /* Ignore logs that don't match our ABI */ }
      }
      if (!newEscrowAddress) {
        throw new Error("Execution succeeded, but the EscrowCreated event could not be found in the transaction logs.");
      }
      console.log('Successfully parsed event. New Escrow Contract Address:', newEscrowAddress);
      setStatus('success');
      navigate(`/project/${newEscrowAddress}`);
    } catch (e: unknown) {
      console.error("A critical error occurred during escrow creation:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred. Please check the console.";
      setError(errorMessage);
      setStatus('error');
    }
  };
  return { status, error, createEscrow };
};