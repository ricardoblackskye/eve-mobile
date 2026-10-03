import Svg, { Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { computeOutcomeMix, STATUS_COLORS } from './overview';
import { RunStatus } from './mockData';
import { colors } from '../theme/colors';

const W = 300;
const H = 260;
const CX = W / 2;
const CY = H / 2;
const RING_R = 78;
const RING_W = 24;
const CHIP_R = 118;
const GAP = 0.05; // radians trimmed from each side of a slice

function polar(angle: number, r: number) {
  return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
}

// Neon donut: glowing arc segments with gaps, thin guide rings and percentage chips.
export function PieChart({ counts }: { counts: Record<RunStatus, number> }) {
  const mix = computeOutcomeMix(counts);
  const total = mix.reduce((s, m) => s + m.value, 0) || 1;
  const nonZero = mix.filter((m) => m.value > 0).length;

  const slices = mix.map((m, i) => {
    const before = mix.slice(0, i).reduce((s, x) => s + x.value, 0);
    const from = (before / total) * 2 * Math.PI - Math.PI / 2;
    const to = ((before + m.value) / total) * 2 * Math.PI - Math.PI / 2;
    const gap = nonZero > 1 ? GAP : 0;
    const a0 = from + gap;
    const a1 = to - gap;
    const p0 = polar(a0, RING_R);
    const p1 = polar(a1, RING_R);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d =
      m.value <= 0
        ? ''
        : nonZero === 1
          ? `M ${CX} ${CY - RING_R} A ${RING_R} ${RING_R} 0 1 1 ${CX - 0.01} ${CY - RING_R}`
          : `M ${p0.x} ${p0.y} A ${RING_R} ${RING_R} 0 ${large} 1 ${p1.x} ${p1.y}`;
    return {
      d,
      color: STATUS_COLORS[m.status],
      status: m.status,
      percent: m.percent,
      chip: polar((from + to) / 2, CHIP_R),
    };
  });

  return (
    <View testID="outcome-mix-pie" style={styles.wrap}>
      <Svg width={W} height={H} testID="outcome-mix-pie-svg">
        <Circle cx={CX} cy={CY} r={RING_R + RING_W / 2 + 8} stroke={colors.border} strokeWidth={1} fill="none" />
        <Circle cx={CX} cy={CY} r={RING_R - RING_W / 2 - 8} stroke={colors.border} strokeWidth={1} fill="none" />
        {slices.map((s, i) =>
          s.d ? (
            <G key={i}>
              <Path d={s.d} stroke={s.color} strokeOpacity={0.25} strokeWidth={RING_W + 10} fill="none" />
              <Path d={s.d} stroke={s.color} strokeWidth={RING_W} fill="none" />
            </G>
          ) : null,
        )}
        {slices.map((s, i) =>
          s.d ? (
            <G key={`chip-${i}`}>
              <Rect
                x={s.chip.x - 22}
                y={s.chip.y - 11}
                width={44}
                height={22}
                rx={4}
                fill="rgba(10,18,40,0.85)"
                stroke={s.color}
                strokeWidth={1}
              />
              <SvgText
                x={s.chip.x}
                y={s.chip.y + 4}
                fontSize={12}
                fill={s.color}
                textAnchor="middle"
              >
                {`${s.percent}%`}
              </SvgText>
            </G>
          ) : null,
        )}
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
  legend: { marginTop: 4 },
  legendItem: { fontSize: 12, marginVertical: 2, color: colors.text },
});
