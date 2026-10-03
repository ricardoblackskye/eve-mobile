import { View, Text, StyleSheet } from 'react-native';
import { darkFactoryMock } from './dark-factory/mockData';

export const options = { title: 'Dark Factory' };

function DarkFactoryScreen() {
  const { title, runs } = darkFactoryMock;
  return (
    <View style={styles.container} testID="dark-factory-screen">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Run overview (mocked)</Text>
      {runs.map((run) => (
        <View key={run.id} style={styles.row} testID={`run-row-${run.id}`}>
          <Text style={styles.runId}>{run.id}</Text>
          <Text style={styles.runStatus}>{run.status}</Text>
          <Text style={styles.runAgent}>{run.agent}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, opacity: 0.6, marginBottom: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  runId: { fontWeight: '600' },
  runStatus: { color: '#2a9d8f' },
  runAgent: { opacity: 0.7 },
});

export default DarkFactoryScreen;
export { DarkFactoryScreen };
