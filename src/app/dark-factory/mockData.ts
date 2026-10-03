export interface DarkFactoryRun {
  id: string;
  status: string;
  agent: string;
}

export interface DarkFactoryOverview {
  title: string;
  runs: DarkFactoryRun[];
}

// Mocked Dark Factory run-overview payload. The /dark-factory page renders this
// initially so it is demonstrable without a live backend. Live data wiring is a
// follow-up (fail-open to live later).
export const darkFactoryMock: DarkFactoryOverview = {
  title: 'Dark Factory',
  runs: [
    { id: 'run-001', status: 'RUNNING', agent: 'builder' },
    { id: 'run-002', status: 'COMPLETED', agent: 'tester' },
  ],
};
