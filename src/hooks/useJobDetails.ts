// src/hooks/useJobDetails.ts
// Corrected the 'any' type.
import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { Contract } from 'ethers';
import { JOB_MARKET_ADDRESS } from '../constants';
import JobMarketABI from '../contracts/JobMarket.json';
import { JobDetails } from './useJobMarket';
import { Profile } from '../contexts/user-context-definition';

interface RawApplication {
  freelancer: string;
  ipfsHash: string;
}

export interface EnrichedApplication {
  freelancerAddress: string;
  proposal: string;
  freelancerProfile: Profile | null;
}

export const useJobDetails = (jobId: string | undefined) => {
  const { provider } = useWeb3();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [applications, setApplications] = useState<EnrichedApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!provider || !jobId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const contract = new Contract(JOB_MARKET_ADDRESS, JobMarketABI, provider);
      const jobData = await contract.jobs(jobId);
      if (jobData.client === '0x0000000000000000000000000000000000000000') {
        throw new Error("Job not found.");
      }
      const ipfsResponse = await fetch(`https://ipfs.io/ipfs/${jobData.ipfsHash}`);
      const ipfsData = await ipfsResponse.json();
      const fullJobDetails: JobDetails = { id: Number(jobId), client: jobData.client, state: Number(jobData.state), ...ipfsData };
      setJob(fullJobDetails);

      const rawApplications: RawApplication[] = await contract.getApplicationsForJob(jobId);
      
      const enrichedApps = await Promise.all(
        rawApplications.map(async (app: RawApplication): Promise<EnrichedApplication> => {
          const proposalResponse = await fetch(`https://ipfs.io/ipfs/${app.ipfsHash}`);
          const proposalData = await proposalResponse.json();
          return {
            freelancerAddress: app.freelancer,
            proposal: proposalData.proposal,
            freelancerProfile: null // Profile enrichment is a future step
          };
        })
      );
      setApplications(enrichedApps);
    } catch (e: unknown) {
      console.error(`Failed to fetch details for job ${jobId}:`, e);
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [provider, jobId]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  return { job, applications, isLoading, error, refetchDetails: fetchDetails };
};