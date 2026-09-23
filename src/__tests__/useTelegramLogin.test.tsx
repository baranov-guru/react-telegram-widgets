import { act, renderHook, waitFor } from '@testing-library/react';

import { loadTelegramLoginScript } from '../loadTelegramLoginScript';
import { TelegramLoginSdk } from '../types';
import { useTelegramLogin } from '../useTelegramLogin';

jest.mock('../loadTelegramLoginScript', () => ({
  loadTelegramLoginScript: jest.fn(),
}));

const loadMock = loadTelegramLoginScript as jest.MockedFunction<
  typeof loadTelegramLoginScript
>;

describe('useTelegramLogin', () => {
  let sdk: TelegramLoginSdk;
  let initCallback: ((result: unknown) => void) | undefined;

  beforeEach(() => {
    initCallback = undefined;
    sdk = {
      init: jest.fn((_options, callback) => {
        initCallback = callback;
      }),
      open: jest.fn(),
      auth: jest.fn((_options, callback) => {
        initCallback = callback;
      }),
    };
    loadMock.mockResolvedValue(sdk);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads the script and calls Telegram.Login.init on mount', async () => {
    const { result } = renderHook(() =>
      useTelegramLogin({
        clientId: 123456,
        scope: ['profile', 'write'],
        lang: 'en',
        nonce: 'n1',
      })
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(loadMock).toHaveBeenCalledTimes(1);
    expect(sdk.init).toHaveBeenCalledWith(
      {
        client_id: 123456,
        scope: ['profile', 'write'],
        lang: 'en',
        nonce: 'n1',
      },
      expect.any(Function)
    );
  });

  it('calls open when login is invoked after init', async () => {
    const { result } = renderHook(() => useTelegramLogin({ clientId: 1 }));

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    await act(async () => {
      await result.current.login();
    });

    expect(sdk.open).toHaveBeenCalledTimes(1);
    expect(sdk.auth).not.toHaveBeenCalled();
  });

  it('uses auth when login is invoked without prior init', async () => {
    const { result } = renderHook(() =>
      useTelegramLogin({ clientId: 42, autoInit: false })
    );

    expect(result.current.isReady).toBe(false);

    await act(async () => {
      await result.current.login();
    });

    expect(sdk.auth).toHaveBeenCalledWith(
      { client_id: 42 },
      expect.any(Function)
    );
    expect(result.current.isReady).toBe(true);
  });

  it('invokes onAuth for a successful result', async () => {
    const onAuth = jest.fn();
    const { result } = renderHook(() =>
      useTelegramLogin({ clientId: 1, onAuth })
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      initCallback?.({
        id_token: 'token',
        user: { id: 7, preferred_username: 'ada' },
      });
    });

    expect(onAuth).toHaveBeenCalledWith({
      id_token: 'token',
      user: { id: 7, preferred_username: 'ada' },
    });
    expect(result.current.error).toBeNull();
  });

  it('invokes onError for an error result', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() =>
      useTelegramLogin({ clientId: 1, onError })
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    act(() => {
      initCallback?.({ error: 'access_denied' });
    });

    expect(onError).toHaveBeenCalledWith('access_denied');
    expect(result.current.error).toBe('access_denied');
  });

  it('uses the latest onAuth after the prop changes without re-init', async () => {
    const onAuth1 = jest.fn();
    const onAuth2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ onAuth }) => useTelegramLogin({ clientId: 1, onAuth }),
      { initialProps: { onAuth: onAuth1 } }
    );

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(sdk.init).toHaveBeenCalledTimes(1);

    rerender({ onAuth: onAuth2 });

    expect(sdk.init).toHaveBeenCalledTimes(1);

    act(() => {
      initCallback?.({
        id_token: 'token',
        user: { id: 1 },
      });
    });

    expect(onAuth1).not.toHaveBeenCalled();
    expect(onAuth2).toHaveBeenCalledWith({
      id_token: 'token',
      user: { id: 1 },
    });
  });

  it('reports script load failures', async () => {
    loadMock.mockRejectedValueOnce(
      new Error('Failed to load Telegram Login script')
    );
    const onError = jest.fn();

    const { result } = renderHook(() =>
      useTelegramLogin({ clientId: 1, onError })
    );

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to load Telegram Login script');
    });

    expect(result.current.isReady).toBe(false);
    expect(onError).toHaveBeenCalledWith(
      'Failed to load Telegram Login script'
    );
  });
});
