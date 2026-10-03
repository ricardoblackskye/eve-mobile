import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { darkFactoryMock } from '../../dark-factory/mockData';
import { STATUS_ORDER, STATUS_COLORS } from '../../dark-factory/overview';
import { PieChart } from '../../dark-factory/PieChart';
import { LineChart } from '../../dark-factory/LineChart';

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
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, styles.colRunId]}>Run ID</Text>
          <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
          <Text style={[styles.headerCell, styles.colAgent]}>Agent</Text>
        </View>
        {o.recentExecutions.map((run) => (
          <Link key={run.id} href={`/dark-factory/${run.id}`} asChild>
            <Pressable testID={`execution-${run.id}`} style={styles.row}>
              <Text style={[styles.cell, styles.colRunId, styles.runId]}>{run.id}</Text>
              <Text style={[styles.cell, styles.colStatus, styles.runStatus, { color: STATUS_COLORS[run.status] }]}>
                {run.status}
              </Text>
              <Text style={[styles.cell, styles.colAgent, styles.runAgent]}>{run.agent}</Text>
            </Pressable>
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
  list: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e5e5',
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  colRunId: {
    flex: 1.1,
  },
  colStatus: {
    flex: 1.2,
  },
  colAgent: {
    flex: 1,
  },
  runId: {
    fontWeight: '600',
    color: '#222',
  },
  runStatus: {
    fontWeight: '600',
  },
  runAgent: {
    opacity: 0.7,
  },
  snapshot: { backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12 },
});

export default DarkFactoryScreen;
export { DarkFactoryScreen };
