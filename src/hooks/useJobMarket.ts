// src/hooks/useJobMarket.ts
import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { Contract } from 'ethers';
import { JOB_MARKET_ADDRESS } from '../constants';
import JobMarketABI from '../contracts/JobMarket.json';

// Define a type for the data returned from the smart contract's JobQuery struct
interface JobQueryResult {
  id: bigint; // Comes back as BigInt
  client: string;
  ipfsHash: string;
}

export interface JobDetails {
  id: number;
  client: string;
  state: number;
  title: string;
  description: string;
  budget: string;
  milestones: { description: string; amount: string }[];
}

export const useJobMarket = () => {
    const { provider } = useWeb3();
    const [jobs, setJobs] = useState<JobDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchJobs = useCallback(async () => {
        if (!provider) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const contract = new Contract(JOB_MARKET_ADDRESS, JobMarketABI, provider);
            const openJobsResult: JobQueryResult[] = await contract.getOpenJobs();

            const jobsWithIpfsData = await Promise.all(
                openJobsResult.map(async (job: JobQueryResult) => {
                    const response = await fetch(`https://ipfs.io/ipfs/${job.ipfsHash}`);
                    const ipfsData = await response.json();
                    return {
                        id: Number(job.id),
                        client: job.client,
                        state: 0, // We know it's open
                        ...ipfsData
                    };
                })
            );
            setJobs(jobsWithIpfsData.reverse());
        } catch (error) {
            console.error("Failed to fetch jobs from market:", error);
            setJobs([]); // Clear jobs on error
        } finally {
            setIsLoading(false);
        }
    }, [provider]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]); // Correct dependency

    return { jobs, isLoading, refetchJobs: fetchJobs };
};