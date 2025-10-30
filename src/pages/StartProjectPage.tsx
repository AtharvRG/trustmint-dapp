// src/pages/StartProjectPage.tsx
import { Link } from 'react-router-dom';
import { UserIcon, MegaphoneIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const StartProjectPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-text-primary">How would you like to hire?</h1>
        <p className="text-lg text-text-secondary mt-2">Choose the path that best suits your project's needs.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ChoiceCard
          icon={<UserIcon />}
          title="Direct Hire"
          description="You have already chosen a freelancer. Create a secure escrow contract directly with them by providing their wallet address."
          linkTo="/create/direct"
          buttonText="Start Direct Hire"
        />
        <ChoiceCard
          icon={<MegaphoneIcon />}
          title="Post to Marketplace"
          description="Post your job to our open marketplace to receive proposals from our pool of talented, verified freelancers."
          linkTo="/market/post-job"
          buttonText="Post a Job"
        />
      </div>
    </motion.div>
  );
};

// A reusable card component for the choices
const ChoiceCard = ({ icon, title, description, linkTo, buttonText }: { icon: JSX.Element, title: string, description: string, linkTo: string, buttonText: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    className="bg-dark-secondary p-8 rounded-lg border border-border flex flex-col"
  >
    <div className="w-12 h-12 text-brand-primary">
      {icon}
    </div>
    <h2 className="text-2xl font-bold mt-4 text-text-primary">{title}</h2>
    <p className="text-text-secondary mt-2 flex-grow">{description}</p>
    <Link to={linkTo} className="mt-6">
      <button className="w-full bg-brand-primary text-dark-primary font-bold py-2 px-5 rounded-md transition-all duration-300 hover:bg-opacity-90">
        {buttonText}
      </button>
    </Link>
  </motion.div>
);

export default StartProjectPage;