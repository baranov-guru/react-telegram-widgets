import { render } from '@testing-library/react';
import React from 'react';

import { TELEGRAM_WIDGET_SCRIPT_SRC } from '../constants';
import TelegramShareWidget, {
  TelegramShareWidgetProps,
} from '../TelegramShareWidget';
import TelegramWidgetWrap from '../TelegramWidgetWrap';

jest.mock('../TelegramWidgetWrap', () => jest.fn(() => null));

const getLastWrapProps = () =>
  (TelegramWidgetWrap as jest.Mock).mock.calls.at(-1)?.[0] as {
    createScript: () => HTMLScriptElement;
    onLoad?: () => void;
    onError?: (e: unknown) => void;
    className?: string;
  };

describe('TelegramShareWidget', () => {
  const defaultProps: TelegramShareWidgetProps = {
    url: 'https://example.com/article',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TelegramShareWidget {...defaultProps} />);
    expect(TelegramWidgetWrap).toHaveBeenCalled();
  });

  it('passes className, onLoad and onError to TelegramWidgetWrap', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();
    render(
      <TelegramShareWidget
        {...defaultProps}
        className='share-class'
        onLoad={onLoad}
        onError={onError}
      />
    );
    expect(TelegramWidgetWrap).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'share-class',
        onLoad,
        onError,
      }),
      {}
    );
  });

  it('createScript sets required attributes by default', () => {
    render(<TelegramShareWidget url='https://example.com/article' />);
    const script = getLastWrapProps().createScript();

    expect(script.src).toBe(TELEGRAM_WIDGET_SCRIPT_SRC);
    expect(script.getAttribute('data-telegram-share-url')).toBe(
      'https://example.com/article'
    );
    expect(script.getAttribute('data-comment')).toBeNull();
    expect(script.getAttribute('data-size')).toBeNull();
    expect(script.getAttribute('data-onauth')).toBeNull();
    expect(script.getAttribute('data-telegram-login')).toBeNull();
    expect(script.getAttribute('data-auth-url')).toBeNull();
    expect(script.getAttribute('data-request-access')).toBeNull();
  });

  it('createScript sets comment and size when provided', () => {
    render(
      <TelegramShareWidget
        url='https://example.com/post'
        comment='Check this out'
        size='small'
      />
    );
    const script = getLastWrapProps().createScript();

    expect(script.getAttribute('data-telegram-share-url')).toBe(
      'https://example.com/post'
    );
    expect(script.getAttribute('data-comment')).toBe('Check this out');
    expect(script.getAttribute('data-size')).toBe('small');
  });
});
