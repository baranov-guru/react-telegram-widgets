import {
  TELEGRAM_LOGIN_SCRIPT_ID,
  TELEGRAM_LOGIN_SCRIPT_SRC,
} from '../constants';
import {
  __resetTelegramLoginScriptState,
  loadTelegramLoginScript,
} from '../loadTelegramLoginScript';
import { TelegramGlobal, TelegramLoginSdk } from '../types';

type TelegramWindow = {
  Telegram?: TelegramGlobal;
};

const createMockSdk = (): TelegramLoginSdk => ({
  init: jest.fn(),
  open: jest.fn(),
  auth: jest.fn(),
});

describe('loadTelegramLoginScript', () => {
  beforeEach(() => {
    __resetTelegramLoginScriptState();
    delete (window as unknown as TelegramWindow).Telegram;
    document
      .querySelectorAll(`#${TELEGRAM_LOGIN_SCRIPT_ID}`)
      .forEach(node => node.remove());
  });

  afterEach(() => {
    __resetTelegramLoginScriptState();
    delete (window as unknown as TelegramWindow).Telegram;
    document
      .querySelectorAll(`#${TELEGRAM_LOGIN_SCRIPT_ID}`)
      .forEach(node => node.remove());
  });

  it('resolves immediately when Telegram.Login is already available', async () => {
    const sdk = createMockSdk();
    (window as unknown as TelegramWindow).Telegram = { Login: sdk };

    await expect(loadTelegramLoginScript()).resolves.toBe(sdk);
    expect(document.getElementById(TELEGRAM_LOGIN_SCRIPT_ID)).toBeNull();
  });

  it('inserts a single script for concurrent callers', async () => {
    const first = loadTelegramLoginScript();
    const second = loadTelegramLoginScript();

    const scripts = document.querySelectorAll(`#${TELEGRAM_LOGIN_SCRIPT_ID}`);
    expect(scripts).toHaveLength(1);
    expect((scripts[0] as HTMLScriptElement).src).toBe(
      TELEGRAM_LOGIN_SCRIPT_SRC
    );

    const sdk = createMockSdk();
    (window as unknown as TelegramWindow).Telegram = { Login: sdk };
    (scripts[0] as HTMLScriptElement).onload?.(new Event('load'));

    await expect(Promise.all([first, second])).resolves.toEqual([sdk, sdk]);
  });

  it('rejects when the script fails to load', async () => {
    const pending = loadTelegramLoginScript();
    const script = document.getElementById(
      TELEGRAM_LOGIN_SCRIPT_ID
    ) as HTMLScriptElement;

    script.onerror?.(new Event('error'));

    await expect(pending).rejects.toThrow(
      'Failed to load Telegram Login script'
    );
  });

  it('does not insert another script after a successful load', async () => {
    const pending = loadTelegramLoginScript();
    const script = document.getElementById(
      TELEGRAM_LOGIN_SCRIPT_ID
    ) as HTMLScriptElement;
    const sdk = createMockSdk();
    (window as unknown as TelegramWindow).Telegram = { Login: sdk };
    script.onload?.(new Event('load'));
    await pending;

    await expect(loadTelegramLoginScript()).resolves.toBe(sdk);
    expect(
      document.querySelectorAll(`#${TELEGRAM_LOGIN_SCRIPT_ID}`)
    ).toHaveLength(1);
  });

  it('rejects when the script loads but Telegram.Login is missing', async () => {
    const pending = loadTelegramLoginScript();
    const script = document.getElementById(
      TELEGRAM_LOGIN_SCRIPT_ID
    ) as HTMLScriptElement;

    script.onload?.(new Event('load'));

    await expect(pending).rejects.toThrow(
      'Telegram Login SDK did not initialize'
    );
  });
});
