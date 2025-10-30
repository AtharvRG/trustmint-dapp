// src/components/common/Input.tsx
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = ({ label, id, error, ...props }: InputProps) => {
  const errorStyles = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border focus:border-brand-primary focus:ring-brand-primary';

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
        {label}
      </label>
      <input
        id={id}
        className={`
          w-full bg-dark-secondary rounded-md px-3 py-2 text-text-primary
          border transition-colors duration-200 ${errorStyles}
          focus:outline-none focus:ring-1
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;