import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { router } from 'expo-router';
import { darkFactoryMock } from '../../dark-factory/mockData';
import { STATUS_ORDER, STATUS_COLORS } from '../../dark-factory/overview';
import { PieChart } from '../../dark-factory/PieChart';
import { LineChart } from '../../dark-factory/LineChart';
import { Screen } from '../../components/ui/Screen';
import { NeonCard } from '../../components/ui/NeonCard';
import { NeonTable } from '../../components/ui/NeonTable';
import { colors } from '../../theme/colors';
import { glowText } from '../../theme/glow';

export const options = { title: 'Dark Factory' };

function StatusTile({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <NeonCard testID={`status-tile-${label}`} accent={color} style={styles.tile}>
      <Text style={[styles.tileValue, { color }, glowText(color, 10)]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </NeonCard>
  );
}

function DarkFactoryScreen() {
  const o = darkFactoryMock;
  return (
    <Screen>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        testID="dark-factory-screen"
      >
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
        <NeonTable
          testID="recent-executions"
          columns={[
            { key: 'id', label: 'Run ID', flex: 1.1 },
            { key: 'status', label: 'Status', flex: 1.3 },
            { key: 'agent', label: 'Agent', flex: 1 },
          ]}
          rows={o.recentExecutions.map((run) => ({
            key: run.id,
            testID: `execution-${run.id}`,
            onPress: () => router.push(`/dark-factory/${run.id}`),
            cells: {
              id: { text: run.id },
              status: { text: run.status, color: STATUS_COLORS[run.status], glow: true },
              agent: { text: run.agent },
            },
          }))}
        />

        <Text style={styles.section}>Resource Snapshot</Text>
        <NeonCard testID="resource-snapshot" accent={colors.accent}>
          <Text style={styles.snapshotText}>Mean latency: {o.resourceSnapshot.meanLatencyMs} ms</Text>
          <Text style={styles.snapshotText}>
            Recorded cost:{' '}
            {o.resourceSnapshot.unmeasured ? 'Unmeasured' : o.resourceSnapshot.recordedCost}
          </Text>
        </NeonCard>

        <Text style={styles.section}>Outcome Trend</Text>
        <LineChart series={o.trend} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 4, color: colors.text },
  subtitle: { fontSize: 13, color: colors.textMuted, marginBottom: 16 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', marginBottom: 14 },
  tileValue: { fontSize: 26, fontWeight: 'bold' },
  tileLabel: { fontSize: 13, color: colors.text, opacity: 0.85 },
  section: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8, color: colors.text },
  snapshotText: { color: colors.text, fontSize: 14, lineHeight: 22 },
});

export default DarkFactoryScreen;
export { DarkFactoryScreen };
