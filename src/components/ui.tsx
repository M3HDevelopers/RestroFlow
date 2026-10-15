import React from 'react';

// Button Component
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: { 
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseClass = variant === 'primary' ? 'btn-primary' : variant === 'danger' ? 'btn-danger' : 'btn-secondary';
  const sizeClass = size === 'sm' ? 'text-xs px-3 py-1.5' : size === 'lg' ? 'text-base px-5 py-3' : '';
  
  return (
    <button className={`${baseClass} ${sizeClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Card Component
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card ${className}`}>
      {children}
    </div>
  );
}

// Badge Component
export function Badge({ 
  children, 
  variant = 'default',
  className = '' 
}: { 
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}) {
  const variantClass = variant === 'success' ? 'badge-success' : 
                       variant === 'danger' ? 'badge-danger' :
                       variant === 'warning' ? 'badge-warning' :
                       variant === 'info' ? 'badge-info' : '';
  
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}

// Input Component
export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return <input className={`input-field ${className}`} {...props} />;
}

// Page Header Component
export function PageHeader({ 
  title, 
  subtitle,
  actions 
}: { 
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-text-secondary text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
