// src/pages/OnboardingPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../hooks/useWeb3';
import { useUser } from '../hooks/useUser'; // Corrected import path
import { Contract } from 'ethers';
import { USER_PROFILE_ADDRESS } from '../constants';
import UserProfileABI from '../contracts/UserProfile.json';
import { useIPFS } from '../hooks/useIPFS';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

type Role = 'Client' | 'Freelancer';
type Status = 'idle' | 'uploading' | 'signing' | 'success' | 'error';

export const OnboardingPage = () => {
  const { signer } = useWeb3();
  const { refetchProfile } = useUser();
  const { uploadFile } = useIPFS();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!signer || !role || !name) {
      setError("Name is a required field.");
      return;
    }
    setStatus('uploading');
    setError('');

    try {
      const profileData = role === 'Client'
        ? { name }
        : {
            name,
            description,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            resumeCid: ''
          };
      
      const blob = new Blob([JSON.stringify(profileData)], { type: 'application/json' });
      const file = new File([blob], 'profile.json');
      const ipfsHash = await uploadFile(file);

      if (!ipfsHash) {
        throw new Error("Failed to upload profile data to IPFS.");
      }

      setStatus('signing');
      const contract = new Contract(USER_PROFILE_ADDRESS, UserProfileABI, signer);
      const roleEnum = role === 'Client' ? 1 : 2;
      const tx = await contract.register(roleEnum, ipfsHash);
      await tx.wait();
      
      setStatus('success');
      refetchProfile();
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (e: unknown) {
      console.error("Registration failed:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(errorMessage);
      setStatus('error');
    }
  };

  const renderStatusMessage = () => {
    switch (status) {
      case 'uploading': return "Uploading profile to IPFS...";
      case 'signing': return "Please confirm the transaction in your wallet...";
      case 'success': return "Profile created! Redirecting...";
      case 'error': return `Error: ${error}`;
      default: return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto bg-dark-secondary p-8 rounded-lg border border-border"
    >
      {step === 1 && (
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Welcome to TrustMint</h1>
          <p className="text-text-secondary mt-2 mb-8">To get started, please choose your primary role on the platform.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoleCard icon={<UserGroupIcon />} title="I'm a Client" description="I want to hire top talent for my projects." onSelect={() => { setRole('Client'); setStep(2); }} />
            <RoleCard icon={<BriefcaseIcon />} title="I'm a Freelancer" description="I'm looking for exciting projects to work on." onSelect={() => { setRole('Freelancer'); setStep(2); }} />
          </div>
        </div>
      )}

      {step === 2 && role && (
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tell Us About Yourself</h1>
          <p className="text-text-secondary mt-2 mb-8">This information will be public on your profile.</p>
          <div className="space-y-6">
            <Input label="Your Name or Company Name" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Jane Doe" />
            {role === 'Freelancer' && (
              <>
                <Input label="Short Bio / Headline" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Senior Smart Contract Developer" />
                <Input label="Skills (comma-separated)" id="skills" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g., Solidity, React, TypeScript" />
              </>
            )}
          </div>
          <div className="mt-8 flex items-center justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleRegister} isLoading={status === 'uploading' || status === 'signing'} disabled={!name}>
              {status === 'signing' ? 'Check Wallet...' : 'Create Profile'}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-text-secondary h-5">
            {renderStatusMessage()}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const RoleCard = ({ icon, title, description, onSelect }: { icon: JSX.Element, title: string, description: string, onSelect: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.03, borderColor: '#4ADE80' }}
    onClick={onSelect}
    className="bg-dark-primary p-6 rounded-lg border-2 border-border cursor-pointer text-center"
  >
    <div className="w-16 h-16 mx-auto bg-dark-secondary rounded-full flex items-center justify-center text-brand-primary">
      {icon && <div className="w-8 h-8">{icon}</div>}
    </div>
    <h3 className="text-xl font-bold mt-4 text-text-primary">{title}</h3>
    <p className="text-text-secondary mt-1">{description}</p>
  </motion.div>
);

export default OnboardingPage;