import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className = '', ...props }, ref) => {
    const selectId = props.id || props.name || `select-${Math.random()}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={`
            block w-full rounded-xl border-2 px-4 py-3 text-sm font-medium
            transition-all duration-200
            appearance-none cursor-pointer
            ${
              error
                ? 'border-red-500/50 bg-red-500/10 text-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                : 'border-slate-700 bg-slate-900/50 text-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20'
            }
            focus:outline-none
            disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-slate-700/50
            hover:border-slate-600
            ${className}
          `}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.75rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
