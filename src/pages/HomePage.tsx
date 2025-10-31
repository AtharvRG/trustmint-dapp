// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ArrowRightIcon, ShieldCheckIcon, WalletIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import Button from '../components/common/Button';

const HomePage = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="space-y-32 md:space-y-48 overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.section
        className="text-center pt-16 md:pt-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold font-display tracking-tight">
          The Foundation of Trust
          <br />
          for <span className="text-brand-primary">Freelance Excellence</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-text-secondary">
          TrustMint replaces uncertainty with cryptographic truth. Secure your freelance agreements on the blockchain with our automated, transparent escrow service.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-10 flex justify-center items-center gap-4">
          <Link to="/create">
            <Button variant="primary">
              Create Project <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/market">
            <Button variant="secondary">
              Explore Marketplace
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 variants={itemVariants} className="text-4xl font-bold font-display">Why TrustMint?</motion.h2>
        <motion.p variants={itemVariants} className="max-w-2xl mx-auto mt-4 text-text-secondary">
          We provide the essential tools for secure and transparent collaboration on-chain.
        </motion.p>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<ShieldCheckIcon className="w-8 h-8 text-brand-primary" />}
            title="Secure Escrow"
            description="Funds are locked in a smart contract and only released upon milestone approval. No chargebacks, no delays."
          />
          <FeatureCard
            icon={<DocumentCheckIcon className="w-8 h-8 text-brand-primary" />}
            title="Milestone Management"
            description="Break down projects into clear, manageable milestones. Submit work and approve payments with on-chain transparency."
          />
          <FeatureCard
            icon={<WalletIcon className="w-8 h-8 text-brand-primary" />}
            title="Decentralized Identity"
            description="Build your on-chain reputation. Your work history is permanent and verifiable, belonging only to you."
          />
        </div>
      </motion.section>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: JSX.Element; title: string; description: string }) => (
  <motion.div
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    }}
    className="bg-dark-secondary p-8 rounded-lg border border-border text-left"
  >
    {icon}
    <h3 className="text-xl font-bold mt-4">{title}</h3>
    <p className="text-text-secondary mt-2">{description}</p>
  </motion.div>
);

export default HomePage;