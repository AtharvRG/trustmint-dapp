// src/hooks/useEscrowContract.ts
import { useState, useEffect, useCallback } from 'react';
import { Contract, formatEther, parseEther, Result } from 'ethers';
import { useWeb3 } from './useWeb3';
import EscrowABI from '../contracts/Escrow.json';
import { EscrowDetails, Milestone } from '../types/escrow';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useEscrowContract = (contractAddress: string | undefined) => {
  const { provider, signer, address: userAddress } = useWeb3();
  const [contract, setContract] = useState<Contract | null>(null);
  const [details, setDetails] = useState<EscrowDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<{ [key: string]: 'idle' | 'pending' | 'error' }>({});

  const fetchDetailsWithRetry = useCallback(async (instance: Contract, retries = 4, delay = 2500) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempt ${i + 1} to fetch details for ${await instance.getAddress()}`);
        
        const contractData = await instance.getContractDetails();
        const milestoneCount = await instance.getMilestoneCount();

        const milestones: Milestone[] = [];
        for (let j = 0; j < Number(milestoneCount); j++) {
          const m: Result = await instance.getMilestone(j);
          
          milestones.push({
            description: m[0],
            amount: formatEther(m[1]),
            state: Number(m[2]),
            ipfsCid: m[3],
            rejectionReason: m[4]
          });
        }

        setDetails({
          client: contractData[0],
          freelancer: contractData[1],
          totalAmount: formatEther(contractData[2]),
          balance: formatEther(contractData[3]),
          currentState: Number(contractData[4]),
          milestones,
        });
        
        setError(null);
        console.log("Successfully fetched contract details.");
        return;

      } catch (e) {
        console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`, e);
        if (i === retries - 1) {
          throw e;
        }
        await sleep(delay);
      }
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      if (provider && signer && contractAddress) {
        try {
          setIsLoading(true);
          const instance = new Contract(contractAddress, EscrowABI, signer);
          setContract(instance);
          await fetchDetailsWithRetry(instance);
        } catch (e) {
          console.error("Fatal: Failed to fetch contract details after multiple retries.", e);
          setError("Could not load project details. Please ensure the address is correct and you are on the Sepolia network.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    initialize();
  }, [provider, signer, contractAddress, fetchDetailsWithRetry]);

  const handleAction = async (actionName: string, ...args: unknown[]) => {
    if (!contract) return;
    const statusKey = typeof args[0] === 'number' ? `${actionName}-${args[0]}` : actionName;
    setActionStatus(prev => ({ ...prev, [statusKey]: 'pending' }));
    try {
      const tx = await contract[actionName](...args);
      await tx.wait();
      await fetchDetailsWithRetry(contract, 1);
      setActionStatus(prev => ({ ...prev, [statusKey]: 'idle' }));
    } catch (e) {
      console.error(`Error during action '${actionName}':`, e);
      setActionStatus(prev => ({ ...prev, [statusKey]: 'error' }));
      throw e;
    }
  };

  const fundContract = async () => { if (!details) return; await handleAction('fund', { value: parseEther(details.totalAmount) }); };
  const approveMilestone = async (index: number) => { await handleAction('approveMilestone', index); };
  const submitWork = async (index: number, ipfsCid: string) => { await handleAction('submitWork', index, ipfsCid); };
  const acceptAssignment = async () => { await handleAction('acceptAssignment'); };
  const declineAssignment = async () => { await handleAction('declineAssignment'); };
  const rejectMilestone = async (index: number, reason: string) => { await handleAction('rejectMilestone', index, reason); };

  const isClient = userAddress?.toLowerCase() === details?.client?.toLowerCase();
  const isFreelancer = userAddress?.toLowerCase() === details?.freelancer?.toLowerCase();

  return { 
    details, isLoading, error, actionStatus,
    fundContract, approveMilestone, submitWork,
    acceptAssignment, declineAssignment, rejectMilestone,
    isClient, isFreelancer
  };
};