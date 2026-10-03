import React from 'react';
import { render } from '@testing-library/react-native';
import { useEveAgent } from 'eve/react';

jest.mock('eve/react', () => ({
  useEveAgent: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChatScreen = require('../app/ChatScreen').default;

const mockedUseEveAgent = useEveAgent as jest.Mock;

type Message = { id: string; role: string; parts: Array<{ type: string; text: string }> };
type Snapshot = Partial<{
  data: { messages: Message[] };
  status: string;
  error: Error | undefined;
  send: jest.Mock;
}>;

async function renderWith(snapshot: Snapshot) {
  mockedUseEveAgent.mockReturnValue({
    data: { messages: [] },
    status: 'ready',
    error: undefined,
    send: jest.fn(),
    respond: jest.fn(),
    cancel: jest.fn(),
    prewarm: jest.fn(),
    reset: jest.fn(),
    resume: jest.fn(),
    ...snapshot,
  } as any);
  // RNTL 14's render() is async and resolves to the query object.
  return render(<ChatScreen />);
}

describe('ChatScreen', () => {
  it('renders the composer (input + send button)', async () => {
    const { getByPlaceholderText, getByTestId } = await renderWith({});
    expect(getByPlaceholderText('Type your message…')).toBeTruthy();
    expect(getByTestId('chat-send')).toBeTruthy();
  });

  it('renders user and assistant text message bubbles', async () => {
    const { getByText } = await renderWith({
      data: {
        messages: [
          { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello Eve' }] },
          { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Hi there' }] },
        ],
      },
    });
    expect(getByText('Hello Eve')).toBeTruthy();
    expect(getByText('Hi there')).toBeTruthy();
  });

  it('disables the composer while the agent is streaming', async () => {
    const { getByTestId } = await renderWith({ status: 'streaming' });
    // While busy, the input is not editable and the send control shows a spinner
    // instead of the "Send" label (RNTL does not surface Pressable `disabled`).
    expect(getByTestId('chat-input').props.editable).toBe(false);
  });
});
