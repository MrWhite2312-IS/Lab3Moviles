import { useEffect, useState } from 'react';
import { Accelerometer } from 'expo-sensors';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

const UPDATE_INTERVAL_MS = 100;

export function useAccelerometer() {
  const [data, setData] = useState<AccelerometerData>({ x: 0, y: 0, z: 0 });
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    let subscription: { remove(): void } | null = null;

    Accelerometer.isAvailableAsync().then((available) => {
      setIsAvailable(available);
      if (!available) return;

      Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
      subscription = Accelerometer.addListener(setData);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  return { data, isAvailable };
}
