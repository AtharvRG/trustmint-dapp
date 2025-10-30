// src/pages/MarketplacePage.tsx
import { useJobMarket, JobDetails } from '../hooks/useJobMarket';
import { useUser } from '../hooks/useUser';
import { Link } from 'react-router-dom';

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const MarketplacePage = () => {
  const { jobs, isLoading } = useJobMarket();
  const { profile } = useUser();

  if (isLoading) {
    return <div>Loading job market...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Job Market</h1>
        {profile?.role === 1 /* Client */ && (
          <Link to="/market/post-job">
            <button className="bg-brand-primary text-dark-primary font-bold py-2 px-5 rounded-md transition-all duration-300 hover:bg-opacity-90">
              + Post a Job
            </button>
          </Link>
        )}
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center bg-dark-secondary p-12 rounded-lg">
          <h2 className="text-2xl font-bold">The market is quiet...</h2>
          <p className="text-text-secondary mt-2">There are no open jobs right now. Clients can post a new job to find talent.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
};

const JobCard = ({ job }: { job: JobDetails }) => (
  <Link to={`/market/job/${job.id}`} className="block bg-dark-secondary p-6 rounded-lg border border-border hover:border-brand-primary transition-colors">
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold text-text-primary">{job.title}</h3>
      <span className="bg-brand-primary/10 text-brand-primary font-bold py-1 px-3 rounded-full text-sm">{job.budget} ETH</span>
    </div>
    <p className="text-text-secondary mt-2 text-sm">Posted by: <span className="font-mono">{formatAddress(job.client)}</span></p>
    <p className="text-text-primary mt-4 line-clamp-2">{job.description}</p>
  </Link>
);

export default MarketplacePage;