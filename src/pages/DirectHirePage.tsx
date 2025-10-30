// src/pages/DirectHirePage.tsx
// (The code inside is IDENTICAL to the old CreateProjectPage.tsx, just rename the component)
import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useFactoryContract } from '../hooks/useFactoryContract';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface Milestone {
  description: string;
  amount: string;
}

// RENAME THE COMPONENT HERE
const DirectHirePage = () => { 
  const [step, setStep] = useState(1);
  // ... the rest of the component code is exactly the same as before
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([{ description: '', amount: '' }]);
  const { status, error, createEscrow } = useFactoryContract();

  const handleAddMilestone = () => {
    setMilestones([...milestones, { description: '', amount: '' }]);
  };

  const handleRemoveMilestone = (index: number) => {
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
  };

  const handleMilestoneChange = (index: number, field: 'description' | 'amount', value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };
  
  const totalAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  const handleSubmit = async () => {
    const descriptions = milestones.map(m => m.description);
    const amounts = milestones.map(m => m.amount);
    await createEscrow(freelancerAddress, descriptions, amounts);
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Freelancer Details
        return (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Direct Hire Agreement</h2>
            <p className="text-text-secondary mb-6">Enter the wallet address of the freelancer you're hiring.</p>
            <Input
              label="Freelancer's Wallet Address"
              id="freelancerAddress"
              placeholder="0x..."
              value={freelancerAddress}
              onChange={(e) => setFreelancerAddress(e.target.value)}
            />
          </div>
        );
      case 2: // Milestones
        return (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Structure the Milestones</h2>
            <p className="text-text-secondary mb-6">Break down the project into clear, payable milestones.</p>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-dark-secondary rounded-md border border-border">
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                       <Input
                          label={`Milestone ${index + 1} Description`}
                          id={`desc-${index}`}
                          placeholder="e.g., 'Deploy website to production'"
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        />
                    </div>
                    <Input
                      label="Amount (ETH)"
                      id={`amount-${index}`}
                      type="number"
                      placeholder="0.5"
                      value={milestone.amount}
                      onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                    />
                  </div>
                  {milestones.length > 1 && (
                    <button onClick={() => handleRemoveMilestone(index)} className="mt-7 p-1 text-text-secondary hover:text-red-500">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={handleAddMilestone} className="mt-4">
              + Add Milestone
            </Button>
          </div>
        );
      case 3: // Review
        return (
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Review and Deploy</h2>
            <p className="text-text-secondary mb-6">Please confirm the details below before creating the on-chain agreement.</p>
            <div className="space-y-4 p-6 bg-dark-secondary rounded-md border border-border">
              <div>
                <h3 className="text-text-secondary font-semibold">Freelancer</h3>
                <p className="text-text-primary font-mono text-sm break-all">{freelancerAddress}</p>
              </div>
              <div>
                <h3 className="text-text-secondary font-semibold">Milestones</h3>
                <ul className="list-disc list-inside space-y-2 mt-2">
                  {milestones.map((m, i) => (
                    <li key={i} className="text-text-primary">{m.description} - <span className="font-bold text-brand-primary">{m.amount} ETH</span></li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                 <h3 className="text-text-secondary font-semibold">Total Project Cost</h3>
                 <p className="text-2xl font-bold text-brand-primary">{totalAmount.toFixed(4)} ETH</p>
              </div>
            </div>
            {error && <p className="mt-4 text-sm text-red-400">Error: {error}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-dark-secondary border border-border rounded-lg p-8 shadow-lg">
        {renderStep()}
        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
          <div>
            {step > 1 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={status === 'pending'}>
                {status === 'pending' ? 'Deploying...' : 'Deploy Escrow Contract'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DirectHirePage;