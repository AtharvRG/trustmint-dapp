// src/pages/MarketplacePage.tsx
import { useJobMarket, JobDetails } from '../hooks/useJobMarket';
import { useUser } from '../hooks/useUser';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';

const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

const MarketplacePage = () => {
  const { jobs, isLoading } = useJobMarket();
  const { profile } = useUser();

  if (isLoading) {
    return <div>Loading job market...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Job Market</h1>
        {profile?.role === 1 /* Client */ && (
          <Link to="/market/post-job">
            <Button>+ Post a Job</Button>
          </Link>
        )}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center bg-dark-secondary p-12 rounded-lg">
          <h2 className="text-2xl font-bold">The market is quiet...</h2>
          <p className="text-text-secondary mt-2">There are no open jobs right now. Clients can post a new job to find talent.</p>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </motion.div>
      )}
    </motion.div>
  );
};

const JobCard = ({ job }: { job: JobDetails }) => (
  <motion.div variants={itemVariants}>
    <Link to={`/market/job/${job.id}`} className="block bg-dark-secondary p-6 rounded-lg border border-border hover:border-brand-primary transition-colors duration-200 hover:shadow-glow-primary">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-text-primary">{job.title}</h3>
        <span className="bg-brand-primary/10 text-brand-primary font-bold py-1 px-3 rounded-full text-sm">{job.budget} ETH</span>
      </div>
      <p className="text-text-secondary mt-2 text-sm">Posted by: <span className="font-mono">{formatAddress(job.client)}</span></p>
      <p className="text-text-primary mt-4 line-clamp-2">{job.description}</p>
    </Link>
  </motion.div>
);

export default MarketplacePage;