// src/contexts/user-context-definition.ts
import { createContext } from 'react';

export enum Role { None, Client, Freelancer }

export interface FreelancerProfile {
  name: string;
  description: string;
  skills: string[];
  resumeCid: string;
}

export interface ClientProfile {
  name: string;
}

export interface Profile {
  role: Role;
  ipfsHash: string;
  data?: FreelancerProfile | ClientProfile; 
}

export interface IUserContext {
  profile: Profile | null;
  loadingProfile: boolean;
  refetchProfile: () => void;
}

export const UserContext = createContext<IUserContext | null>(null);