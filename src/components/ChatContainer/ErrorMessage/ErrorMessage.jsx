import React from 'react';
import './ErrorMessage.css';

export const ErrorMessage = ({ error, onDismiss }) => (
  <div className="error-message">
    <p>Error: {error}</p>
    <button onClick={onDismiss} className="dismiss-error">Dismiss</button>
  </div>
);
