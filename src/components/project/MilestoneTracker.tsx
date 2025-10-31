// src/components/project/MilestoneTracker.tsx
import { useState, useRef, ChangeEvent } from 'react';
import { Milestone, MilestoneState, ContractState } from '../../types/escrow';
import { useIPFS } from '../../hooks/useIPFS';
import Button from '../common/Button';
// Corrected imports: Removed ExclamationTriangleIcon
import { CheckCircleIcon, LockClosedIcon, DocumentArrowDownIcon, ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  isClient: boolean;
  isFreelancer: boolean;
  contractState: ContractState;
  approveMilestone: (index: number) => Promise<void>;
  submitWork: (index: number, ipfsCid: string) => Promise<void>;
  rejectMilestone: (index: number, reason: string) => Promise<void>;
  actionStatus: { [key: string]: 'idle' | 'pending' | 'error' };
}

// This component is now correct because the types from escrow.ts are updated.
const MilestoneItem = ({ milestone, index, ...props }: { milestone: Milestone, index: number } & MilestoneTrackerProps) => {
  const [ipfsCid, setIpfsCid] = useState('');
  const { status: ipfsStatus, uploadFile } = useIPFS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const hash = await uploadFile(file);
      if (hash) setIpfsCid(hash);
    }
  };

  const handleReject = async () => {
    await props.rejectMilestone(index, rejectionReason);
    setIsRejecting(false);
  };

  const stateInfo = {
    [MilestoneState.Pending]: { text: 'Pending', icon: <CheckCircleIcon className="text-text-secondary" /> },
    [MilestoneState.Submitted]: { text: 'Work Submitted', icon: <CheckCircleIcon className="text-blue-400" /> },
    [MilestoneState.Approved]: { text: 'Approved', icon: <CheckCircleIcon className="text-yellow-400" /> },
    [MilestoneState.Paid]: { text: 'Paid & Complete', icon: <CheckCircleIcon className="text-brand-primary" /> },
    [MilestoneState.Rejected]: { text: 'Revisions Requested', icon: <XCircleIcon className="text-red-500" /> },
  };
  const currentStatus = stateInfo[milestone.state];

  const renderFreelancerActions = () => {
    if (!props.isFreelancer || (milestone.state !== MilestoneState.Pending && milestone.state !== MilestoneState.Rejected)) return null;
    return (
      <div className="mt-4 p-4 bg-dark-primary rounded-md border border-border space-y-3">
        {milestone.state === MilestoneState.Rejected && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md">
            <h4 className="font-bold text-red-400">Client Feedback:</h4>
            <p className="text-text-secondary text-sm italic">"{milestone.rejectionReason}"</p>
          </div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        {ipfsStatus === 'idle' && <Button variant="secondary" onClick={() => fileInputRef.current?.click()}><ArrowUpTrayIcon className="h-5 w-5 mr-2" />Upload Work File</Button>}
        {ipfsStatus === 'uploading' && <p className="text-text-secondary">Uploading to IPFS...</p>}
        {ipfsStatus === 'success' && ipfsCid && <p className="text-green-400 font-mono text-xs break-all">File ready: {ipfsCid}</p>}
        <Button onClick={() => props.submitWork(index, ipfsCid)} isLoading={props.actionStatus[`submitWork-${index}`] === 'pending'} disabled={!ipfsCid}>
          {milestone.state === MilestoneState.Rejected ? 'Resubmit Work' : 'Submit Work'}
        </Button>
      </div>
    );
  };

  const renderClientActions = () => {
    if (!props.isClient || milestone.state !== MilestoneState.Submitted) return null;
    return (
      <div className="mt-4 p-4 bg-dark-primary rounded-md border border-border">
        <p className="text-text-secondary text-sm">Review the submitted work and take action.</p>
        <div className="flex items-center space-x-2 mt-2">
          <DocumentArrowDownIcon className="h-4 w-4 text-brand-accent"/>
          <a href={`https://ipfs.io/ipfs/${milestone.ipfsCid}`} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-brand-accent hover:underline break-all">{milestone.ipfsCid}</a>
        </div>
        <AnimatePresence>
          {isRejecting && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-4">
              <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={3}
                className="w-full bg-dark-secondary rounded-md p-2 text-text-primary border border-border"
                placeholder="Provide clear, constructive feedback for the revision..."
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => props.approveMilestone(index)} isLoading={props.actionStatus[`approveMilestone-${index}`] === 'pending'}>Approve & Release Payment</Button>
          {isRejecting ? (
            <Button variant="danger" onClick={handleReject} isLoading={props.actionStatus[`rejectMilestone-${index}`] === 'pending'} disabled={!rejectionReason}>Confirm Revision Request</Button>
          ) : (
            <Button variant="secondary" onClick={() => setIsRejecting(true)}>Request Revision</Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative pl-8">
      <div className={`absolute left-0 top-1 h-full w-px bg-border ${index === props.milestones.length - 1 ? 'h-0' : ''}`}></div>
      <div className={`absolute left-[-1px] top-[5px] w-4 h-4 rounded-full ${milestone.state === MilestoneState.Paid ? 'bg-brand-primary' : 'bg-border'}`}></div>
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-text-primary">{milestone.description}</h3>
        <span className="font-bold text-xl text-text-primary">{milestone.amount} ETH</span>
      </div>
      <div className="flex items-center space-x-2 mt-1 text-sm font-semibold">
        <div className="h-5 w-5">{currentStatus.icon}</div>
        <span>{currentStatus.text}</span>
      </div>
      {renderFreelancerActions()}
      {renderClientActions()}
    </div>
  );
};

export const MilestoneTracker = (props: MilestoneTrackerProps) => {
  const isLocked = props.contractState < ContractState.Funded;
  return (
    <div className="bg-dark-secondary p-6 rounded-lg border border-border shadow-lg">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Project Milestones</h2>
      {isLocked && <div className="p-4 rounded-md bg-dark-primary border border-border flex items-center space-x-3 mb-6"><LockClosedIcon className="h-6 w-6 text-yellow-500" /><p className="text-yellow-400 font-semibold">Milestones are locked until the contract is funded.</p></div>}
      <div className="space-y-8">{props.milestones.map((milestone, index) => <MilestoneItem key={index} milestone={milestone} index={index} {...props} />)}</div>
    </div>
  );
};

export default MilestoneTracker;