// src/hooks/useJobManagement.ts
import { useState } from 'react'; // <-- Removed useCallback
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from './useWeb3';
import { useIPFS } from './useIPFS';
import { Contract, parseEther } from 'ethers';
import { JOB_MARKET_ADDRESS } from '../constants';
import JobMarketABI from '../contracts/JobMarket.json';

type JobStatus = 'idle' | 'uploading' | 'signing' | 'success' | 'error';

export const useJobManagement = () => {
  const { signer } = useWeb3();
  const { uploadFile } = useIPFS();
  const navigate = useNavigate();
  const [status, setStatus] = useState<JobStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const postJob = async (jobData: { title: string; description: string; budget: string; milestones: { description: string; amount: string }[] }) => {
    if (!signer) {
      setError("Wallet not connected.");
      return;
    }
    setStatus('uploading');
    setError(null);
    try {
      const blob = new Blob([JSON.stringify(jobData)], { type: 'application/json' });
      const file = new File([blob], 'job.json');
      const ipfsHash = await uploadFile(file);
      if (!ipfsHash) throw new Error("Failed to upload job details to IPFS.");

      setStatus('signing');
      const contract = new Contract(JOB_MARKET_ADDRESS, JobMarketABI, signer);
      const tx = await contract.postJob(ipfsHash);
      await tx.wait();
      
      setStatus('success');
      setTimeout(() => navigate('/market'), 1500);

    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setStatus('error');
    }
  };

  const applyToJob = async (jobId: number, applicationText: string) => {
    if (!signer) {
        setError("Wallet not connected.");
        return;
    }
    setStatus('uploading');
    setError(null);
    try {
        const applicationData = { proposal: applicationText };
        const blob = new Blob([JSON.stringify(applicationData)], { type: 'application/json' });
        const file = new File([blob], 'application.json');
        const ipfsHash = await uploadFile(file);
        if (!ipfsHash) throw new Error("Failed to upload application to IPFS.");

        setStatus('signing');
        const contract = new Contract(JOB_MARKET_ADDRESS, JobMarketABI, signer);
        const tx = await contract.applyToJob(jobId, ipfsHash);
        await tx.wait();

        setStatus('success');
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(errorMessage);
        setStatus('error');
    }
  };
  
  const selectWinner = async (jobId: number, freelancerAddress: string, milestones: { description: string; amount: string }[]) => {
    if (!signer) {
        setError("Wallet not connected.");
        return;
    }
    setStatus('signing');
    setError(null);
    try {
        const contract = new Contract(JOB_MARKET_ADDRESS, JobMarketABI, signer);
        const descriptions = milestones.map(m => m.description);
        const amounts = milestones.map(m => parseEther(m.amount));
        
        const tx = await contract.selectWinner(jobId, freelancerAddress, descriptions, amounts);
        await tx.wait(); // <-- Removed unused 'receipt' variable

        // In a full implementation, you'd parse the receipt to get the new escrow address
        // and then navigate to that project page.
        setStatus('success');
        navigate('/dashboard'); // Navigate to dashboard on success for now

    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
        setError(errorMessage);
        setStatus('error');
    }
  };

  return { status, error, postJob, applyToJob, selectWinner };
};