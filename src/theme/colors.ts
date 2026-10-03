// Single source of truth for the neon "Dark Factory" look.
export const colors = {
  bgTop: '#0B1226',
  bgBottom: '#03060F',
  surface: 'rgba(18, 28, 56, 0.72)',
  surfaceSolid: '#101A36',
  border: 'rgba(120, 160, 255, 0.28)',
  borderStrong: 'rgba(120, 190, 255, 0.55)',
  text: '#E8EEFF',
  textMuted: 'rgba(200, 214, 255, 0.62)',
  accent: '#38E8FF',

  // Run status accents
  active: '#2EE6D0',
  blocked: '#FFD166',
  completed: '#7B8CFF',
  failed: '#FF4D6D',
} as const;

export type StatusKey = 'ACTIVE' | 'BLOCKED' | 'COMPLETED' | 'FAILED';

export const statusColors: Record<StatusKey, string> = {
  ACTIVE: colors.active,
  BLOCKED: colors.blocked,
  COMPLETED: colors.completed,
  FAILED: colors.failed,
};
