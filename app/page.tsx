'use client';

import { useEffect, useState, useRef } from 'react';
import { FleetSimulator } from '@/lib/utils/simulation';
import { loadAllTrips } from '@/lib/utils/dataLoader';
import { FleetEvent, TripStatus, FleetMetrics } from '@/lib/types';
import FleetMetricsComponent from '@/components/dashboard/FleetMetrics';
import TripList from '@/components/trips/TripList';
import PlaybackControls from '@/components/common/PlaybackControls';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [trips, setTrips] = useState<Map<string, TripStatus>>(new Map());
  const [metrics, setMetrics] = useState<FleetMetrics>({
    totalTrips: 0,
    activeTrips: 0,
    completedTrips: 0,
    cancelledTrips: 0,
    tripsAt50Percent: 0,
    tripsAt80Percent: 0,
    totalDistance: 0,
    totalSpeedViolations: 0,
    totalDeviceErrors: 0,
    averageSpeed: 0,
    averageFuelLevel: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const simulatorRef = useRef<FleetSimulator | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        setIsLoading(true);
        const events = await loadAllTrips();
        
        if (events.length === 0) {
          console.error('No events loaded');
          setIsLoading(false);
          return;
        }

        const simulator = new FleetSimulator(
          events,
          (event: FleetEvent) => {
            // Handle individual events if needed
            console.log('Event processed:', event.event_type);
          },
          (updatedTrips: Map<string, TripStatus>, updatedMetrics: FleetMetrics) => {
            setTrips(new Map(updatedTrips));
            setMetrics(updatedMetrics);
            if (simulatorRef.current) {
              setProgress(simulatorRef.current.getProgress());
            }
          }
        );

        simulatorRef.current = simulator;
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        setError('Failed to load fleet data. Please refresh the page.');
        setIsLoading(false);
      }
    }

    initialize();

    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.destroy();
      }
    };
  }, []);

  const handlePlay = () => {
    if (simulatorRef.current) {
      simulatorRef.current.start();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (simulatorRef.current) {
      simulatorRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    if (simulatorRef.current) {
      simulatorRef.current.reset();
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (simulatorRef.current) {
      simulatorRef.current.setPlaybackSpeed(speed);
      setPlaybackSpeed(speed);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading fleet data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MapUp Fleet Tracking</h1>
              <p className="text-gray-600 mt-1">Real-time fleet monitoring dashboard</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm text-gray-600">
                  {isPlaying ? 'Live' : 'Paused'}
                </span>
              </div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-blue-600">
                {Array.from(trips.values()).reduce((sum, trip) => sum + trip.events.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Playback Controls */}
        <div className="mb-8">
          <PlaybackControls
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            progress={progress}
            onPlay={handlePlay}
            onPause={handlePause}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
          />
        </div>

        {/* Fleet Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Fleet Overview</h2>
          <FleetMetricsComponent metrics={metrics} />
        </div>

        {/* Trip List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Active Trips</h2>
            <span className="text-sm text-gray-600">
              {trips.size} trip{trips.size !== 1 ? 's' : ''} tracked
            </span>
          </div>
          <TripList
            trips={trips}
            onTripClick={(tripId) => setSelectedTripId(tripId)}
          />
        </div>
      </main>

      {/* Trip Detail Modal */}
      {selectedTripId && trips.has(selectedTripId) && (
        <TripDetailModal
          trip={trips.get(selectedTripId)!}
          onClose={() => setSelectedTripId(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>MapUp Fleet Tracking Dashboard - Real-time Monitoring System</p>
        </div>
      </footer>
    </div>
  );
}

function TripDetailModal({ trip, onClose }: { trip: TripStatus; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Trip Details - {trip.vehicle_id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-bold capitalize">{trip.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Progress</p>
              <p className="text-lg font-bold">{trip.progress.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-lg font-bold">{trip.currentDistance.toFixed(1)} km</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Planned Distance</p>
              <p className="text-lg font-bold">{trip.plannedDistance.toFixed(1)} km</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">Recent Events</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {trip.events.slice(-20).reverse().map((event) => (
                <div
                  key={event.event_id}
                  className="bg-gray-50 rounded p-3 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{event.event_type}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {event.movement && (
                    <p className="text-xs text-gray-600 mt-1">
                      Speed: {event.movement.speed_kmh.toFixed(0)} km/h
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {trip.alerts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-3">Alerts</h3>
              <div className="space-y-2">
                {trip.alerts.map((alert, idx) => (
                  <div key={idx} className="bg-orange-50 border border-orange-200 rounded p-3">
                    <p className="text-sm text-orange-800">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
