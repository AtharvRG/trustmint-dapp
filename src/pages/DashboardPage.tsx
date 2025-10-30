// src/pages/DashboardPage.tsx
import { useUser } from '../hooks/useUser';
import { useUserProjects, ProjectSummary } from '../hooks/useUserProjects';
import { useWeb3 } from '../hooks/useWeb3';
import { Link } from 'react-router-dom';
import { formatEther } from 'ethers';
import { ContractState } from '../types/escrow';

const getStatusText = (state: ContractState) => {
  return ContractState[state]?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown';
};
const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const DashboardPage = () => {
  const { profile } = useUser();
  const { projects, isLoading } = useUserProjects();
  const { address } = useWeb3();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {profile?.role === 1 /* Client */ && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Client Dashboard</h1>
            <Link to="/create">
              <button className="bg-brand-primary text-dark-primary font-bold py-2 px-5 rounded-md transition-all duration-300 hover:bg-opacity-90">
                + New Project
              </button>
            </Link>
          </div>
          <ProjectList projects={projects} currentUserAddress={address} />
        </div>
      )}
      {profile?.role === 2 /* Freelancer */ && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Freelancer Dashboard</h1>
          <ProjectList projects={projects} currentUserAddress={address} />
        </div>
      )}
    </div>
  );
};

const ProjectList = ({ projects, currentUserAddress }: { projects: ProjectSummary[], currentUserAddress: string | undefined }) => {
  if (!currentUserAddress) return null; // Guard against undefined address
  if (projects.length === 0) {
    return <div className="bg-dark-secondary p-8 rounded-lg text-center text-text-secondary">You have no active projects.</div>;
  }
  return (
    <div className="bg-dark-secondary rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-4 font-bold p-4 border-b border-border text-text-secondary text-sm">
        <div>Project Contract</div>
        <div>Your Role</div>
        <div>Total Value</div>
        <div>Status</div>
      </div>
      {projects.map(p => (
        <Link to={`/project/${p.address}`} key={p.address} className="grid grid-cols-4 p-4 border-b border-border hover:bg-dark-primary transition-colors items-center">
          <div className="font-mono text-brand-accent">{formatAddress(p.address)}</div>
          <div>{p.client.toLowerCase() === currentUserAddress.toLowerCase() ? 'Client' : 'Freelancer'}</div>
          <div>{formatEther(p.totalAmount)} ETH</div>
          <div><span className="bg-dark-primary px-2 py-1 rounded-md text-xs">{getStatusText(p.currentState)}</span></div>
        </Link>
      ))}
    </div>
  );
};

export default DashboardPage;