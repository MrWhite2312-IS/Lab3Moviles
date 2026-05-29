import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';

export async function requestMicPermission(): Promise<boolean> {
  const { granted } = await Audio.requestPermissionsAsync();
  return granted;
}

export async function requestCameraPermission(): Promise<boolean> {
  const { granted } = await Camera.requestCameraPermissionsAsync();
  return granted;
}
