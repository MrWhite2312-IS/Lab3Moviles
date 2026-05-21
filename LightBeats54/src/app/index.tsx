import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LightBeats } from '@/components/light-beats';
import { AccelerometerDisplay } from '@/components/accelerometer-display';

type Tab = 'lightbeats' | 'accelerometer';

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('lightbeats');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, activeTab === 'lightbeats' && styles.tabActive]}
          onPress={() => setActiveTab('lightbeats')}
        >
          <Text style={[styles.tabText, activeTab === 'lightbeats' && styles.tabTextActive]}>
            LightBeats
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'accelerometer' && styles.tabActive]}
          onPress={() => setActiveTab('accelerometer')}
        >
          <Text style={[styles.tabText, activeTab === 'accelerometer' && styles.tabTextActive]}>
            Acelerómetro
          </Text>
        </Pressable>
      </View>

      <View style={styles.screen}>
        {activeTab === 'lightbeats' ? <LightBeats /> : <AccelerometerDisplay />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFD700',
  },
  screen: {
    flex: 1,
  },
});
