'use client';

import { FleetMetrics as FleetMetricsType } from '@/lib/types';
import MetricCard from '@/components/common/MetricCard';
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Gauge, 
  AlertTriangle,
  Zap,
  Fuel
} from 'lucide-react';

interface FleetMetricsProps {
  metrics: FleetMetricsType;
}

export default function FleetMetrics({ metrics }: FleetMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <MetricCard
        title="Total Trips"
        value={metrics.totalTrips}
        icon={<Truck className="w-6 h-6 text-blue-600" />}
      />
      <MetricCard
        title="Active Trips"
        value={metrics.activeTrips}
        icon={<Activity className="w-6 h-6 text-green-600" />}
        subtitle={`${metrics.completedTrips} completed, ${metrics.cancelledTrips} cancelled`}
      />
      <MetricCard
        title="At 50% Progress"
        value={metrics.tripsAt50Percent}
        icon={<Gauge className="w-6 h-6 text-yellow-600" />}
        subtitle="Trips halfway through"
      />
      <MetricCard
        title="At 80% Progress"
        value={metrics.tripsAt80Percent}
        icon={<Gauge className="w-6 h-6 text-orange-600" />}
        subtitle="Near completion"
      />
      <MetricCard
        title="Total Distance"
        value={`${metrics.totalDistance.toFixed(1)} km`}
        icon={<Truck className="w-6 h-6 text-purple-600" />}
      />
      <MetricCard
        title="Speed Violations"
        value={metrics.totalSpeedViolations}
        icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
        trend={metrics.totalSpeedViolations > 0 ? 'down' : 'neutral'}
      />
      <MetricCard
        title="Device Errors"
        value={metrics.totalDeviceErrors}
        icon={<Zap className="w-6 h-6 text-red-600" />}
        trend={metrics.totalDeviceErrors > 0 ? 'down' : 'neutral'}
      />
      <MetricCard
        title="Avg Speed"
        value={`${metrics.averageSpeed.toFixed(1)} km/h`}
        icon={<Gauge className="w-6 h-6 text-blue-600" />}
      />
      <MetricCard
        title="Avg Fuel Level"
        value={`${metrics.averageFuelLevel.toFixed(1)}%`}
        icon={<Fuel className="w-6 h-6 text-green-600" />}
      />
      <MetricCard
        title="Completed"
        value={metrics.completedTrips}
        icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        subtitle={`${((metrics.completedTrips / metrics.totalTrips) * 100).toFixed(0)}% success rate`}
      />
    </div>
  );
}

