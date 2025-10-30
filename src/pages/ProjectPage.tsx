// src/pages/ProjectPage.tsx
import { useParams } from 'react-router-dom';
import { useEscrowContract } from '../hooks/useEscrowContract';
import Button from '../components/common/Button';
import ProjectHeader from '../components/project/ProjectHeader';
import MilestoneTracker from '../components/project/MilestoneTracker';

const ProjectPage = () => {
  const { address } = useParams<{ address: string }>();
  const { 
    details, 
    isLoading, 
    error, 
    fundContract,
    approveMilestone,
    submitWork,
    actionStatus, 
    isClient,
    isFreelancer
  } = useEscrowContract(address);


  const handleApprove = async (index: number) => {
    await approveMilestone(index);
  }

  const handleSubmitWork = async (index: number, ipfsCid: string) => {
    await submitWork(index, ipfsCid);
  }

  if (isLoading) {
    // A more elegant loading state
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-center p-10 text-red-400 bg-dark-secondary rounded-lg border border-red-800">{error}</div>;
  }

  if (!details) {
    return <div className="text-center p-10">Project not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ProjectHeader details={details} contractAddress={address!} />

      {details.currentState === 0 && isClient && ( // State: Created
        <div className="p-6 bg-dark-secondary rounded-md border border-brand-accent shadow-lg">
          <h3 className="font-bold text-xl text-brand-primary">Action Required: Fund Escrow</h3>
          <p className="text-text-secondary mt-2">
            To begin the project, you must deposit the total amount of {details.totalAmount} ETH into the secure escrow contract. The funds will be held safely until you approve each milestone.
          </p>
          <Button 
            className="mt-4"
            onClick={fundContract}
            isLoading={actionStatus['fund'] === 'pending'}
          >
            Fund {details.totalAmount} ETH Now
          </Button>
        </div>
      )}

      <MilestoneTracker
        milestones={details.milestones}
        isClient={isClient}
        isFreelancer={isFreelancer}
        contractState={details.currentState}
        approveMilestone={handleApprove}
        submitWork={handleSubmitWork}
        actionStatus={actionStatus}
      />
    </div>
  );
};

export default ProjectPage;