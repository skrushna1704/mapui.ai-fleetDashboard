# Quick Start Guide

## Running the Dashboard

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Using the Dashboard

### Playback Controls
- **Play/Pause**: Click the play button to start/pause the simulation
- **Reset**: Click the reset button to restart from the beginning
- **Speed Control**: Select playback speed (1x, 5x, 10x, 20x, 50x) to control how fast events are processed

### Fleet Overview
The dashboard displays comprehensive fleet metrics:
- Total trips, active trips, completed trips
- Trips at 50% and 80% progress
- Total distance traveled
- Speed violations and device errors
- Average speed and fuel levels

### Trip Monitoring
- **Trip Cards**: View all active trips with progress, distance, speed, and alerts
- **Trip Details**: Click any trip card to see detailed event history and alerts
- **Real-time Updates**: Watch trips update in real-time as events are processed

### Status Indicators
- **Live Indicator**: Green pulsing dot in header shows when simulation is running
- **Trip Status**: Color-coded cards (blue=active, green=completed, red=cancelled)
- **Alerts**: Orange/red indicators for speed violations, device errors, and warnings

## Project Structure

```
fleet-dashboard/
├── app/
│   ├── page.tsx          # Main dashboard page
│   └── layout.tsx        # Root layout
├── components/
│   ├── common/           # Shared components
│   ├── dashboard/        # Dashboard components
│   └── trips/            # Trip components
├── lib/
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities (simulation, data loading)
└── public/
    └── data/             # Trip JSON files
```

## Key Features

✅ Real-time event processing with timestamp-based simulation
✅ Adjustable playback speed (1x to 50x)
✅ Comprehensive fleet metrics and insights
✅ Individual trip tracking with detailed views
✅ Beautiful, responsive UI with Tailwind CSS
✅ Performance optimized for 10,000+ events
✅ Error handling and loading states

## Troubleshooting

**Data not loading?**
- Ensure trip JSON files are in `public/data/` directory
- Check browser console for errors
- Verify file names match expected format

**Simulation not starting?**
- Click the play button to begin
- Check that events are loaded (see header for event count)
- Try resetting and starting again

**Performance issues?**
- Reduce playback speed
- Close trip detail modals when not needed
- Browser may need refresh for large datasets

