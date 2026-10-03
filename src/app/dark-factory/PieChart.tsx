import Svg, { Path, Circle } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { computeOutcomeMix, STATUS_COLORS } from './overview';
import { RunStatus } from './mockData';

export function PieChart({
  counts,
  size = 160,
}: {
  counts: Record<RunStatus, number>;
  size?: number;
}) {
  const mix = computeOutcomeMix(counts);
  const total = mix.reduce((s, m) => s + m.value, 0) || 1;
  const radius = size / 2;
  const cx = radius;
  const cy = radius;
  const cumulative: number[] = [];
  mix.reduce((sum, m, i) => {
    cumulative[i] = sum + m.value;
    return cumulative[i];
  }, 0);
  const slices = mix.map((m, i) => {
    const prev = i === 0 ? 0 : cumulative[i - 1];
    const start = (prev / total) * 2 * Math.PI - Math.PI / 2;
    const end = (cumulative[i] / total) * 2 * Math.PI - Math.PI / 2;
    const largeArc = end - start > Math.PI ? 1 : 0;
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { d, color: STATUS_COLORS[m.status], status: m.status, percent: m.percent };
  });

  return (
    <View testID="outcome-mix-pie" style={styles.wrap}>
      <Svg width={size} height={size} testID="outcome-mix-pie-svg">
        {slices.map((s, i) => (
          <Path key={i} d={s.d} fill={s.color} />
        ))}
        <Circle cx={cx} cy={cy} r={radius * 0.45} fill="#fff" />
      </Svg>
      <View style={styles.legend}>
        {mix.map((m) => (
          <Text key={m.status} style={styles.legendItem}>
            <Text style={{ color: STATUS_COLORS[m.status] }}>● </Text>
            {m.status} {m.percent}%
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginVertical: 8 },
  legend: { marginTop: 8 },
  legendItem: { fontSize: 12, marginVertical: 2 },
});
