'use client';

import { TripStatus } from '@/lib/types';
import TripCard from './TripCard';

interface TripListProps {
  trips: Map<string, TripStatus>;
  onTripClick?: (tripId: string) => void;
}

export default function TripList({ trips, onTripClick }: TripListProps) {
  const tripArray = Array.from(trips.values());

  if (tripArray.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No trips available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tripArray.map((trip) => (
        <TripCard
          key={trip.trip_id}
          trip={trip}
          onClick={() => onTripClick?.(trip.trip_id)}
        />
      ))}
    </div>
  );
}

