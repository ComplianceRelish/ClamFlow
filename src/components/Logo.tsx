import React from 'react';
import { Shell } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Shell className="h-8 w-8 text-blue-600" />
      <div className="flex items-baseline">
        <span className="text-xl font-bold text-gray-900">ClamFlow</span>
        <sup className="text-xs font-medium text-gray-500 ml-0.5">TM</sup>
      </div>
    </div>
  );
}