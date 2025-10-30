// src/contexts/UserContext.tsx
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { Contract } from 'ethers';
import { USER_PROFILE_ADDRESS } from '../constants';
import UserProfileABI from '../contracts/UserProfile.json';
import { UserContext, Role, Profile } from './user-context-definition'; // Import Profile type

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { address, provider } = useWeb3();
  const [profile, setProfile] = useState<Profile | null>(null); // <-- Correctly typed
  const [loadingProfile, setLoadingProfile] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!address || !provider) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    try {
      const contract = new Contract(USER_PROFILE_ADDRESS, UserProfileABI, provider);
      const userProfile = await contract.profiles(address);

      if (Number(userProfile.role) !== Role.None) {
        const response = await fetch(`https://ipfs.io/ipfs/${userProfile.ipfsHash}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch profile from IPFS: ${response.statusText}`);
        }
        const data = await response.json();
        setProfile({
          role: Number(userProfile.role),
          ipfsHash: userProfile.ipfsHash,
          data: data,
        });
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }, [address, provider]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <UserContext.Provider value={{ profile, loadingProfile, refetchProfile: fetchProfile }}>
      {children}
    </UserContext.Provider>
  );
};