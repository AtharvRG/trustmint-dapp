// src/pages/JobDetailsPage.tsx
// Removed unused variables
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useUser } from '../hooks/useUser';
import { useJobDetails, EnrichedApplication } from '../hooks/useJobDetails';
import { useJobManagement } from '../hooks/useJobManagement';
import Button from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const JobDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const { address } = useWeb3();
    const { profile } = useUser();
    const { job, applications, isLoading, error: pageError } = useJobDetails(id);
    const { status, applyToJob, selectWinner } = useJobManagement();

    const [proposal, setProposal] = useState('');
    const [selectedWinner, setSelectedWinner] = useState<EnrichedApplication | null>(null);

    if (isLoading) return <div>Loading job details...</div>;
    if (pageError || !job) return <div className="text-red-400">Error: {pageError || "Job not found."}</div>;

    const isClientOfThisJob = address?.toLowerCase() === job.client.toLowerCase();
    const isFreelancer = profile?.role === 2;
    const hasApplied = applications.some(app => app.freelancerAddress.toLowerCase() === address?.toLowerCase());

    const handleSelectWinner = async () => {
        if (!selectedWinner || !id) return;
        await selectWinner(Number(id), selectedWinner.freelancerAddress, job.milestones);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-dark-secondary p-8 rounded-lg border border-border">
                <div className="flex justify-between items-start">
                    <h1 className="text-3xl font-bold">{job.title}</h1>
                    <span className="text-2xl font-bold text-brand-primary">{job.budget} ETH</span>
                </div>
                <p className="text-text-secondary mt-1">Posted by {formatAddress(job.client)}</p>
            </motion.div>

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
            
            {isFreelancer && job.state === 0 && (
                <div className="bg-dark-secondary p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-center">{hasApplied ? "You Have Applied" : "Apply for this Job"}</h2>
                    {hasApplied ? (
                        <p className="text-center text-green-400">Your application has been submitted. The client will be in touch if you are selected.</p>
                    ) : (
                        <div className="space-y-4">
                            <textarea value={proposal} onChange={e => setProposal(e.target.value)} rows={6}
                                className="w-full bg-dark-primary rounded-md p-3 text-text-primary border border-border focus:border-brand-primary focus:ring-brand-primary"
                                placeholder="Write a compelling proposal explaining why you're the best fit for this project."
                            />
                            <Button onClick={() => applyToJob(job.id, proposal)} isLoading={status === 'uploading' || status === 'signing'} disabled={!proposal}>
                                Submit Application
                            </Button>
                        </div>
                    )}
                </div>
            )}
            
            {isClientOfThisJob && job.state === 0 && (
                <div className="bg-dark-secondary p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Applicants ({applications.length})</h2>
                    {applications.length === 0 ? (
                        <p className="text-text-secondary">No one has applied yet. Check back later.</p>
                    ) : (
                        <div className="space-y-4">
                            {applications.map(app => (
                                <div key={app.freelancerAddress} className="bg-dark-primary p-4 rounded-lg border border-border">
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold font-mono">{formatAddress(app.freelancerAddress)}</p>
                                        <Button variant="secondary" onClick={() => setSelectedWinner(app)}>Select Winner</Button>
                                    </div>
                                    <p className="text-text-secondary mt-2 border-t border-border pt-2">{app.proposal}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {job.state !== 0 && (
                <div className="bg-dark-secondary p-8 rounded-lg text-center">
                    <h2 className="text-2xl font-bold">This job is now closed.</h2>
                    <p className="text-text-secondary mt-2">
                        {job.state === 1 ? 'A winner has been selected for this project.' : 'This job was canceled by the client.'}
                    </p>
                </div>
            )}
            
            <AnimatePresence>
                {selectedWinner && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setSelectedWinner(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-dark-secondary p-8 rounded-lg border border-border max-w-lg w-full"
                        >
                            <h2 className="text-2xl font-bold">Confirm Selection</h2>
                            <p className="text-text-secondary mt-4">
                                Are you sure you want to select <span className="font-mono text-brand-primary">{formatAddress(selectedWinner.freelancerAddress)}</span> as the winner?
                            </p>
                            <p className="text-text-secondary mt-2">This will create a new TrustMint escrow contract and lock the job posting. This action cannot be undone.</p>
                            <div className="flex justify-end gap-4 mt-8">
                                <Button variant="secondary" onClick={() => setSelectedWinner(null)}>Cancel</Button>
                                <Button onClick={handleSelectWinner} isLoading={status === 'signing'}>Confirm and Create Escrow</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobDetailsPage;