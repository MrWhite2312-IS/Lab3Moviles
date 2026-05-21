import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useAccelerometer } from '@/hooks/use-accelerometer';
import { useScreenOrientation } from '@/hooks/useScreenOrientation';
import * as ScreenOrientation from 'expo-screen-orientation';

const UNIT = Platform.OS === 'ios' ? 'g' : 'm/s²';
// Gravity reference for normalizing the tilt ball position
const GRAVITY = Platform.OS === 'ios' ? 1 : 9.8;
const BALL_RANGE = 70;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function AccelerometerDisplay() {
  const { data, isAvailable } = useAccelerometer();
  const orientation = useScreenOrientation();
  const isLandscape =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  if (isAvailable === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.unavailableText}>
          El acelerómetro no está disponible en este dispositivo.
        </Text>
      </View>
    );
  }

  // Tilt ball visual design and X/Y axis to screen coordinates mapping, AI-assisted (Anthropic, 2025)
  const ballX = clamp(-data.x / GRAVITY, -1, 1) * BALL_RANGE;
  const ballY = clamp(data.y / GRAVITY, -1, 1) * BALL_RANGE;

  const magnitude = Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acelerómetro</Text>

      <View style={[styles.content, isLandscape && styles.contentLandscape]}>

        {/* Tilt ball visual */}
        <View style={styles.ballSection}>
          <View style={styles.arena}>
            <View style={styles.crossH} />
            <View style={styles.crossV} />
            <View style={[styles.ball, { transform: [{ translateX: ballX }, { translateY: ballY }] }]} />
          </View>
          <Text style={styles.ballLabel}>Inclinación (X / Y)</Text>
        </View>

        {/* Numeric data */}
        <View style={styles.dataSection}>
          <DataRow label="Eje X" value={data.x} unit={UNIT} color="#FF6B6B" />
          <DataRow label="Eje Y" value={data.y} unit={UNIT} color="#4ECDC4" />
          <DataRow label="Eje Z" value={data.z} unit={UNIT} color="#FFD700" />

          <View style={styles.divider} />

          <View style={styles.magnitudeRow}>
            <Text style={styles.magnitudeLabel}>Magnitud</Text>
            <Text style={styles.magnitudeValue}>
              {magnitude.toFixed(3)} <Text style={styles.unit}>{UNIT}</Text>
            </Text>
          </View>

          <Text style={styles.note}>Intervalo de actualización: 100 ms</Text>
        </View>

      </View>
    </View>
  );
}

function DataRow({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: string;
}) {
  return (
    <View style={styles.dataRow}>
      <Text style={[styles.axisLabel, { color }]}>{label}</Text>
      <Text style={styles.axisValue}>
        {value >= 0 ? ' ' : ''}
        {value.toFixed(4)}
      </Text>
      <Text style={styles.unit}> {unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    gap: 24,
    width: '100%',
    maxWidth: 400,
  },
  contentLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    maxWidth: 900,
    gap: 40,
  },
  ballSection: {
    alignItems: 'center',
    gap: 10,
  },
  arena: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#444',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossH: {
    position: 'absolute',
    width: '80%',
    height: 1,
    backgroundColor: '#333',
  },
  crossV: {
    position: 'absolute',
    width: 1,
    height: '80%',
    backgroundColor: '#333',
  },
  ball: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4ECDC4',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  ballLabel: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  dataSection: {
    gap: 14,
    width: '100%',
    maxWidth: 280,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  axisLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    width: 50,
  },
  axisValue: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    fontVariant: ['tabular-nums'],
    textAlign: 'right',
  },
  unit: {
    color: '#888',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 2,
  },
  magnitudeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  magnitudeLabel: {
    color: '#888',
    fontSize: 13,
  },
  magnitudeValue: {
    color: '#fff',
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  note: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  unavailableText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
