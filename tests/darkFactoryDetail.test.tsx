import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { RunDetailContent } from '../src/app/dark-factory/RunDetailContent';

describe('RunDetailContent', () => {
  it('renders mocked detail for a known run id', async () => {
    await render(<RunDetailContent id="run-001" />);
    expect(screen.getByTestId('run-detail-screen')).toBeTruthy();
    expect(screen.getByText('Status: COMPLETED')).toBeTruthy();
  });

  it('renders the unknown placeholder for an id with no match', async () => {
    await render(<RunDetailContent id="does-not-exist" />);
    expect(screen.getByTestId('run-detail-unknown')).toBeTruthy();
  });
});
