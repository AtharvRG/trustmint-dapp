// src/components/layout/Header.tsx
import { Link, NavLink } from 'react-router-dom';
import { useWeb3Modal, useDisconnect } from '@web3modal/ethers/react';
import { useWeb3 } from '../../hooks/useWeb3';
import { useUser } from '../../hooks/useUser';
import { motion } from 'framer-motion';

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Header = () => {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isWrongNetwork } = useWeb3();
  const { profile, loadingProfile } = useUser();

  const renderNavLinks = () => {
    // NavLink uses an `isActive` prop to style the active link
    const linkStyle = "text-text-secondary hover:text-brand-primary transition-colors duration-200";
    const activeLinkStyle = { color: '#4ADE80', fontWeight: '600' };

    if (isConnected && profile) {
      // Logged-in and registered user
      return (
        <>
          <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={linkStyle}>Dashboard</NavLink>
          <NavLink to="/market" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={linkStyle}>Marketplace</NavLink>
          {profile.role === 1 /* Client */ && (
             <NavLink to="/create" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={linkStyle}>New Project</NavLink>
          )}
          <NavLink to="/profile" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className={linkStyle}>Profile</NavLink>
        </>
      );
    } else {
      // Guest user
      return (
        <>
          <NavLink to="/#features" className={linkStyle}>Features</NavLink>
          <NavLink to="/market" className={linkStyle}>Marketplace</NavLink>
        </>
      );
    }
  };

  const renderConnectButton = () => {
    if (loadingProfile && isConnected) {
      return <div className="text-sm text-text-secondary">Loading Profile...</div>;
    }
    
    if (isWrongNetwork) {
        return (
            <button
                onClick={() => open({ view: 'Networks' })}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
                Wrong Network
            </button>
        );
    }

    if (isConnected && address) {
      return (
        <div className="flex items-center gap-3">
          <div className="bg-dark-secondary border border-border text-text-primary font-mono text-sm py-2 px-4 rounded-md">
            {formatAddress(address)}
          </div>
          <button
            onClick={() => disconnect()}
            title="Disconnect Wallet"
            className="bg-dark-secondary border border-border text-text-secondary font-semibold py-2 px-3 rounded-md transition-all duration-300 hover:border-red-500 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={() => open()}
        className="bg-brand-primary text-dark-primary font-bold py-2 px-5 rounded-md transition-all duration-300 ease-in-out
                   hover:bg-opacity-90 hover:shadow-glow-primary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-opacity-75"
      >
        Connect Wallet
      </button>
    );
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 bg-dark-primary/80 backdrop-blur-lg border-b border-border"
    >
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-text-primary">
          Trust<span className="text-brand-primary">Mint</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {renderNavLinks()}
        </div>
        <div className="flex items-center">
          {renderConnectButton()}
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;