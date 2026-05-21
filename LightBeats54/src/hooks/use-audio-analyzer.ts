import { useCallback, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

export function useAudioAnalyzer() {
  const [amplitude, setAmplitude] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startListening = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        setError('Se requiere permiso de micrófono');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });

      recordingRef.current = recording;
      setIsListening(true);
      setError(null);

      intervalRef.current = setInterval(async () => {
        if (!recordingRef.current) return;
        const status = await recordingRef.current.getStatusAsync();
        if (status.isRecording && status.metering !== undefined) {
          // dBFS → [0.0, 1.0] normalization formula, AI-assisted (Anthropic, 2025)
          const normalized = Math.max(0, Math.min(1, (status.metering + 60) / 60));
          setAmplitude(normalized);
        }
      }, 50);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar micrófono');
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
    });
    setIsListening(false);
    setAmplitude(0);
  }, []);

  useEffect(() => {
    return () => {
      
      stopListening().catch(() => {});
    };
  }, [stopListening]);

  return { amplitude, isListening, error, startListening, stopListening };
}