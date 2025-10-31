// src/components/common/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button = ({ children, variant = 'primary', isLoading = false, ...props }: ButtonProps) => {
  const baseStyles = `
    font-bold py-2.5 px-6 rounded-md transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center text-sm
  `;

  const variantStyles = {
    primary: `
      bg-brand-primary text-dark-primary hover:bg-opacity-90 hover:shadow-glow-primary
      focus:ring-brand-primary
    `,
    secondary: `
      bg-dark-secondary text-text-primary border border-border hover:border-brand-accent
      hover:text-brand-accent focus:ring-brand-accent
    `,
    danger: `
      bg-red-600 text-text-primary hover:bg-red-700 focus:ring-red-500
    `,
  };

  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]}`}
      disabled={isLoading}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;