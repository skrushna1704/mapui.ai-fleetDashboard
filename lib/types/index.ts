// Fleet Tracking Event Types
export type EventType =
  | 'trip_started'
  | 'trip_completed'
  | 'trip_cancelled'
  | 'location_ping'
  | 'signal_lost'
  | 'signal_recovered'
  | 'vehicle_stopped'
  | 'vehicle_moving'
  | 'speed_violation'
  | 'vehicle_telemetry'
  | 'device_error'
  | 'battery_low'
  | 'fuel_level_low'
  | 'refueling_started'
  | 'refueling_completed';

export interface Location {
  lat: number;
  lng: number;
  accuracy_meters?: number;
  altitude_meters?: number;
}

export interface Movement {
  speed_kmh: number;
  heading_degrees: number;
  moving: boolean;
}

export interface Device {
  battery_level: number;
  charging: boolean;
}

export interface BaseEvent {
  event_id: string;
  event_type: EventType;
  timestamp: string;
  vehicle_id: string;
  trip_id: string;
  location: Location;
  movement?: Movement;
  distance_travelled_km?: number;
  signal_quality?: string;
  device?: Device;
  overspeed?: boolean;
}

export interface TripStartedEvent extends BaseEvent {
  event_type: 'trip_started';
  device_id: string;
  planned_distance_km: number;
  estimated_duration_hours: number;
}

export interface TripCompletedEvent extends BaseEvent {
  event_type: 'trip_completed';
  device_id: string;
  total_distance_km: number;
  duration_minutes: number;
  fuel_consumed_percent: number;
}

export interface TripCancelledEvent extends BaseEvent {
  event_type: 'trip_cancelled';
  cancellation_reason: string;
  distance_completed_km: number;
  elapsed_time_minutes: number;
}

export interface LocationPingEvent extends BaseEvent {
  event_type: 'location_ping';
}

export interface SpeedViolationEvent extends BaseEvent {
  event_type: 'speed_violation';
  speed_limit_kmh: number;
  violation_amount_kmh: number;
  severity: string;
}

export interface DeviceErrorEvent extends BaseEvent {
  event_type: 'device_error';
  error_type: string;
  error_code: string;
  error_message: string;
  severity: string;
}

export interface BatteryLowEvent extends BaseEvent {
  event_type: 'battery_low';
  battery_level_percent: number;
  threshold_percent: number;
  estimated_remaining_hours: number;
}

export interface FuelLevelLowEvent extends BaseEvent {
  event_type: 'fuel_level_low';
  fuel_level_percent: number;
  threshold_percent: number;
  estimated_range_km: number;
}

export interface RefuelingCompletedEvent extends BaseEvent {
  event_type: 'refueling_completed';
  refuel_duration_minutes: number;
  fuel_level_after_refuel: number;
  fuel_added_percent: number;
}

export type FleetEvent =
  | TripStartedEvent
  | TripCompletedEvent
  | TripCancelledEvent
  | LocationPingEvent
  | SpeedViolationEvent
  | DeviceErrorEvent
  | BatteryLowEvent
  | FuelLevelLowEvent
  | RefuelingCompletedEvent
  | BaseEvent;

export interface TripStatus {
  trip_id: string;
  vehicle_id: string;
  status: 'active' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  plannedDistance: number;
  currentDistance: number;
  progress: number;
  currentSpeed?: number;
  currentLocation?: Location;
  alerts: string[];
  lastUpdate: string;
  events: FleetEvent[];
  fuelLevel?: number;
  deviceBattery?: number;
  signalQuality?: string;
  speedViolations: number;
  deviceErrors: number;
}

export interface FleetMetrics {
  totalTrips: number;
  activeTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  tripsAt50Percent: number;
  tripsAt80Percent: number;
  totalDistance: number;
  totalSpeedViolations: number;
  totalDeviceErrors: number;
  averageSpeed: number;
  averageFuelLevel: number;
}

