import { FleetEvent } from '@/lib/types';

export async function loadTripData(tripNumber: number): Promise<FleetEvent[]> {
  try {
    const response = await fetch(`/data/trip_${tripNumber}_${getTripName(tripNumber)}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load trip ${tripNumber}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading trip ${tripNumber}:`, error);
    return [];
  }
}

export async function loadAllTrips(): Promise<FleetEvent[]> {
  const tripNumbers = [1, 2, 3, 4, 5];
  const tripNames = [
    'cross_country',
    'urban_dense',
    'mountain_cancelled',
    'southern_technical',
    'regional_logistics'
  ];

  try {
    const promises = tripNumbers.map((num, index) =>
      fetch(`/data/trip_${num}_${tripNames[index]}.json`)
        .then(res => res.json())
        .catch(err => {
          console.error(`Error loading trip ${num}:`, err);
          return [];
        })
    );

    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    console.error('Error loading all trips:', error);
    return [];
  }
}

function getTripName(tripNumber: number): string {
  const names = [
    'cross_country',
    'urban_dense',
    'mountain_cancelled',
    'southern_technical',
    'regional_logistics'
  ];
  return names[tripNumber - 1] || 'unknown';
}

