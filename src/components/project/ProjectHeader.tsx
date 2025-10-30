// src/components/project/ProjectHeader.tsx
import { ContractState, EscrowDetails } from '../../types/escrow'; // <-- Import from centralized types

interface ProjectHeaderProps {
  details: EscrowDetails;
  contractAddress: string;
}

const getStatusInfo = (state: ContractState) => {
  // ... (rest of function is identical)
  switch (state) {
    case ContractState.Created:
      return { text: 'Awaiting Funding', color: 'bg-yellow-500' };
    case ContractState.Funded:
      return { text: 'Funded & Ready', color: 'bg-blue-500' };
    case ContractState.InProgress:
      return { text: 'In Progress', color: 'bg-brand-primary' };
    case ContractState.Disputed:
      return { text: 'Disputed', color: 'bg-red-600' };
    case ContractState.Complete:
      return { text: 'Complete', color: 'bg-green-500' };
    default:
      return { text: 'Unknown', color: 'bg-gray-500' };
  }
};

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const ProjectHeader = ({ details, contractAddress }: ProjectHeaderProps) => {
  const status = getStatusInfo(details.currentState);

  return (
    <div className="bg-dark-secondary p-6 rounded-lg border border-border shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Project Agreement</h1>
          <a
            href={`https://sepolia.etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-brand-accent hover:underline mt-1 inline-block"
          >
            {contractAddress}
          </a>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-dark-primary px-4 py-2 rounded-md border border-border">
          <span className={`w-3 h-3 rounded-full ${status.color}`}></span>
          <span className="font-semibold text-text-primary">{status.text}</span>
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text-secondary">Client</h2>
          <p className="font-mono text-text-primary">{formatAddress(details.client)}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-text-secondary">Freelancer</h2>
          <p className="font-mono text-text-primary">{formatAddress(details.freelancer)}</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-text-secondary">Total Value</h2>
          <p className="font-bold text-2xl text-brand-primary">{details.totalAmount} ETH</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;