import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DarkFactoryScreen } from '../src/app/dark-factory';

describe('DarkFactoryScreen', () => {
  it('renders the Dark Factory title', async () => {
    await render(<DarkFactoryScreen />);
    expect(screen.getByText('Dark Factory')).toBeTruthy();
  });

  it('renders mocked run-overview data initially', async () => {
    await render(<DarkFactoryScreen />);
    // Mocked run ids from src/app/dark-factory/mockData.ts
    expect(screen.getByText('run-001')).toBeTruthy();
    expect(screen.getByText('run-002')).toBeTruthy();
  });
});
