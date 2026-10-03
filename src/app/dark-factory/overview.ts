import { RunStatus } from './mockData';

export const STATUS_ORDER: RunStatus[] = ['ACTIVE', 'BLOCKED', 'COMPLETED', 'FAILED'];

export const STATUS_COLORS: Record<RunStatus, string> = {
  ACTIVE: '#2a9d8f',
  BLOCKED: '#e9c46a',
  COMPLETED: '#264653',
  FAILED: '#e76f51',
};

export interface MixSlice {
  status: RunStatus;
  value: number;
  percent: number;
}

export function computeOutcomeMix(counts: Record<RunStatus, number>): MixSlice[] {
  const total = STATUS_ORDER.reduce((s, k) => s + (counts[k] || 0), 0) || 1;
  return STATUS_ORDER.map((status) => {
    const value = counts[status] || 0;
    return { status, value, percent: Math.round((value / total) * 100) };
  });
}

export interface Point {
  x: number;
  y: number;
}

// Scale a numeric series into SVG coordinates within [pad, size-pad] on both axes.
export function getTrendPoints(
  series: number[],
  width: number,
  height: number,
  pad = 8,
): Point[] {
  if (series.length === 0) return [];
  const max = Math.max(...series, 1);
  const min = Math.min(...series, 0);
  const span = max - min || 1;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const stepX = series.length > 1 ? innerW / (series.length - 1) : 0;
  return series.map((v, i) => ({
    x: pad + stepX * i,
    y: pad + (1 - (v - min) / span) * innerH,
  }));
}
