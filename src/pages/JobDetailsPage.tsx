// src/pages/JobDetailsPage.tsx
import { useParams } from 'react-router-dom';
import { useJobMarket } from '../hooks/useJobMarket';
import { useUser } from '../hooks/useUser';
import Button from '../components/common/Button';
import { useJobManagement } from '../hooks/useJobManagement';
import { useWeb3 } from '../hooks/useWeb3';

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const JobDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { address } = useWeb3();
    const { jobs, isLoading: isLoadingJobs } = useJobMarket();
    const { profile } = useUser();
    const { status, applyToJob } = useJobManagement(); // Removed unused variables

    const job = jobs.find(j => j.id === Number(id));

    if (isLoadingJobs) {
        return <div>Loading job details...</div>;
    }

    if (!job) {
        return <div>Job not found.</div>;
    }

    const isClientOfThisJob = address?.toLowerCase() === job.client.toLowerCase();
    const isFreelancer = profile?.role === 2;
    
    // A full implementation would fetch applicants and check if the current user is among them
    const hasApplied = false; 

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-dark-secondary p-8 rounded-lg border border-border">
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <span className="text-2xl font-bold text-brand-primary">{job.budget} ETH</span>
                </div>
                <p className="text-text-secondary mt-1">Posted by {formatAddress(job.client)}</p>
            </div>

            <div className="bg-dark-secondary p-8 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Job Description</h2>
                <p className="text-text-secondary whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="bg-dark-secondary p-8 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Milestones</h2>
                <ul className="list-disc list-inside space-y-2">
                    {job.milestones.map((m, i) => (
                        <li key={i} className="text-text-primary">{m.description} - <span className="font-bold">{m.amount} ETH</span></li>
                    ))}
                </ul>
            </div>
            
            {isFreelancer && !hasApplied && (
                <div className="bg-dark-secondary p-8 rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-4">Apply for this Job</h2>
                    {/* A real implementation would have a textarea for the proposal */}
                    <Button onClick={() => applyToJob(job.id, "This is my proposal...")} isLoading={status === 'signing' || status === 'uploading'}>
                        Submit Application
                    </Button>
                </div>
            )}
            
            {isClientOfThisJob && (
                <div className="bg-dark-secondary p-8 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Applicants</h2>
                    <p className="text-text-secondary">Applicant list feature coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default JobDetailsPage;