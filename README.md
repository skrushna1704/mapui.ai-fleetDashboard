# MapUp - Fleet Tracking Dashboard

A real-time fleet tracking dashboard built with Next.js, TypeScript, and Tailwind CSS. This dashboard visualizes vehicle movements, metrics, and operational insights for fleet management.

## Features

- **Real-time Simulation**: Process and display fleet tracking events in real-time with adjustable playback speed
- **Fleet Overview**: Comprehensive metrics including active trips, progress tracking, violations, and errors
- **Individual Trip Monitoring**: Detailed view of each trip with progress, alerts, and event history
- **Playback Controls**: Control simulation with play/pause, reset, and speed adjustment (1x, 5x, 10x, 20x, 50x)
- **Responsive Design**: Modern, responsive UI that works across all device sizes
- **Performance Optimized**: Efficiently handles datasets with 10,000+ events

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Project Structure

```
fleet-dashboard/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard page
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── common/            # Shared components
│   │   ├── MetricCard.tsx
│   │   └── PlaybackControls.tsx
│   ├── dashboard/         # Dashboard-specific components
│   │   └── FleetMetrics.tsx
│   └── trips/             # Trip-related components
│       ├── TripCard.tsx
│       └── TripList.tsx
├── lib/                   # Utilities and types
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Utility functions
│       ├── simulation.ts  # Real-time simulation engine
│       └── dataLoader.ts  # Data loading utilities
└── public/                # Static assets
    └── data/              # Trip data files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Ensure trip data files are in `public/data/`:
   - `trip_1_cross_country.json`
   - `trip_2_urban_dense.json`
   - `trip_3_mountain_cancelled.json`
   - `trip_4_southern_technical.json`
   - `trip_5_regional_logistics.json`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Start Simulation**: Click the play button to begin processing events in real-time
2. **Adjust Speed**: Use the speed buttons (1x, 5x, 10x, etc.) to control playback speed
3. **View Metrics**: Monitor fleet-wide metrics in the overview section
4. **Track Trips**: View individual trip cards with progress, alerts, and status
5. **Trip Details**: Click on any trip card to see detailed event history and alerts

## Data Structure

The dashboard processes fleet tracking events with the following key event types:

- **Trip Lifecycle**: `trip_started`, `trip_completed`, `trip_cancelled`
- **Location & Movement**: `location_ping`, `signal_lost`, `signal_recovered`
- **Vehicle State**: `vehicle_stopped`, `vehicle_moving`, `speed_violation`
- **Telemetry**: `vehicle_telemetry`, `device_error`
- **Warnings**: `battery_low`, `fuel_level_low`
- **Fuel Events**: `refueling_started`, `refueling_completed`

## Architecture

### Real-time Simulation Engine

The `FleetSimulator` class processes events chronologically based on timestamps:
- Sorts all events by timestamp
- Processes events in real-time based on simulation clock
- Updates trip statuses and fleet metrics
- Supports adjustable playback speed
- Efficiently handles large datasets

### Component Architecture

- **Component-based**: Modular, reusable components
- **Type-safe**: Full TypeScript coverage
- **Performance**: Optimized rendering with React best practices
- **Responsive**: Mobile-first design with Tailwind CSS

## Deployment

The dashboard can be deployed to any platform that supports Next.js:

- **Vercel** (Recommended): `vercel deploy`
- **Netlify**: Connect your repository
- **Docker**: Build and deploy containerized version

