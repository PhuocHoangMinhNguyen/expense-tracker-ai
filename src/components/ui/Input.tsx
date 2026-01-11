import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', ...props }, ref) => {
    const inputId = props.id || props.name || `input-${Math.random()}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              block w-full rounded-xl border-2 px-4 py-3 text-sm font-medium
              transition-all duration-200
              ${icon ? 'pl-12' : ''}
              ${
                error
                  ? 'border-red-500/50 bg-red-500/10 text-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                  : 'border-slate-700 bg-slate-900/50 text-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20'
              }
              focus:outline-none
              disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-slate-700/50
              placeholder:text-gray-500
              hover:border-slate-600
              ${className}
            `}
            {...props}
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    const textareaId = props.id || props.name || `textarea-${Math.random()}`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-gray-300 mb-2"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            block w-full rounded-xl border-2 px-4 py-3 text-sm font-medium
            transition-all duration-200
            ${
              error
                ? 'border-red-500/50 bg-red-500/10 text-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                : 'border-slate-700 bg-slate-900/50 text-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20'
            }
            focus:outline-none
            disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-slate-700/50
            placeholder:text-gray-500
            hover:border-slate-600
            ${className}
          `}
          {...props}
        />

        {error && <p className="mt-2 text-sm text-red-400 font-medium flex items-center gap-1">
          <span>⚠</span> {error}
        </p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
