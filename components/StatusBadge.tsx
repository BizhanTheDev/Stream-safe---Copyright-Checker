import React from 'react';
import { SafetyStatus } from '../types';

interface Props {
  status: SafetyStatus;
  large?: boolean;
}

const StatusBadge: React.FC<Props> = ({ status, large = false }) => {
  let colorClass = '';
  let icon = null;
  let label = '';

  switch (status) {
    case SafetyStatus.SAFE:
      colorClass = 'bg-green-100 text-green-700 border-green-200';
      label = 'Copyright Safe';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? 'w-6 h-6' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
      break;
    case SafetyStatus.RISKY:
      colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
      label = 'Use with Caution';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? 'w-6 h-6' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
      break;
    case SafetyStatus.BLOCKED:
      colorClass = 'bg-red-100 text-red-700 border-red-200';
      label = 'Copyrighted / Blocked';
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? 'w-6 h-6' : 'w-4 h-4'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      );
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
      label = 'Unknown Status';
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border-2 font-bold ${colorClass} ${large ? 'text-lg px-6 py-2' : 'text-xs'}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
};

export default StatusBadge;