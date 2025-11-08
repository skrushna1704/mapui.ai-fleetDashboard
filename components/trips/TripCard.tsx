'use client';

import { TripStatus } from '@/lib/types';
import { 
  Truck, 
  MapPin, 
  Gauge, 
  Battery, 
  Signal, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface TripCardProps {
  trip: TripStatus;
  onClick?: () => void;
}

export default function TripCard({ trip, onClick }: TripCardProps) {
  const getStatusColor = () => {
    switch (trip.status) {
      case 'completed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'cancelled':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  const getStatusIcon = () => {
    switch (trip.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Truck className="w-5 h-5" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg p-6 border-2 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] ${getStatusColor()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <h3 className="text-lg font-bold">{trip.vehicle_id}</h3>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
          {trip.status.toUpperCase()}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-bold">{trip.progress.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${trip.progress}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <div>
            <p className="text-xs text-gray-600">Distance</p>
            <p className="text-sm font-bold">{trip.currentDistance.toFixed(1)} km</p>
          </div>
        </div>
        {trip.currentSpeed !== undefined && (
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-600">Speed</p>
              <p className="text-sm font-bold">{trip.currentSpeed.toFixed(0)} km/h</p>
            </div>
          </div>
        )}
        {trip.deviceBattery !== undefined && (
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-600">Battery</p>
              <p className="text-sm font-bold">{trip.deviceBattery.toFixed(0)}%</p>
            </div>
          </div>
        )}
        {trip.signalQuality && (
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-600">Signal</p>
              <p className="text-sm font-bold capitalize">{trip.signalQuality}</p>
            </div>
          </div>
        )}
      </div>

      {/* Alerts */}
      {(trip.alerts.length > 0 || trip.speedViolations > 0 || trip.deviceErrors > 0) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-medium text-gray-700">Alerts</span>
          </div>
          <div className="space-y-1">
            {trip.speedViolations > 0 && (
              <p className="text-xs text-red-600">
                {trip.speedViolations} speed violation{trip.speedViolations > 1 ? 's' : ''}
              </p>
            )}
            {trip.deviceErrors > 0 && (
              <p className="text-xs text-red-600">
                {trip.deviceErrors} device error{trip.deviceErrors > 1 ? 's' : ''}
              </p>
            )}
            {trip.alerts.slice(0, 2).map((alert, idx) => (
              <p key={idx} className="text-xs text-orange-600 truncate">
                {alert}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

