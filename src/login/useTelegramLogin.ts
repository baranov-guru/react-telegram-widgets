'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { loadTelegramLoginScript } from './loadTelegramLoginScript';
import {
  TelegramLoginInitOptions,
  TelegramLoginResult,
  TelegramLoginScope,
  TelegramLoginSuccess,
} from './types';

export type { TelegramLoginSuccess } from './types';

export type UseTelegramLoginOptions = {
  /**
   * Bot Client ID from @BotFather Login Widget settings.
   */
  clientId: number;
  /**
   * Optional scopes requested during login (`profile`, `phone`, `write`).
   */
  scope?: TelegramLoginScope[];
  /**
   * Optional UI language code (e.g. `en`, `ru`).
   */
  lang?: string;
  /**
   * Optional server-generated nonce included in the resulting `id_token`.
   */
  nonce?: string;
  /**
   * Called after a successful login with `id_token` and decoded `user`.
   */
  onAuth?: (result: TelegramLoginSuccess) => void;
  /**
   * Called when the SDK reports an error or script loading fails.
   */
  onError?: (error: string) => void;
  /**
   * When true (default), loads the script and calls `Telegram.Login.init` on mount.
   */
  autoInit?: boolean;
};

export type UseTelegramLoginReturn = {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
};

/**
 * Headless hook for the Telegram Login OpenID Connect JS library.
 *
 * @see https://core.telegram.org/widgets/login
 */
export const useTelegramLogin = ({
  clientId,
  scope,
  lang,
  nonce,
  onAuth,
  onError,
  autoInit = true,
}: UseTelegramLoginOptions): UseTelegramLoginReturn => {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAuthRef = useRef(onAuth);
  const onErrorRef = useRef(onError);
  const initializedRef = useRef(false);

  onAuthRef.current = onAuth;
  onErrorRef.current = onError;

  const scopeKey = scope?.join(',') ?? '';

  const buildOptions = useCallback((): TelegramLoginInitOptions => {
    const options: TelegramLoginInitOptions = {
      client_id: clientId,
    };
    if (scopeKey) {
      options.scope = scopeKey.split(',') as TelegramLoginScope[];
    }
    if (lang) {
      options.lang = lang;
    }
    if (nonce) {
      options.nonce = nonce;
    }
    return options;
  }, [clientId, scopeKey, lang, nonce]);

  const handleResult = useCallback((result: TelegramLoginResult) => {
    setIsLoading(false);
    if ('id_token' in result && result.id_token && result.user) {
      setError(null);
      onAuthRef.current?.({
        id_token: result.id_token,
        user: result.user,
      });
      return;
    }

    const message = result.error ?? 'Telegram Login failed';
    setError(message);
    onErrorRef.current?.(message);
  }, []);

  useEffect(() => {
    if (!autoInit) {
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        const sdk = await loadTelegramLoginScript();
        if (cancelled) {
          return;
        }
        sdk.init(buildOptions(), handleResult);
        initializedRef.current = true;
        setIsReady(true);
        setError(null);
      } catch (e) {
        if (cancelled) {
          return;
        }
        const message =
          e instanceof Error
            ? e.message
            : 'Failed to initialize Telegram Login';
        setError(message);
        setIsReady(false);
        onErrorRef.current?.(message);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [autoInit, clientId, lang, nonce, scopeKey, buildOptions, handleResult]);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sdk = await loadTelegramLoginScript();
      if (!initializedRef.current) {
        sdk.auth(buildOptions(), handleResult);
        initializedRef.current = true;
        setIsReady(true);
        return;
      }
      sdk.open();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to start Telegram Login';
      setIsLoading(false);
      setError(message);
      onErrorRef.current?.(message);
    }
  }, [buildOptions, handleResult]);

  return {
    isReady,
    isLoading,
    error,
    login,
  };
};
