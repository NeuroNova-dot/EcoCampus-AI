import React from 'react';
import { Clock, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ReportStatus } from '../types/eco';

export function EcoLogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="9" fill="#064E3B" />
      <path
        d="M11 23.5C11 16.5 16.2 11 24.5 11C24.5 19.3 19 24.5 12 24.5"
        stroke="#ECFDF5"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 24.5L19.5 16"
        stroke="#34D399"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="11.5" r="2.2" fill="#059669" stroke="#ECFDF5" strokeWidth="1.4" />
    </svg>
  );
}

export function StatusIndicator({ status }: { status: ReportStatus }) {
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap shrink-0">
        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Pending</span>
      </span>
    );
  }
  if (status === 'Under Review') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 whitespace-nowrap shrink-0">
        <Eye className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <span>Under Review</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#059669] whitespace-nowrap shrink-0">
      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
      <span>Resolved</span>
    </span>
  );
}

export function PriorityIndicator({ priority }: { priority: 'Low' | 'Medium' | 'High' }) {
  if (priority === 'High') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 whitespace-nowrap shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <span>High</span>
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="text-xs font-medium text-amber-700 whitespace-nowrap shrink-0">
        Medium
      </span>
    );
  }
  return (
    <span className="text-xs font-medium text-slate-600 whitespace-nowrap shrink-0">
      Low
    </span>
  );
}
