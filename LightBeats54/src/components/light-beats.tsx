import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { CameraView } from 'expo-camera';
import Slider from '@react-native-community/slider';
import { useAudioAnalyzer } from '@/hooks/use-audio-analyzer';
import { useFlashlightControl } from '@/hooks/use-flashlight-control';
import { useAccelerometer } from '@/hooks/use-accelerometer';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';



export function LightBeats() {
  const orientation = useScreenOrientation();
  const { amplitude, isListening, error, startListening, stopListening } =
    useAudioAnalyzer();
  const { data: accelData } = useAccelerometer();
  const { isFlashlightOn, requestCameraPermission, updateFlashlightByAmplitude, turnOffFlashlight } =
    useFlashlightControl();

  const [isStarted, setIsStarted] = useState(false);
  const [cameraHasPermission, setCameraHasPermission] = useState(false);
  const [faceDownStopped, setFaceDownStopped] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0.5)).current;
  const [beatPercent, setBeatPercent] = useState(70);
  const BEAT_THRESHOLD = beatPercent / 100;

  
  useEffect(() => {
    const initPermissions = async () => {
      if (Platform.OS !== 'web') {
        const hasPermission = await requestCameraPermission();
        setCameraHasPermission(hasPermission);
      }
    };
    initPermissions();
  }, [requestCameraPermission]);

  // Z normalizado: ~+1 boca arriba, ~-1 boca abajo (independiente de Android/iOS)
  useEffect(() => {
    const gravity = Platform.OS === 'ios' ? 1 : 9.8;
    const normalizedZ = accelData.z / gravity;
    if (normalizedZ < -0.75 && isStarted) {
      stopListening();
      turnOffFlashlight();
      setIsStarted(false);
      setFaceDownStopped(true);
    } else if (normalizedZ >= -0.75) {
      setFaceDownStopped(false);
    }
  }, [accelData.z, isStarted, stopListening, turnOffFlashlight]);

  useEffect(() => {
    if (isListening) {
      updateFlashlightByAmplitude({
        amplitude,
        beatThreshold: BEAT_THRESHOLD,
      });
    }
  }, [amplitude, isListening, updateFlashlightByAmplitude, BEAT_THRESHOLD]);
  useEffect(() => {
    
    if (isFlashlightOn) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFlashlightOn, scaleAnim, opacityAnim, amplitude, cameraHasPermission]);

  const handleToggle = useCallback(async () => {
    if (!isStarted) {
      await startListening();
      setIsStarted(true);
    } else {
      await stopListening();
      setIsStarted(false);
    }
  }, [isStarted, startListening, stopListening]);

  

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' && cameraHasPermission && (
        <CameraView
          style={{ width: 1, height: 1, position: 'absolute',opacity : 0 }}
          facing="back"
          enableTorch={isFlashlightOn}
        />
      )}

      <View
        style={[
          styles.content,
          (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
            orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) && styles.contentLandscape,
        ]}
      >
        <Text style={[styles.title, { color: '#FFD700' }]}>
            LightBeats
          </Text>
        <View style={[styles.amplitudeContainer, (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) && styles.amplitudeContainerLandscape]}>
          

          <View style={[styles.visualizer, (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) && styles.visualizerLandscape]}>
            {Array.from({ length: 10 }).map((_, i) => {
              const barHeight = Math.max(
                10,
                Math.min(100, amplitude * 150 * (0.7 + (i % 3) * 0.15))
              );
              return (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    {
                      height: `${barHeight}%`,
                      backgroundColor: isFlashlightOn ? '#FFD700' : '#888',
                    },
                  ]}
                />
              );
            })}
          </View>

          <Animated.View
            style={[
              styles.flashIndicator,
              (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) && styles.flashIndicatorLandscape,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
                backgroundColor: isFlashlightOn ? '#FFD700' : '#333',
              },
            ]}
          />

          <Text style={[styles.amplitudeText, { color: (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) ? '#fff' : '#444' }]}>
            Amplitud: {(amplitude * 100).toFixed(0)}%
          </Text>

          <Text style={[styles.amplitudeText, { color: (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) ? '#fff' : '#444' }]}>
            Umbral: {beatPercent}%
          </Text>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={5}
            value={beatPercent}
            onValueChange={(v: number) => setBeatPercent(Math.round(v))}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="#888"
            thumbTintColor="#FFD700"
          />

          {error && (
            <Text style={[styles.errorText, { color: (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) ? '#fff' : '#ff6b6b' }]}>{error}</Text>
          )}
        </View>

        <View style={[styles.controlsContainer, (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) && styles.controlsContainerLandscape]}>
        <Pressable
          onPress={handleToggle}
          style={[
            styles.button,
            isStarted && styles.buttonActive,
            !cameraHasPermission &&
              Platform.OS !== 'web' && styles.buttonDisabled,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              isStarted && styles.buttonTextActive,
              { color: (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) ? '#000' : '#fff' },
            ]}
          >
            {isStarted ? 'DETENER' : 'INICIAR'}
          </Text>
        </Pressable>

        <Text style={[styles.status, { color: (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) ? '#fff' : '#000' }]}>
          {isStarted
            ? isListening
              ? 'Escuchando...'
              : 'Iniciando...'
            : 'Detenido'}
        </Text>

        <Text style={[styles.orientationText, { color: (orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) ? '#fff' : '#444' }]}>Orientación: {orientation ?? 'desconocida'}</Text>

        {!cameraHasPermission && Platform.OS !== 'web' && (
          <Text style={styles.warningText}>
             Se requiere permiso de cámara para usar la linterna
          </Text>
        )}

        {faceDownStopped && (
          <Text style={styles.warningText}>
            Teléfono boca abajo — linterna apagada
          </Text>
        )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 30,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  amplitudeContainer: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  amplitudeContainerLandscape: {
    flex: 1,
    alignItems: 'center',
    width: '40%',
    paddingRight: 8,
  },
  controlsContainer: {
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  controlsContainerLandscape: {
    flex: 1,
    alignItems: 'center',
    width: '60%',
    paddingLeft: 8,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 120,
    gap: 8,
    width: '100%',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    minHeight: 10,
  },
  flashIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  amplitudeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    backgroundColor: '#333',
    minWidth: 200,
  },
  buttonActive: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#000',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  status: {
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  infoText: {
    color: '#0099ff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  warningText: {
    color: '#ff9800',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  orientationText: {
    fontSize: 12,
    color: '#444',
    marginTop: 8,
  },
  orientationControls: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  contentLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    maxWidth: 1000,
  },
  visualizerLandscape: {
    height: 80,
  },
  flashIndicatorLandscape: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
});
