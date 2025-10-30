// src/hooks/useUser.ts
import { useContext } from 'react';
import { UserContext, IUserContext } from '../contexts/user-context-definition'; // Import from definition

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};