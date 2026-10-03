import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

export interface NeonColumn {
  key: string;
  label: string;
  flex: number;
}

export interface NeonCell {
  text: string;
  color?: string;
  glow?: boolean;
  bold?: boolean;
  style?: StyleProp<TextStyle>;
}

// Bordered grid table: header row + pressable body rows with vertical dividers.
export function NeonTable({
  columns,
  rows,
  testID,
}: {
  columns: NeonColumn[];
  rows: { key: string; testID?: string; onPress?: () => void; cells: Record<string, NeonCell> }[];
  testID?: string;
}) {
  return (
    <View testID={testID} style={styles.table}>
      <View style={[styles.row, styles.headerRow]}>
        {columns.map((c, i) => (
          <HeaderCell key={c.key} flex={c.flex} last={i === columns.length - 1}>
            {c.label}
          </HeaderCell>
        ))}
      </View>
      {rows.map((r, ri) => (
        <Pressable
          key={r.key}
          testID={r.testID}
          onPress={r.onPress}
          style={[styles.row, ri === rows.length - 1 ? null : styles.rowDivider]}
        >
          {columns.map((c, i) => {
            const cell = r.cells[c.key];
            return (
              <View
                key={c.key}
                style={[styles.cell, { flex: c.flex }, i === columns.length - 1 ? null : styles.cellDivider]}
              >
                <Text
                  style={[
                    styles.text,
                    cell.bold ? styles.bold : null,
                    cell.color ? { color: cell.color } : null,
                    cell.glow && cell.color
                      ? {
                          textShadowColor: cell.color,
                          textShadowOffset: { width: 0, height: 0 },
                          textShadowRadius: 8,
                        }
                      : null,
                    cell.style,
                  ]}
                >
                  {cell.text}
                </Text>
              </View>
            );
          })}
        </Pressable>
      ))}
    </View>
  );
}

function HeaderCell({ flex, last, children }: { flex: number; last: boolean; children: ReactNode }) {
  return (
    <View style={[styles.cell, { flex }, last ? null : styles.cellDivider]}>
      <Text style={styles.headerText}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: 'rgba(10, 18, 40, 0.6)',
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  headerRow: {
    backgroundColor: 'rgba(120, 160, 255, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(120, 160, 255, 0.16)' },
  cell: { paddingVertical: 12, paddingHorizontal: 12, justifyContent: 'center' },
  cellDivider: { borderRightWidth: 1, borderRightColor: 'rgba(120, 160, 255, 0.16)' },
  headerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  text: { color: colors.text, fontSize: 14 },
  bold: { fontWeight: '600' },
});
