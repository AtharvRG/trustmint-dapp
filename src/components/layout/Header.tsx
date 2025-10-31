// src/components/layout/Header.tsx
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useWeb3Modal, useDisconnect } from '@web3modal/ethers/react';
import { useWeb3 } from '../../hooks/useWeb3';
import { useUser } from '../../hooks/useUser';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { SiMintlify } from "react-icons/si";

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Header = () => {
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const { address, isConnected, isWrongNetwork } = useWeb3();
  const { profile, loadingProfile } = useUser();
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const renderNavLinks = () => {
    const linkStyle = "text-text-secondary hover:text-brand-primary transition-colors duration-200 font-medium";
    const activeLinkStyle = { color: '#4ADE80', textShadow: '0 0 10px rgba(74, 222, 128, 0.5)' };

    if (isConnected && profile) {
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

    if (isConnected && address) {
      return (
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm bg-dark-secondary px-3 py-1.5 rounded-md border border-border text-text-secondary">
            {isWrongNetwork ? 'Wrong Network' : formatAddress(address)}
          </span>
          <button onClick={() => disconnect()} className="text-text-secondary hover:text-red-500 transition-colors text-sm">
            Disconnect
          </button>
        </div>
      );
    }

    return (
        <motion.button
            onClick={() => open()}
            className="font-semibold py-2 px-5 rounded-md transition-all duration-300 ease-in-out bg-brand-accent text-text-primary hover:bg-opacity-90 hover:shadow-glow-accent focus:outline-none focus:ring-2 focus:ring-brand-accent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Connect Wallet
        </motion.button>
    );
  };

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-primary/80 backdrop-blur-xl border-b border-border"
    >
      <div className="container mx-auto px-4 h-20 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <SiMintlify className="w-8 h-8 text-brand-primary" />
          <span className="font-display text-2xl font-bold text-text-primary">TrustMint</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {renderNavLinks()}
        </nav>
        <div className="flex items-center">
          {renderConnectButton()}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;