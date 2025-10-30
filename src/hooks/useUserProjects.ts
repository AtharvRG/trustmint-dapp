// src/hooks/useUserProjects.ts
import { useState, useEffect, useCallback } from 'react';
import { useWeb3 } from './useWeb3';
import { Contract } from 'ethers';
import { TRUSTMINT_FACTORY_ADDRESS } from '../constants';
import TrustMintFactoryABI from '../contracts/TrustMintFactory.json';
import EscrowABI from '../contracts/Escrow.json';

export interface ProjectSummary {
  address: string;
  client: string;
  freelancer: string;
  totalAmount: string;
  currentState: number;
}

export const useUserProjects = () => {
    const { provider, address } = useWeb3();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProjects = useCallback(async () => {
        if (!provider || !address) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const factory = new Contract(TRUSTMINT_FACTORY_ADDRESS, TrustMintFactoryABI, provider);
            
            // --- ARCHITECTURAL FIX: Direct contract call, no more getLogs ---
            const deployedEscrows = await factory.getDeployedEscrows();
            
            const projectSummaries = await Promise.all(
                deployedEscrows.map(async (escrowAddress: string): Promise<ProjectSummary | null> => {
                    try {
                        const escrowContract = new Contract(escrowAddress, EscrowABI, provider);
                        const details = await escrowContract.getContractDetails();
                        const client = details[0];
                        const freelancer = details[1];

                        // Only include projects relevant to the current user
                        if (client.toLowerCase() === address.toLowerCase() || freelancer.toLowerCase() === address.toLowerCase()) {
                            return {
                                address: escrowAddress,
                                client: client,
                                freelancer: freelancer,
                                totalAmount: details[2].toString(),
                                currentState: Number(details[4]),
                            };
                        }
                        return null;
                    } catch (e) { return null; }
                })
            );
            
            setProjects(projectSummaries.filter((p): p is ProjectSummary => p !== null).reverse());
        } catch (error) {
            console.error("Failed to fetch user projects:", error);
        } finally {
            setIsLoading(false);
        }
    }, [provider, address]);

    useEffect(() => { fetchProjects(); }, [fetchProjects]);

    return { projects, isLoading, refetchProjects: fetchProjects };
};