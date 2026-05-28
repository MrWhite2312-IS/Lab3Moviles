import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  contentLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 20,
    maxWidth: 1000,
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
  visualizerLandscape: {
    height: 80,
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
  flashIndicatorLandscape: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  buttonDisabled: {
    opacity: 0.5,
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
  status: {
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
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
  infoText: {
    color: '#0099ff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  orientationControls: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
});
