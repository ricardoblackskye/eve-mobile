export type RunStatus = 'ACTIVE' | 'BLOCKED' | 'COMPLETED' | 'FAILED';

export interface DarkFactoryRun {
  id: string;
  status: RunStatus;
  agent: string;
  startedAt: string;
  durationMs?: number;
}

export interface ResourceSnapshot {
  meanLatencyMs: number;
  recordedCost: string;
  unmeasured: boolean;
}

export interface DarkFactoryOverview {
  heading: string;
  subheading: string;
  statusCounts: Record<RunStatus, number>;
  recentExecutions: DarkFactoryRun[];
  resourceSnapshot: ResourceSnapshot;
  trend: number[];
}

// Mocked Dark Factory overview payload. The /dark-factory page renders this
// initially so it is demonstrable without a live backend. Live data wiring is a
// follow-up (fail-open to live later).
export const darkFactoryMock: DarkFactoryOverview = {
  heading: 'Factory Status',
  subheading: 'Persisted outcomes · current run load · recent activity',
  statusCounts: { ACTIVE: 3, BLOCKED: 1, COMPLETED: 12, FAILED: 2 },
  recentExecutions: [
    { id: 'run-001', status: 'COMPLETED', agent: 'tester', startedAt: '2026-10-03T14:02:00Z', durationMs: 48213 },
    { id: 'run-002', status: 'FAILED', agent: 'builder', startedAt: '2026-10-03T13:55:00Z', durationMs: 9120 },
    { id: 'run-003', status: 'ACTIVE', agent: 'crawler', startedAt: '2026-10-03T13:48:00Z' },
    { id: 'run-004', status: 'BLOCKED', agent: 'reviewer', startedAt: '2026-10-03T13:40:00Z' },
  ],
  resourceSnapshot: { meanLatencyMs: 142, recordedCost: '$0.03', unmeasured: false },
  trend: [4, 6, 5, 8, 7, 10, 9, 12, 11],
};
