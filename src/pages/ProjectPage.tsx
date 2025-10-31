// src/pages/ProjectPage.tsx
// This component is now correct because the types from escrow.ts are updated.
import { useParams, useNavigate } from 'react-router-dom';
import { useEscrowContract } from '../hooks/useEscrowContract';
import Button from '../components/common/Button';
import ProjectHeader from '../components/project/ProjectHeader';
import MilestoneTracker from '../components/project/MilestoneTracker';
import { ContractState } from '../types/escrow';

const ProjectPage = () => {
  const { address } = useParams<{ address: string }>();
  const navigate = useNavigate();
  const { 
    details, isLoading, error, fundContract, acceptAssignment, declineAssignment,
    approveMilestone, submitWork, rejectMilestone, actionStatus, isClient, isFreelancer 
  } = useEscrowContract(address);

  if (isLoading) return <div>Loading Project...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!details) return <div>Project not found.</div>;

  const handleDecline = async () => {
    await declineAssignment();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <ProjectHeader details={details} contractAddress={address!} />

      {details.currentState === ContractState.PendingAcceptance && isFreelancer && (
        <div className="p-6 bg-dark-secondary rounded-md border border-brand-accent">
          <h3 className="font-bold text-xl text-brand-primary">New Project Proposal</h3>
          <p className="text-text-secondary mt-2">The client has proposed a new project for you. Review the terms and milestones below. You must accept to proceed.</p>
          <div className="flex gap-4 mt-4">
            <Button onClick={acceptAssignment} isLoading={actionStatus['acceptAssignment'] === 'pending'}>Accept Project</Button>
            <Button variant="danger" onClick={handleDecline} isLoading={actionStatus['declineAssignment'] === 'pending'}>Decline</Button>
          </div>
        </div>
      )}

      {details.currentState === ContractState.Created && isClient && (
        <div className="p-6 bg-dark-secondary rounded-md border border-brand-accent">
          <h3 className="font-bold text-xl text-brand-primary">Action Required: Fund Escrow</h3>
          <p className="text-text-secondary mt-2">The freelancer has accepted. To begin the project, deposit {details.totalAmount} ETH into the secure escrow contract.</p>
          <Button className="mt-4" onClick={fundContract} isLoading={actionStatus['fund'] === 'pending'}>Fund {details.totalAmount} ETH Now</Button>
        </div>
      )}

      <MilestoneTracker
        milestones={details.milestones}
        isClient={isClient}
        isFreelancer={isFreelancer}
        contractState={details.currentState}
        approveMilestone={approveMilestone}
        submitWork={submitWork}
        rejectMilestone={rejectMilestone}
        actionStatus={actionStatus}
      />
    </div>
  );
};

export default ProjectPage;