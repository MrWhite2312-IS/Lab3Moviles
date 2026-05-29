import { useEffect, useRef, useState } from 'react';

interface FlashlightControlOptions {
  amplitude: number;
  beatThreshold: number;
}

export function useFlashlightControl() {
  const [isFlashlightOn, setIsFlashlightOn] = useState(false);
  const lastBeatTimeRef = useRef(0);
  const turnOffTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minBeatIntervalMs = 50;
  const turnOffDelayMs = 200;



  const updateFlashlightByAmplitude = (options: FlashlightControlOptions) => {
    const { amplitude, beatThreshold } = options;
    const currentTime = Date.now();

    if (amplitude > beatThreshold) {
      if (turnOffTimeoutRef.current) {
        clearTimeout(turnOffTimeoutRef.current);
        turnOffTimeoutRef.current = null;
      }

      setIsFlashlightOn(true);

      if (currentTime - lastBeatTimeRef.current > minBeatIntervalMs) {
        lastBeatTimeRef.current = currentTime;
      }
    } else {
      if (!turnOffTimeoutRef.current) {
        turnOffTimeoutRef.current = setTimeout(() => {
          setIsFlashlightOn(false);
          turnOffTimeoutRef.current = null;
        }, turnOffDelayMs);
      }
    }
  };
  useEffect(() => {
    return () => {
      if (turnOffTimeoutRef.current) {
        clearTimeout(turnOffTimeoutRef.current);
        turnOffTimeoutRef.current = null;
      }
    };
  }, []);

  const turnOffFlashlight = () => {
    if (turnOffTimeoutRef.current) {
      clearTimeout(turnOffTimeoutRef.current);
      turnOffTimeoutRef.current = null;
    }
    setIsFlashlightOn(false);
  };

  return {
    isFlashlightOn,
    updateFlashlightByAmplitude,
    turnOffFlashlight,
  };
}