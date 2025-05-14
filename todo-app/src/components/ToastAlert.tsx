import React from 'react';

interface ToastAlertProps {
  message: string | null;
  type?: 'success' | 'danger' | 'warning';
  onClose: () => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 p-3"
      style={{ zIndex: 9999 }}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={`toast show align-items-center text-bg-${type} border-0`} role="alert">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
    </div>
  );
};
