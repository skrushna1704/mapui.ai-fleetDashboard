import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  className = '',
}: MetricCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="ml-4 p-3 bg-blue-100 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className={`mt-4 text-xs ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {trend === 'up' && '↑'} 
          {trend === 'down' && '↓'} 
          {trend === 'neutral' && '→'}
        </div>
      )}
    </div>
  );
}

