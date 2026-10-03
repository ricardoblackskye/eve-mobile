import { computeOutcomeMix, getTrendPoints, STATUS_ORDER } from '../src/dark-factory/overview';
import { darkFactoryMock } from '../src/dark-factory/mockData';

describe('computeOutcomeMix', () => {
  it('returns all four statuses with values from counts', () => {
    const mix = computeOutcomeMix(darkFactoryMock.statusCounts);
    expect(mix.map((m) => m.status)).toEqual(STATUS_ORDER);
    const byStatus = Object.fromEntries(mix.map((m) => [m.status, m.value]));
    expect(byStatus).toEqual(darkFactoryMock.statusCounts);
  });

  it('percentages sum to ~100 (rounding tolerant)', () => {
    const mix = computeOutcomeMix(darkFactoryMock.statusCounts);
    const sum = mix.reduce((s, m) => s + m.percent, 0);
    expect(sum).toBeGreaterThanOrEqual(99);
    expect(sum).toBeLessThanOrEqual(101);
  });
});

describe('getTrendPoints', () => {
  const W = 300;
  const H = 140;
  const PAD = 8;

  it('returns one point per series value, scaled within bounds', () => {
    const series = darkFactoryMock.trend;
    const pts = getTrendPoints(series, W, H, PAD);
    expect(pts).toHaveLength(series.length);
    for (const p of pts) {
      expect(p.x).toBeGreaterThanOrEqual(PAD - 0.001);
      expect(p.x).toBeLessThanOrEqual(W - PAD + 0.001);
      expect(p.y).toBeGreaterThanOrEqual(PAD - 0.001);
      expect(p.y).toBeLessThanOrEqual(H - PAD + 0.001);
    }
  });

  it('handles an empty series', () => {
    expect(getTrendPoints([], W, H, PAD)).toEqual([]);
  });
});
