import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { DarkFactoryScreen } from '../src/app/dark-factory';
import { darkFactoryMock } from '../src/app/dark-factory/mockData';

describe('DarkFactoryScreen', () => {
  it('renders the Factory Status heading + subheading', async () => {
    await render(<DarkFactoryScreen />);
    expect(screen.getByText('Factory Status')).toBeTruthy();
    expect(
      screen.getByText('Persisted outcomes · current run load · recent activity'),
    ).toBeTruthy();
  });

  it('renders the four status tiles', async () => {
    await render(<DarkFactoryScreen />);
    expect(screen.getByTestId('status-tile-ACTIVE')).toBeTruthy();
    expect(screen.getByTestId('status-tile-BLOCKED')).toBeTruthy();
    expect(screen.getByTestId('status-tile-COMPLETED')).toBeTruthy();
    expect(screen.getByTestId('status-tile-FAILED')).toBeTruthy();
  });

  it('renders the outcome mix pie and trend line', async () => {
    await render(<DarkFactoryScreen />);
    expect(screen.getByTestId('outcome-mix-pie')).toBeTruthy();
    expect(screen.getByTestId('outcome-trend-line')).toBeTruthy();
  });

  it('renders recent executions as tappable rows', async () => {
    await render(<DarkFactoryScreen />);
    expect(screen.getByTestId('recent-executions')).toBeTruthy();
    for (const run of darkFactoryMock.recentExecutions) {
      expect(screen.getByTestId(`execution-${run.id}`)).toBeTruthy();
    }
  });

  it('renders the resource snapshot', async () => {
    await render(<DarkFactoryScreen />);
    expect(screen.getByTestId('resource-snapshot')).toBeTruthy();
  });
});
