'use client';

import React, { useCallback, useId, useRef } from 'react';

import { TELEGRAM_WIDGET_SCRIPT_SRC } from './constants';
import TelegramWidgetWrap from './TelegramWidgetWrap';
import {
  TelegramLegacyLoginData,
  TelegramScriptElement,
  TelegramWidgetCommonProps,
  TelegramWidgetSize,
} from './types';

/**
 * Props for the TelegramLegacyLoginWidget component.
 *
 * @see https://core.telegram.org/widgets/login-legacy
 */
export type TelegramLegacyLoginWidgetProps = {
  /**
   * Bot username used for authorization (without @). Corresponds to `data-telegram-login`.
   */
  botName: string;
  /**
   * Button size. Corresponds to `data-size`. Defaults to Telegram's large size when omitted.
   */
  size?: TelegramWidgetSize;
  /**
   * Whether to show the user avatar next to the button.
   * When `false`, sets `data-userpic="false"`. Defaults to showing the avatar.
   */
  userpic?: boolean;
  /**
   * Corner radius of the button in pixels. Corresponds to `data-radius`.
   */
  radius?: number;
  /**
   * When true, requests write access for the bot (`data-request-access="write"`).
   */
  requestAccess?: boolean;
  /**
   * URL to redirect to after authorization. Corresponds to `data-auth-url`.
   */
  authUrl?: string;
  /**
   * Callback invoked with user data after successful authorization.
   */
  onAuth?: (data: TelegramLegacyLoginData) => void;
} & TelegramWidgetCommonProps;

type AuthCallbacks = Record<
  string,
  ((user: TelegramLegacyLoginData) => void) | undefined
>;

/**
 * A React component that embeds the legacy Telegram Login Widget (iframe).
 *
 * Prefer `TelegramLoginWidget` for the current OpenID Connect login flow.
 *
 * @param {TelegramLegacyLoginWidgetProps} props - The component props.
 * @returns {React.ReactElement} The rendered component.
 */
const TelegramLegacyLoginWidget: React.FC<TelegramLegacyLoginWidgetProps> = ({
  botName,
  size,
  userpic = true,
  radius,
  requestAccess,
  authUrl,
  onAuth,
  onError,
  onLoad,
  className,
}) => {
  const reactId = useId();
  const callbackName = `onTelegramAuth_${reactId.replace(/:/g, '')}`;
  const hasOnAuth = Boolean(onAuth);
  const onAuthRef = useRef(onAuth);
  onAuthRef.current = onAuth;

  const createScript = useCallback(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = TELEGRAM_WIDGET_SCRIPT_SRC;
    script.setAttribute('data-telegram-login', botName);
    if (size) {
      script.setAttribute('data-size', size);
    }
    if (userpic === false) {
      script.setAttribute('data-userpic', 'false');
    }
    if (radius !== undefined) {
      script.setAttribute('data-radius', radius.toString());
    }
    if (requestAccess) {
      script.setAttribute('data-request-access', 'write');
    }
    if (authUrl) {
      script.setAttribute('data-auth-url', authUrl);
    }
    if (hasOnAuth) {
      script.setAttribute('data-onauth', `${callbackName}(user)`);
    }
    return script as TelegramScriptElement;
  }, [
    botName,
    size,
    userpic,
    radius,
    requestAccess,
    authUrl,
    hasOnAuth,
    callbackName,
  ]);

  const prepare = useCallback(() => {
    if (!hasOnAuth) {
      return;
    }

    const authWindow = window as unknown as AuthCallbacks;
    authWindow[callbackName] = (user: TelegramLegacyLoginData) => {
      onAuthRef.current?.(user);
    };

    return () => {
      delete authWindow[callbackName];
    };
  }, [hasOnAuth, callbackName]);

  return (
    <TelegramWidgetWrap
      className={className}
      createScript={createScript}
      prepare={prepare}
      onError={onError}
      onLoad={onLoad}
    />
  );
};

export default TelegramLegacyLoginWidget;
