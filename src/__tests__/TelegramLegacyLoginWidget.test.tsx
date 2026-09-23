import { render } from '@testing-library/react';
import React from 'react';

import { TELEGRAM_WIDGET_SCRIPT_SRC } from '../shared/constants';
import TelegramLegacyLoginWidget, {
  TelegramLegacyLoginWidgetProps,
} from '../widgets/TelegramLegacyLoginWidget';
import TelegramWidgetWrap from '../shared/TelegramWidgetWrap';
import { TelegramLegacyLoginData } from '../shared/types';

jest.mock('../shared/TelegramWidgetWrap', () => jest.fn(() => null));

const getLastWrapProps = () =>
  (TelegramWidgetWrap as jest.Mock).mock.calls.at(-1)?.[0] as {
    createScript: () => HTMLScriptElement;
    prepare?: () => void | (() => void);
    onLoad?: () => void;
    onError?: (e: unknown) => void;
    className?: string;
  };

describe('TelegramLegacyLoginWidget', () => {
  const defaultProps: TelegramLegacyLoginWidgetProps = {
    botName: 'SampleBot',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TelegramLegacyLoginWidget {...defaultProps} />);
    expect(TelegramWidgetWrap).toHaveBeenCalled();
  });

  it('passes className, onLoad and onError to TelegramWidgetWrap', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();
    render(
      <TelegramLegacyLoginWidget
        {...defaultProps}
        className='login-class'
        onLoad={onLoad}
        onError={onError}
      />
    );
    expect(TelegramWidgetWrap).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'login-class',
        onLoad,
        onError,
      }),
      {}
    );
  });

  it('createScript sets required attributes by default', () => {
    render(<TelegramLegacyLoginWidget botName='SampleBot' />);
    const script = getLastWrapProps().createScript();

    expect(script.src).toBe(TELEGRAM_WIDGET_SCRIPT_SRC);
    expect(script.getAttribute('data-telegram-login')).toBe('SampleBot');
    expect(script.getAttribute('data-size')).toBeNull();
    expect(script.getAttribute('data-style')).toBeNull();
    expect(script.getAttribute('data-userpic')).toBeNull();
    expect(script.getAttribute('data-radius')).toBeNull();
    expect(script.getAttribute('data-request-access')).toBeNull();
    expect(script.getAttribute('data-auth-url')).toBeNull();
    expect(script.getAttribute('data-onauth')).toBeNull();
  });

  it('createScript sets optional attributes when provided', () => {
    render(
      <TelegramLegacyLoginWidget
        botName='SampleBot'
        size='medium'
        userpic={false}
        radius={8}
        requestAccess={true}
        authUrl='https://example.com/auth'
      />
    );
    const script = getLastWrapProps().createScript();

    expect(script.getAttribute('data-telegram-login')).toBe('SampleBot');
    expect(script.getAttribute('data-size')).toBe('medium');
    expect(script.getAttribute('data-userpic')).toBe('false');
    expect(script.getAttribute('data-radius')).toBe('8');
    expect(script.getAttribute('data-request-access')).toBe('write');
    expect(script.getAttribute('data-auth-url')).toBe(
      'https://example.com/auth'
    );
  });

  it('does not set data-userpic when userpic is true', () => {
    render(<TelegramLegacyLoginWidget botName='SampleBot' userpic={true} />);
    const script = getLastWrapProps().createScript();
    expect(script.getAttribute('data-userpic')).toBeNull();
  });

  it('sets data-onauth and registers a unique window callback when onAuth is provided', () => {
    const onAuth = jest.fn();
    render(<TelegramLegacyLoginWidget botName='SampleBot' onAuth={onAuth} />);

    const { createScript, prepare } = getLastWrapProps();
    const script = createScript();
    const onAuthAttr = script.getAttribute('data-onauth');

    expect(onAuthAttr).toMatch(/^onTelegramAuth_\w+\(user\)$/);

    const callbackName = onAuthAttr!.replace('(user)', '');
    const cleanup = prepare?.();

    expect(
      typeof (window as unknown as Record<string, unknown>)[callbackName]
    ).toBe('function');

    const user: TelegramLegacyLoginData = {
      id: 1,
      auth_date: 123,
      hash: 'abc',
      first_name: 'Ada',
    };
    (
      window as unknown as Record<
        string,
        (data: TelegramLegacyLoginData) => void
      >
    )[callbackName](user);

    expect(onAuth).toHaveBeenCalledWith(user);

    if (typeof cleanup === 'function') {
      cleanup();
    }
    expect(
      (window as unknown as Record<string, unknown>)[callbackName]
    ).toBeUndefined();
  });

  it('does not register a window callback when onAuth is omitted', () => {
    render(<TelegramLegacyLoginWidget botName='SampleBot' />);
    const { createScript, prepare } = getLastWrapProps();

    expect(createScript().getAttribute('data-onauth')).toBeNull();
    prepare?.();

    const authKeys = Object.keys(window).filter(key =>
      key.startsWith('onTelegramAuth_')
    );
    expect(authKeys).toHaveLength(0);
  });

  it('gives two widgets distinct callback names', () => {
    const onAuth1 = jest.fn();
    const onAuth2 = jest.fn();

    render(
      <>
        <TelegramLegacyLoginWidget botName='BotOne' onAuth={onAuth1} />
        <TelegramLegacyLoginWidget botName='BotTwo' onAuth={onAuth2} />
      </>
    );

    const calls = (TelegramWidgetWrap as jest.Mock).mock.calls;
    expect(calls).toHaveLength(2);

    const script1 = calls[0][0].createScript() as HTMLScriptElement;
    const script2 = calls[1][0].createScript() as HTMLScriptElement;
    const name1 = script1.getAttribute('data-onauth');
    const name2 = script2.getAttribute('data-onauth');

    expect(name1).toBeTruthy();
    expect(name2).toBeTruthy();
    expect(name1).not.toBe(name2);

    const cleanup1 = calls[0][0].prepare?.();
    const cleanup2 = calls[1][0].prepare?.();
    const callback1 = name1!.replace('(user)', '');
    const callback2 = name2!.replace('(user)', '');

    const user1: TelegramLegacyLoginData = { id: 1, auth_date: 1, hash: 'a' };
    const user2: TelegramLegacyLoginData = { id: 2, auth_date: 2, hash: 'b' };

    (
      window as unknown as Record<
        string,
        (data: TelegramLegacyLoginData) => void
      >
    )[callback1](user1);
    (
      window as unknown as Record<
        string,
        (data: TelegramLegacyLoginData) => void
      >
    )[callback2](user2);

    expect(onAuth1).toHaveBeenCalledWith(user1);
    expect(onAuth2).toHaveBeenCalledWith(user2);

    if (typeof cleanup1 === 'function') cleanup1();
    if (typeof cleanup2 === 'function') cleanup2();
  });

  it('invokes the latest onAuth after the prop changes without recreating the script factory unnecessarily', () => {
    const onAuth1 = jest.fn();
    const onAuth2 = jest.fn();

    const { rerender } = render(
      <TelegramLegacyLoginWidget botName='SampleBot' onAuth={onAuth1} />
    );

    const firstCreateScript = getLastWrapProps().createScript;
    const firstPrepare = getLastWrapProps().prepare;
    const cleanup = firstPrepare?.();
    const callbackName = firstCreateScript()
      .getAttribute('data-onauth')!
      .replace('(user)', '');

    rerender(
      <TelegramLegacyLoginWidget botName='SampleBot' onAuth={onAuth2} />
    );

    expect(getLastWrapProps().createScript).toBe(firstCreateScript);
    expect(getLastWrapProps().prepare).toBe(firstPrepare);

    const user: TelegramLegacyLoginData = { id: 42, auth_date: 1, hash: 'h' };
    (
      window as unknown as Record<
        string,
        (data: TelegramLegacyLoginData) => void
      >
    )[callbackName](user);

    expect(onAuth1).not.toHaveBeenCalled();
    expect(onAuth2).toHaveBeenCalledWith(user);

    if (typeof cleanup === 'function') cleanup();
  });

  it('removes the window callback on prepare cleanup', () => {
    const onAuth = jest.fn();
    const { unmount } = render(
      <TelegramLegacyLoginWidget botName='SampleBot' onAuth={onAuth} />
    );

    const { createScript, prepare } = getLastWrapProps();
    const callbackName = createScript()
      .getAttribute('data-onauth')!
      .replace('(user)', '');
    const cleanup = prepare?.();

    expect(
      typeof (window as unknown as Record<string, unknown>)[callbackName]
    ).toBe('function');

    if (typeof cleanup === 'function') {
      cleanup();
    }
    unmount();

    expect(
      (window as unknown as Record<string, unknown>)[callbackName]
    ).toBeUndefined();
  });
});
