// src/pages/ProfilePage.tsx
import { useUser } from '../hooks/useUser'; // <-- Corrected import path
import { FreelancerProfile } from '../contexts/user-context-definition'; // Import type for casting

const ProfilePage = () => {
  const { profile, loadingProfile } = useUser();

  if (loadingProfile) {
    return <div>Loading profile...</div>;
  }

  if (!profile || !profile.data) {
    return <div>Could not load profile.</div>;
  }

  const { data } = profile;
  // Type assertion to help TypeScript understand the data structure for freelancers
  const freelancerData = profile.role === 2 ? data as FreelancerProfile : null;

  return (
    <div className="max-w-4xl mx-auto bg-dark-secondary p-8 rounded-lg border border-border">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <span className="text-brand-primary font-semibold mt-1">{profile.role === 1 ? 'Client' : 'Freelancer'}</span>
        </div>
        <button className="bg-dark-primary border border-border text-text-primary font-semibold py-2 px-4 rounded-md text-sm hover:border-brand-primary">
          Edit Profile
        </button>
      </div>

      {freelancerData && (
        <div className="mt-8 pt-6 border-t border-border">
          <h2 className="text-xl font-bold mb-4">Freelancer Details</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-text-secondary font-semibold">Bio</h3>
              <p>{freelancerData.description || 'Not provided.'}</p>
            </div>
            <div>
              <h3 className="text-text-secondary font-semibold">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {freelancerData.skills?.map((skill: string) => (
                  <span key={skill} className="bg-dark-primary text-brand-primary text-sm font-semibold px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;