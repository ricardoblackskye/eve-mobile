import Svg, { Defs, LinearGradient, Polygon, Polyline, Line as SvgLine, Stop } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { getTrendPoints } from './overview';
import { colors } from '../theme/colors';

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
  const area =
    pts.length > 0
      ? `${pts[0].x},${height - 8} ${poly} ${pts[pts.length - 1].x},${height - 8}`
      : '';
  return (
    <View testID="outcome-trend-line" style={styles.wrap}>
      <Svg width={width} height={height} testID="outcome-trend-line-svg">
        <Defs>
          <LinearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.35} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <SvgLine x1={8} y1={height - 8} x2={width - 8} y2={height - 8} stroke={colors.border} strokeWidth={1} />
        {area ? <Polygon points={area} fill="url(#trendFill)" /> : null}
        <Polyline points={poly} fill="none" stroke={colors.accent} strokeOpacity={0.3} strokeWidth={6} />
        <Polyline points={poly} fill="none" stroke={colors.accent} strokeWidth={2} />
      </Svg>
      <Text style={styles.caption}>Outcome trend (mocked)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginVertical: 8 },
  caption: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
