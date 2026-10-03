import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

const CORNER = 10;

// Glass tile with a glowing accent bar and bracket corners.
export function NeonCard({
  accent,
  children,
  style,
  testID,
}: {
  accent: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}) {
  return (
    <View
      testID={testID}
      style={[
        styles.card,
        { borderColor: accent + '66', boxShadow: `0 0 14px ${accent}55` },
        style,
      ]}
    >
      <View style={[styles.bar, { backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }]} />
      <View style={[styles.corner, styles.tl, { borderColor: accent }]} />
      <View style={[styles.corner, styles.tr, { borderColor: accent }]} />
      <View style={[styles.corner, styles.bl, { borderColor: accent }]} />
      <View style={[styles.corner, styles.br, { borderColor: accent }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 16,
    overflow: 'visible',
  },
  bar: { position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, borderRadius: 2 },
  corner: { position: 'absolute', width: CORNER, height: CORNER },
  tl: { top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 6 },
  tr: { top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 6 },
  bl: { bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 6 },
  br: { bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 6 },
});
