import Svg, { Polyline, Line as SvgLine } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { getTrendPoints } from './overview';

export function LineChart({
  series,
  width = 300,
  height = 140,
}: {
  series: number[];
  width?: number;
  height?: number;
}) {
  const pts = getTrendPoints(series, width, height);
  const poly = pts.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <View testID="outcome-trend-line" style={styles.wrap}>
      <Svg width={width} height={height} testID="outcome-trend-line-svg">
        <SvgLine x1={8} y1={height - 8} x2={width - 8} y2={height - 8} stroke="#ccc" strokeWidth={1} />
        <Polyline points={poly} fill="none" stroke="#2a9d8f" strokeWidth={2} />
      </Svg>
      <Text style={styles.caption}>Outcome trend (mocked)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  caption: { fontSize: 12, opacity: 0.6, marginTop: 4 },
});
