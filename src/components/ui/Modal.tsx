import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative bg-ig-card border border-ig-border rounded-ig-xl shadow-ig-lg w-full ${sizeStyles[size]} animate-scale-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-center p-4 border-b border-ig-border relative">
            <h2 className="text-base font-semibold text-ig-text">{title}</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ig-text hover:text-ig-text-secondary transition-colors p-1"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-4">{children}</div>

          {/* Footer */}
          {footer && <div className="p-4 border-t border-ig-border">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-ig-card border border-ig-border rounded-ig-xl shadow-ig-lg w-full max-w-xs animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="p-6 text-center">
            <h2 className="text-lg font-semibold text-ig-text mb-2">{title}</h2>
            <p className="text-sm text-ig-text-secondary">{message}</p>
          </div>

          {/* Actions - Instagram style stacked buttons */}
          <div className="border-t border-ig-border">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`
                w-full py-3 text-sm font-semibold border-b border-ig-border transition-colors
                ${variant === 'danger' ? 'text-action-like' : 'text-action-blue'}
                hover:bg-ig-surface disabled:opacity-50
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                confirmText
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full py-3 text-sm font-medium text-ig-text hover:bg-ig-surface transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
