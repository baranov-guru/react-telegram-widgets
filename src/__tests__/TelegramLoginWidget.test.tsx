import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import TelegramLoginWidget from '../TelegramLoginWidget';
import { loadTelegramLoginScript } from '../loadTelegramLoginScript';
import { TelegramLoginSdk } from '../types';

jest.mock('../loadTelegramLoginScript', () => ({
  loadTelegramLoginScript: jest.fn(),
}));

const loadMock = loadTelegramLoginScript as jest.MockedFunction<
  typeof loadTelegramLoginScript
>;

describe('TelegramLoginWidget', () => {
  let sdk: TelegramLoginSdk;

  beforeEach(() => {
    sdk = {
      init: jest.fn(),
      open: jest.fn(),
      auth: jest.fn(),
    };
    loadMock.mockResolvedValue(sdk);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a disabled default button until the SDK is ready', async () => {
    let resolveLoad: (value: TelegramLoginSdk) => void = () => undefined;
    loadMock.mockReturnValue(
      new Promise<TelegramLoginSdk>(resolve => {
        resolveLoad = resolve;
      })
    );

    render(<TelegramLoginWidget clientId={123} />);

    const button = screen.getByRole('button', {
      name: 'Log in with Telegram',
    });
    expect(button).toBeDisabled();

    await act(async () => {
      resolveLoad(sdk);
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('calls login (open) when the button is clicked', async () => {
    render(<TelegramLoginWidget clientId={123} />);

    const button = await screen.findByRole('button', {
      name: 'Log in with Telegram',
    });
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(sdk.open).toHaveBeenCalledTimes(1);
    });
  });

  it('renders custom children text inside the button', async () => {
    render(<TelegramLoginWidget clientId={1}>Sign in</TelegramLoginWidget>);

    expect(
      await screen.findByRole('button', { name: 'Sign in' })
    ).toBeInTheDocument();
  });

  it('clones a single child element with onClick', async () => {
    const childClick = jest.fn();
    render(
      <TelegramLoginWidget clientId={1}>
        <button type='button' onClick={childClick}>
          Custom
        </button>
      </TelegramLoginWidget>
    );

    const button = await screen.findByRole('button', { name: 'Custom' });
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });

    fireEvent.click(button);

    expect(childClick).toHaveBeenCalled();
    await waitFor(() => {
      expect(sdk.open).toHaveBeenCalledTimes(1);
    });
  });

  it('forwards onAuth from a successful SDK callback', async () => {
    const onAuth = jest.fn();
    let initCallback: ((result: unknown) => void) | undefined;
    sdk.init = jest.fn((_options, callback) => {
      initCallback = callback;
    });

    render(<TelegramLoginWidget clientId={9} onAuth={onAuth} />);

    await waitFor(() => {
      expect(sdk.init).toHaveBeenCalled();
    });

    act(() => {
      initCallback?.({
        id_token: 'jwt',
        user: { id: 3, name: 'Ada' },
      });
    });

    expect(onAuth).toHaveBeenCalledWith({
      id_token: 'jwt',
      user: { id: 3, name: 'Ada' },
    });
  });
});
