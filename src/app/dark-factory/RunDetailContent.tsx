import { View, Text, StyleSheet } from 'react-native';
import { darkFactoryMock } from './mockData';

export function RunDetailContent({ id }: { id?: string }) {
  const run = darkFactoryMock.recentExecutions.find((r) => r.id === id);
  return (
    <View style={styles.container} testID="run-detail-screen">
      <Text style={styles.title}>Run {id}</Text>
      {run ? (
        <View>
          <Text testID="run-detail-status">Status: {run.status}</Text>
          <Text>Agent: {run.agent}</Text>
          <Text>Started: {run.startedAt}</Text>
          <Text>Duration: {run.durationMs != null ? `${run.durationMs} ms` : 'Unmeasured'}</Text>
        </View>
      ) : (
        <Text testID="run-detail-unknown">No live data — showing mocked placeholder.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
});
