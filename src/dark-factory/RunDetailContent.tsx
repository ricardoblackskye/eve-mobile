import { Text, StyleSheet } from 'react-native';
import { darkFactoryMock } from './mockData';
import { STATUS_COLORS } from './overview';
import { Screen } from '../components/ui/Screen';
import { NeonCard } from '../components/ui/NeonCard';
import { colors } from '../theme/colors';
import { glowText } from '../theme/glow';

export function RunDetailContent({ id }: { id?: string }) {
  const run = darkFactoryMock.recentExecutions.find((r) => r.id === id);
  const accent = run ? STATUS_COLORS[run.status] : colors.accent;
  return (
    <Screen style={styles.container}>
      <Text style={styles.title} testID="run-detail-screen">
        Run {id}
      </Text>
      <NeonCard accent={accent}>
        {run ? (
          <>
            <Text testID="run-detail-status" style={[styles.status, { color: accent }, glowText(accent, 8)]}>
              Status: {run.status}
            </Text>
            <Text style={styles.line}>Agent: {run.agent}</Text>
            <Text style={styles.line}>Started: {run.startedAt}</Text>
            <Text style={styles.line}>
              Duration: {run.durationMs != null ? `${run.durationMs} ms` : 'Unmeasured'}
            </Text>
          </>
        ) : (
          <Text testID="run-detail-unknown" style={styles.line}>
            No live data — showing mocked placeholder.
          </Text>
        )}
      </NeonCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 14, color: colors.text },
  status: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  line: { color: colors.text, fontSize: 14, lineHeight: 22 },
});
