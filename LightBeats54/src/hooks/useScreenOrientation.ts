import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';

export function useScreenOrientation(
  lock?: ScreenOrientation.OrientationLock
): ScreenOrientation.Orientation | null {
  const [orientation, setOrientation] =
    useState<ScreenOrientation.Orientation | null>(null);

  useEffect(() => {
    if (lock !== undefined) {
      ScreenOrientation.lockAsync(lock);
    }

    const sub = ScreenOrientation.addOrientationChangeListener((e) => {
      setOrientation(e.orientationInfo.orientation);
    });

    // Leer orientación inicial
    ScreenOrientation.getOrientationAsync().then(setOrientation);

    return () => {
      ScreenOrientation.removeOrientationChangeListener(sub);
      if (lock !== undefined) {
        ScreenOrientation.unlockAsync();
      }
    };
  }, [lock]);

  return orientation;
}