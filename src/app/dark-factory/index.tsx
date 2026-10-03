import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { darkFactoryMock } from './mockData';
import { STATUS_ORDER, STATUS_COLORS } from './overview';
import { PieChart } from './PieChart';
import { LineChart } from './LineChart';

export const options = { title: 'Dark Factory' };

function StatusTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View testID={`status-tile-${label}`} style={[styles.tile, { borderLeftColor: color }]}>
      <Text style={styles.tileValue}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

function DarkFactoryScreen() {
  const o = darkFactoryMock;
  return (
    <ScrollView style={styles.container} testID="dark-factory-screen">
      <Text style={styles.title}>{o.heading}</Text>
      <Text style={styles.subtitle}>{o.subheading}</Text>

      <View style={styles.tiles} testID="status-tiles">
        {STATUS_ORDER.map((s) => (
          <StatusTile key={s} label={s} value={o.statusCounts[s]} color={STATUS_COLORS[s]} />
        ))}
      </View>

      <Text style={styles.section}>Outcome Mix</Text>
      <PieChart counts={o.statusCounts} />

      <Text style={styles.section}>Recent Executions</Text>
      <View testID="recent-executions" style={styles.list}>
        {o.recentExecutions.map((run) => (
          <Link key={run.id} href={`/dark-factory/${run.id}`} style={styles.rowLink}>
            <View testID={`execution-${run.id}`} style={styles.row}>
              <Text style={styles.runId}>{run.id}</Text>
              <Text style={[styles.runStatus, { color: STATUS_COLORS[run.status] }]}>{run.status}</Text>
              <Text style={styles.runAgent}>{run.agent}</Text>
            </View>
          </Link>
        ))}
      </View>

      <Text style={styles.section}>Resource Snapshot</Text>
      <View testID="resource-snapshot" style={styles.snapshot}>
        <Text>Mean latency: {o.resourceSnapshot.meanLatencyMs} ms</Text>
        <Text>
          Recorded cost:{' '}
          {o.resourceSnapshot.unmeasured ? 'Unmeasured' : o.resourceSnapshot.recordedCost}
        </Text>
      </View>

      <Text style={styles.section}>Outcome Trend</Text>
      <LineChart series={o.trend} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 13, opacity: 0.6, marginBottom: 16 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  tileValue: { fontSize: 24, fontWeight: 'bold' },
  tileLabel: { fontSize: 13, opacity: 0.7 },
  section: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  list: {},
  rowLink: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  runId: { fontWeight: '600' },
  runStatus: {},
  runAgent: { opacity: 0.7 },
  snapshot: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12 },
});

export default DarkFactoryScreen;
export { DarkFactoryScreen };
