'use client';

import React, { cloneElement, isValidElement, ReactElement } from 'react';

import { useTelegramLogin, UseTelegramLoginOptions } from './useTelegramLogin';
import { TelegramLoginScope, TelegramLoginSuccess } from './types';

/**
 * Props for the TelegramLoginWidget component (OpenID Connect login).
 *
 * @see https://core.telegram.org/widgets/login
 */
export type TelegramLoginWidgetProps = {
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
   * When true (default), loads the script and initializes the SDK on mount.
   */
  autoInit?: boolean;
  /**
   * Disables the button in addition to the hook's loading/ready state.
   */
  disabled?: boolean;
  /**
   * Optional CSS class for the default button element.
   */
  className?: string;
  /**
   * Custom button content. A single React element is cloned with `onClick` /
   * `disabled`. Otherwise content is rendered inside a `<button>`.
   */
  children?: React.ReactNode;
};

type ClickableChildProps = {
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
};

/**
 * React button wrapper around the Telegram Login OpenID Connect JS library.
 *
 * Verify the returned `id_token` on your server. This package does not ship
 * server-side verification helpers.
 *
 * @see https://core.telegram.org/widgets/login
 */
const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({
  clientId,
  scope,
  lang,
  nonce,
  onAuth,
  onError,
  autoInit = true,
  disabled = false,
  className,
  children,
}) => {
  const options: UseTelegramLoginOptions = {
    clientId,
    scope,
    lang,
    nonce,
    onAuth,
    onError,
    autoInit,
  };
  const { isReady, isLoading, login } = useTelegramLogin(options);
  const isDisabled = disabled || !isReady || isLoading;

  const handleClick = () => {
    void login();
  };

  if (isValidElement(children) && React.Children.count(children) === 1) {
    const child = children as ReactElement<ClickableChildProps>;
    return cloneElement(child, {
      disabled: isDisabled || Boolean(child.props.disabled),
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event);
        if (!isDisabled && !child.props.disabled) {
          handleClick();
        }
      },
    });
  }

  return (
    <button
      type='button'
      className={className}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {children ?? 'Log in with Telegram'}
    </button>
  );
};

export default TelegramLoginWidget;
