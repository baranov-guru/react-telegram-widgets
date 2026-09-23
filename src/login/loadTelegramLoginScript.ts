import {
  TELEGRAM_LOGIN_SCRIPT_ID,
  TELEGRAM_LOGIN_SCRIPT_SRC,
} from '../shared/constants';
import { TelegramGlobal, TelegramLoginSdk } from './types';

type TelegramWindow = {
  Telegram?: TelegramGlobal;
};

let loadPromise: Promise<TelegramLoginSdk> | null = null;

const getLoginSdk = (): TelegramLoginSdk | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return (window as unknown as TelegramWindow).Telegram?.Login;
};

/**
 * Idempotently loads the official Telegram Login JS library and resolves with
 * `window.Telegram.Login`. Concurrent callers share the same in-flight Promise.
 *
 * @see https://core.telegram.org/widgets/login
 */
export const loadTelegramLoginScript = (
  scriptSrc: string = TELEGRAM_LOGIN_SCRIPT_SRC
): Promise<TelegramLoginSdk> => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(
      new Error('Telegram Login is only available in a browser environment')
    );
  }

  const existing = getLoginSdk();
  if (existing) {
    return Promise.resolve(existing);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise<TelegramLoginSdk>((resolve, reject) => {
    const finish = () => {
      const sdk = getLoginSdk();
      if (sdk) {
        resolve(sdk);
        return;
      }
      loadPromise = null;
      reject(new Error('Telegram Login SDK did not initialize'));
    };

    const fail = () => {
      loadPromise = null;
      reject(new Error('Failed to load Telegram Login script'));
    };

    const existingScript = document.getElementById(
      TELEGRAM_LOGIN_SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', finish);
      existingScript.addEventListener('error', fail);
      if (getLoginSdk()) {
        finish();
      }
      return;
    }

    const script = document.createElement('script');
    script.id = TELEGRAM_LOGIN_SCRIPT_ID;
    script.async = true;
    script.src = scriptSrc;
    script.onload = finish;
    script.onerror = fail;
    document.head.appendChild(script);
  });

  return loadPromise;
};

/**
 * Test helper: clears the shared load promise so scripts can be re-tested.
 * @internal
 */
export const __resetTelegramLoginScriptState = (): void => {
  loadPromise = null;
};
