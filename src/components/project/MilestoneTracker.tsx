// src/components/project/MilestoneTracker.tsx
import { useState, useRef, ChangeEvent } from 'react';
import { CheckCircleIcon, LockClosedIcon, DocumentArrowDownIcon, ArrowUpTrayIcon, XCircleIcon } from '@heroicons/react/24/solid';
import Button from '../common/Button';
import { Milestone, MilestoneState, ContractState } from '../../types/escrow';
import { useIPFS } from '../../hooks/useIPFS';

interface MilestoneTrackerProps {
  milestones: Milestone[];
  isClient: boolean;
  isFreelancer: boolean;
  contractState: ContractState;
  approveMilestone: (index: number) => Promise<void>;
  submitWork: (index: number, ipfsCid: string) => Promise<void>;
  actionStatus: { [key: string]: 'idle' | 'pending' | 'error' };
}

const MilestoneItem = ({ milestone, index, milestones, ...props }: { milestone: Milestone, index: number, milestones: Milestone[] } & Omit<MilestoneTrackerProps, 'milestones'>) => {
  const [ipfsCid, setIpfsCid] = useState('');
  const { status: ipfsStatus, ipfsHash, uploadFile, error: ipfsError } = useIPFS();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const hash = await uploadFile(file);
      if (hash) {
        setIpfsCid(hash);
      }
    }
  };

  const isFunded = props.contractState !== ContractState.Created;
  const stateInfo = {
    [MilestoneState.Pending]: { text: 'Pending', iconColor: 'text-text-secondary' },
    [MilestoneState.Submitted]: { text: 'Work Submitted', iconColor: 'text-blue-400' },
    [MilestoneState.Approved]: { text: 'Approved', iconColor: 'text-yellow-400' },
    [MilestoneState.Paid]: { text: 'Paid & Complete', iconColor: 'text-brand-primary' },
  };
  
  const currentStatus = stateInfo[milestone.state];

  const renderAction = () => {
    if (!isFunded) return null;

    if (props.isFreelancer && milestone.state === MilestoneState.Pending) {
      return (
        <div className="mt-4 p-4 bg-dark-primary rounded-md border border-border space-y-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          
          {ipfsStatus === 'idle' && (
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
              <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
              Upload Work File
            </Button>
          )}

          {ipfsStatus === 'uploading' && (
            <div className="flex items-center space-x-2 text-text-secondary">
               <svg className="animate-spin h-5 w-5 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Uploading to IPFS...</span>
            </div>
          )}

          {ipfsStatus === 'error' && (
             <div className="flex items-center space-x-2 text-red-400">
               <XCircleIcon className="h-5 w-5"/>
               <span>Upload failed: {ipfsError}</span>
             </div>
          )}

          {ipfsStatus === 'success' && ipfsHash && (
            <div>
              <p className="text-sm text-text-secondary">File uploaded successfully:</p>
              <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-brand-accent hover:underline break-all">
                {ipfsHash}
              </a>
            </div>
          )}

          <Button 
            onClick={() => props.submitWork(index, ipfsCid)}
            isLoading={props.actionStatus[`submitWork-${index}`] === 'pending'}
            disabled={!ipfsCid || ipfsStatus !== 'success'}
          >
            Submit Work to Contract
          </Button>
        </div>
      );
    }

    if (props.isClient && milestone.state === MilestoneState.Submitted) {
      return (
        <div className="mt-4 p-4 bg-dark-primary rounded-md border border-border">
          <p className="text-text-secondary text-sm">The freelancer has submitted their work. Review and approve to release payment.</p>
          <div className="flex items-center space-x-2 mt-2">
            <DocumentArrowDownIcon className="h-4 w-4 text-brand-accent"/>
            <a href={`https://ipfs.io/ipfs/${milestone.ipfsCid}`} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-brand-accent hover:underline break-all">
              {milestone.ipfsCid}
            </a>
          </div>
          <Button 
            className="mt-4"
            onClick={() => props.approveMilestone(index)}
            isLoading={props.actionStatus[`approveMilestone-${index}`] === 'pending'}
          >
            Approve & Release {milestone.amount} ETH
          </Button>
        </div>
      );
    }
    
    return null;
  };

  return (
        <div className="relative pl-8">
          <div className={`absolute left-0 top-1 h-full w-px bg-border ${index === milestones.length - 1 ? 'h-0' : ''}`}></div>
      <div className={`absolute left-[-1px] top-[5px] w-4 h-4 rounded-full ${milestone.state === MilestoneState.Paid ? 'bg-brand-primary' : 'bg-border'}`}></div>
      
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-text-primary">{milestone.description}</h3>
        <span className="font-bold text-xl text-text-primary">{milestone.amount} ETH</span>
      </div>
      <div className="flex items-center space-x-2 mt-1">
        <CheckCircleIcon className={`h-5 w-5 ${currentStatus.iconColor}`} />
        <span className={`text-sm font-semibold ${currentStatus.iconColor}`}>{currentStatus.text}</span>
      </div>
      {renderAction()}
    </div>
  );
};

const MilestoneTracker = (props: MilestoneTrackerProps) => {
  const isLocked = props.contractState === ContractState.Created;

  return (
    <div className="bg-dark-secondary p-6 rounded-lg border border-border shadow-lg">
      <h2 className="text-2xl font-bold text-text-primary mb-6">Project Milestones</h2>
      {isLocked && (
        <div className="p-4 rounded-md bg-dark-primary border border-border flex items-center space-x-3 mb-6">
          <LockClosedIcon className="h-6 w-6 text-yellow-500" />
          <p className="text-yellow-400 font-semibold">Milestones are locked until the client funds the contract.</p>
        </div>
      )}
      <div className="space-y-8">
        {props.milestones.map((milestone, index) => (
          <MilestoneItem key={index} milestone={milestone} index={index} {...props} />
        ))}
      </div>
    </div>
  );
};

export default MilestoneTracker;