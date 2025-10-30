// src/pages/PostJobPage.tsx
import { useState } from 'react';
import { useJobManagement } from '../hooks/useJobManagement';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface Milestone {
  description: string;
  amount: string;
}

const PostJobPage = () => {
  const { status, error, postJob } = useJobManagement();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [milestones, setMilestones] = useState<Milestone[]>([{ description: '', amount: '' }]);

  const totalBudget = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0).toFixed(4);

  const handleAddMilestone = () => setMilestones([...milestones, { description: '', amount: '' }]);
  const handleRemoveMilestone = (index: number) => setMilestones(milestones.filter((_, i) => i !== index));
  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index][field] = value;
    setMilestones(newMilestones);
  };

  const handleSubmit = () => {
    const jobData = {
      title,
      description,
      budget: totalBudget.toString(),
      milestones
    };
    postJob(jobData);
  };

  return (
    <div className="max-w-4xl mx-auto bg-dark-secondary p-8 rounded-lg border border-border">
      <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
      <p className="text-text-secondary mb-8">Describe your project to attract the best talent from the TrustMint network.</p>
      
      <div className="space-y-6">
        <Input label="Job Title" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Build a DeFi Staking Dashboard" />
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={5}
            className="w-full bg-dark-primary rounded-md px-3 py-2 text-text-primary border border-border focus:border-brand-primary focus:ring-brand-primary focus:outline-none focus:ring-1"
            placeholder="Provide a detailed overview of the project, deliverables, and requirements."
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Project Milestones & Budget</h2>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <div key={i} className="flex items-start space-x-3 p-4 bg-dark-primary rounded-md border border-border">
                <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <Input label={`Milestone ${i + 1}`} id={`desc-${i}`} value={m.description} onChange={e => handleMilestoneChange(i, 'description', e.target.value)} />
                  </div>
                  <Input label="Amount (ETH)" id={`amount-${i}`} type="number" value={m.amount} onChange={e => handleMilestoneChange(i, 'amount', e.target.value)} />
                </div>
                {milestones.length > 1 && <button onClick={() => handleRemoveMilestone(i)} className="mt-7 p-1 text-text-secondary hover:text-red-500"><XMarkIcon className="h-5 w-5" /></button>}
              </div>
            ))}
          </div>
          <Button variant="secondary" onClick={handleAddMilestone} className="mt-4">+ Add Milestone</Button>
        </div>

        <div className="bg-dark-primary p-4 rounded-lg flex justify-between items-center">
          <span className="text-text-secondary font-semibold">Total Project Budget</span>
          <span className="text-2xl font-bold text-brand-primary">{totalBudget} ETH</span>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <Button onClick={handleSubmit} isLoading={status === 'uploading' || status === 'signing'}>
          Post Job to Marketplace
        </Button>
        {status === 'success' && <p className="text-green-400 mt-2">Job posted successfully! Redirecting...</p>}
        {error && <p className="text-red-400 mt-2">Error: {error}</p>}
      </div>
    </div>
  );
};

export default PostJobPage;