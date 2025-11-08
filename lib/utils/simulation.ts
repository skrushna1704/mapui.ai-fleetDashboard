import { FleetEvent, TripStatus, FleetMetrics } from '@/lib/types';

export class FleetSimulator {
  private allEvents: FleetEvent[] = [];
  private currentTime: Date = new Date(0);
  private playbackSpeed: number = 1;
  private isPlaying: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private processedEventIds: Set<string> = new Set();
  private onEventCallback?: (event: FleetEvent) => void;
  private onUpdateCallback?: (trips: Map<string, TripStatus>, metrics: FleetMetrics) => void;

  constructor(
    events: FleetEvent[],
    onEvent?: (event: FleetEvent) => void,
    onUpdate?: (trips: Map<string, TripStatus>, metrics: FleetMetrics) => void
  ) {
    this.allEvents = events.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    this.onEventCallback = onEvent;
    this.onUpdateCallback = onUpdate;
    
    if (this.allEvents.length > 0) {
      this.currentTime = new Date(this.allEvents[0].timestamp);
    }
  }

  start(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.processEvents();
  }

  pause(): void {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.pause();
    this.currentTime = this.allEvents.length > 0 
      ? new Date(this.allEvents[0].timestamp)
      : new Date(0);
    this.processedEventIds.clear();
    this.updateState();
  }

  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = speed;
  }

  getCurrentTime(): Date {
    return this.currentTime;
  }

  getProgress(): number {
    if (this.allEvents.length === 0) return 0;
    const startTime = new Date(this.allEvents[0].timestamp).getTime();
    const endTime = new Date(this.allEvents[this.allEvents.length - 1].timestamp).getTime();
    const currentTime = this.currentTime.getTime();
    return ((currentTime - startTime) / (endTime - startTime)) * 100;
  }

  private processEvents(): void {
    const interval = 100 / this.playbackSpeed; // Adjust interval based on speed
    
    this.intervalId = setInterval(() => {
      if (!this.isPlaying) return;

      const eventsToProcess = this.allEvents.filter(
        event => 
          !this.processedEventIds.has(event.event_id) &&
          new Date(event.timestamp).getTime() <= this.currentTime.getTime()
      );

      eventsToProcess.forEach(event => {
        this.processedEventIds.add(event.event_id);
        if (this.onEventCallback) {
          this.onEventCallback(event);
        }
      });

      // Advance time
      const timeStep = 1000 * this.playbackSpeed; // 1 second * speed
      this.currentTime = new Date(this.currentTime.getTime() + timeStep);

      this.updateState();

      // Check if we've reached the end
      if (this.allEvents.every(event => this.processedEventIds.has(event.event_id))) {
        this.pause();
      }
    }, interval);
  }

  private updateState(): void {
    const processedEvents = this.allEvents.filter(
      event => this.processedEventIds.has(event.event_id)
    );

    const trips = this.buildTripStatuses(processedEvents);
    const metrics = this.calculateFleetMetrics(trips);

    if (this.onUpdateCallback) {
      this.onUpdateCallback(trips, metrics);
    }
  }

  private buildTripStatuses(events: FleetEvent[]): Map<string, TripStatus> {
    const trips = new Map<string, TripStatus>();

    events.forEach(event => {
      if (!trips.has(event.trip_id)) {
        trips.set(event.trip_id, {
          trip_id: event.trip_id,
          vehicle_id: event.vehicle_id,
          status: 'active',
          startTime: event.timestamp,
          plannedDistance: 0,
          currentDistance: 0,
          progress: 0,
          alerts: [],
          lastUpdate: event.timestamp,
          events: [],
          speedViolations: 0,
          deviceErrors: 0,
        });
      }

      const trip = trips.get(event.trip_id)!;
      trip.events.push(event);
      trip.lastUpdate = event.timestamp;

      // Update based on event type
      switch (event.event_type) {
        case 'trip_started':
          trip.plannedDistance = (event as any).planned_distance_km || 0;
          break;
        case 'trip_completed':
          trip.status = 'completed';
          trip.endTime = event.timestamp;
          trip.currentDistance = (event as any).total_distance_km || 0;
          trip.progress = 100;
          break;
        case 'trip_cancelled':
          trip.status = 'cancelled';
          trip.endTime = event.timestamp;
          trip.currentDistance = (event as any).distance_completed_km || 0;
          break;
        case 'location_ping':
        case 'vehicle_telemetry':
          if (event.distance_travelled_km !== undefined) {
            trip.currentDistance = event.distance_travelled_km;
            if (trip.plannedDistance > 0) {
              trip.progress = Math.min(100, (trip.currentDistance / trip.plannedDistance) * 100);
            }
          }
          if (event.movement) {
            trip.currentSpeed = event.movement.speed_kmh;
          }
          if (event.location) {
            trip.currentLocation = event.location;
          }
          if (event.device) {
            trip.deviceBattery = event.device.battery_level;
          }
          if (event.signal_quality) {
            trip.signalQuality = event.signal_quality;
          }
          break;
        case 'speed_violation':
          trip.speedViolations++;
          trip.alerts.push(`Speed violation: ${(event as any).violation_amount_kmh} km/h over limit`);
          break;
        case 'device_error':
          trip.deviceErrors++;
          trip.alerts.push(`Device error: ${(event as any).error_message}`);
          break;
        case 'battery_low':
          trip.alerts.push(`Low battery: ${(event as any).battery_level_percent}%`);
          break;
        case 'fuel_level_low':
          trip.alerts.push(`Low fuel: ${(event as any).fuel_level_percent}%`);
          break;
      }

      // Update fuel level from telemetry
      if (event.event_type === 'vehicle_telemetry' && (event as any).telemetry) {
        trip.fuelLevel = (event as any).telemetry.fuel_level_percent;
      }
    });

    return trips;
  }

  private calculateFleetMetrics(trips: Map<string, TripStatus>): FleetMetrics {
    const tripArray = Array.from(trips.values());
    
    return {
      totalTrips: tripArray.length,
      activeTrips: tripArray.filter(t => t.status === 'active').length,
      completedTrips: tripArray.filter(t => t.status === 'completed').length,
      cancelledTrips: tripArray.filter(t => t.status === 'cancelled').length,
      tripsAt50Percent: tripArray.filter(t => t.progress >= 50 && t.progress < 80).length,
      tripsAt80Percent: tripArray.filter(t => t.progress >= 80 && t.status === 'active').length,
      totalDistance: tripArray.reduce((sum, t) => sum + t.currentDistance, 0),
      totalSpeedViolations: tripArray.reduce((sum, t) => sum + t.speedViolations, 0),
      totalDeviceErrors: tripArray.reduce((sum, t) => sum + t.deviceErrors, 0),
      averageSpeed: tripArray
        .filter(t => t.currentSpeed !== undefined)
        .reduce((sum, t, _, arr) => sum + (t.currentSpeed || 0) / arr.length, 0),
      averageFuelLevel: tripArray
        .filter(t => t.fuelLevel !== undefined)
        .reduce((sum, t, _, arr) => sum + (t.fuelLevel || 0) / arr.length, 0),
    };
  }

  destroy(): void {
    this.pause();
    this.processedEventIds.clear();
    this.allEvents = [];
  }
}

