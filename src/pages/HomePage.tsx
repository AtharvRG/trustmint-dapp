// src/pages/HomePage.tsx
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion'; // <-- Import the Variants type
import { ArrowRightIcon, ShieldCheckIcon, WalletIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  // By applying the 'Variants' type, we get full type-checking and autocompletion.
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        ease: 'easeOut', // <-- TypeScript now understands this is a valid Easing type
      },
    },
  };

  return (
    <div className="space-y-32 md:space-y-48 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        className="text-center pt-16 md:pt-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold text-text-primary tracking-tight">
          The Foundation of Trust
          <br />
          for <span className="text-brand-primary">Freelance Excellence</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-text-secondary">
          TrustMint replaces uncertainty with cryptographic truth. Secure your freelance agreements on the blockchain with our automated, transparent escrow service.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-10 flex justify-center items-center gap-4">
          <Link to="/create">
            <button className="bg-brand-primary text-dark-primary font-bold py-3 px-8 rounded-md transition-all duration-300 ease-in-out hover:bg-opacity-90 hover:shadow-glow-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-75">
              Create Project
            </button>
          </Link>
          <Link to="#how-it-works" className="flex items-center font-semibold text-text-primary hover:text-brand-primary transition-colors">
            Learn More <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        id="how-it-works"
        className="max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary">Simple Steps, Absolute Security</h2>
          <p className="text-lg text-text-secondary mt-2">A process designed for clarity and confidence.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <motion.div variants={itemVariants} className="bg-dark-secondary p-8 rounded-lg border border-border">
            <DocumentCheckIcon className="w-12 h-12 mx-auto text-brand-accent" />
            <h3 className="text-xl font-bold mt-4">1. Define Terms</h3>
            <p className="text-text-secondary mt-2">Client and freelancer agree on milestones and payments, creating a smart contract agreement in minutes.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-dark-secondary p-8 rounded-lg border border-border">
            <WalletIcon className="w-12 h-12 mx-auto text-brand-accent" />
            <h3 className="text-xl font-bold mt-4">2. Fund Escrow</h3>
            <p className="text-text-secondary mt-2">The client securely deposits the total project funds into the smart contract. Work begins with confidence.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="bg-dark-secondary p-8 rounded-lg border border-border">
            <ShieldCheckIcon className="w-12 h-12 mx-auto text-brand-accent" />
            <h3 className="text-xl font-bold mt-4">3. Get Paid</h3>
            <p className="text-text-secondary mt-2">As the client approves milestones, funds are automatically and instantly released to the freelancer. No delays.</p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;