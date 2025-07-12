import { render } from '@testing-library/react';
import React from 'react';

import TelegramCommentsWidget, {
  TelegramCommentsWidgetProps,
} from '../TelegramCommentsWidget';
import TelegramWidgetWrap from '../TelegramWidgetWrap';

jest.mock('../TelegramWidgetWrap', () => jest.fn(() => null));

describe('TelegramCommentsWidget', () => {
  const defaultProps: TelegramCommentsWidgetProps = {
    discussion: 'durov/1',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TelegramCommentsWidget {...defaultProps} />);
    expect(TelegramWidgetWrap).toHaveBeenCalled();
  });

  it('passes onLoad and onError to TelegramWidgetWrap', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();
    render(
      <TelegramCommentsWidget
        {...defaultProps}
        onLoad={onLoad}
        onError={onError}
      />
    );
    expect(TelegramWidgetWrap).toHaveBeenCalledWith(
      expect.objectContaining({ onLoad, onError }),
      {}
    );
  });

  it('createScript sets correct attributes for required props', () => {
    let script: HTMLScriptElement | undefined;
    (TelegramWidgetWrap as jest.Mock).mockImplementation(({ createScript }) => {
      script = createScript();
      return null;
    });
    render(<TelegramCommentsWidget discussion='durov/123' />);
    expect(script).toBeDefined();
    expect(script!.getAttribute('data-telegram-discussion')).toBe('durov/123');
    expect(script!.getAttribute('data-comments-limit')).toBe('5');
    expect(script!.getAttribute('data-height')).toBeNull();
    expect(script!.getAttribute('data-color')).toBeNull();
    expect(script!.getAttribute('data-colorful')).toBeNull();
    expect(script!.getAttribute('data-dark')).toBeNull();
  });

  it('createScript sets all attributes when all props are provided', () => {
    let script: HTMLScriptElement | undefined;
    (TelegramWidgetWrap as jest.Mock).mockImplementation(({ createScript }) => {
      script = createScript();
      return null;
    });
    render(
      <TelegramCommentsWidget
        discussion='durov/2'
        commentsLimit={10}
        height={400}
        color='#ff0000'
        colorful={true}
        dark={true}
      />
    );
    expect(script).toBeDefined();
    expect(script!.getAttribute('data-telegram-discussion')).toBe('durov/2');
    expect(script!.getAttribute('data-comments-limit')).toBe('10');
    expect(script!.getAttribute('data-height')).toBe('400');
    expect(script!.getAttribute('data-color')).toBe('#ff0000');
    expect(script!.getAttribute('data-colorful')).toBe('1');
    expect(script!.getAttribute('data-dark')).toBe('1');
  });

  it('createScript uses default commentsLimit when not provided', () => {
    let script: HTMLScriptElement | undefined;
    (TelegramWidgetWrap as jest.Mock).mockImplementation(({ createScript }) => {
      script = createScript();
      return null;
    });
    render(<TelegramCommentsWidget discussion='durov/3' />);
    expect(script!.getAttribute('data-comments-limit')).toBe('5');
  });

  it('createScript only sets optional attributes when they are provided', () => {
    let script: HTMLScriptElement | undefined;
    (TelegramWidgetWrap as jest.Mock).mockImplementation(({ createScript }) => {
      script = createScript();
      return null;
    });
    render(
      <TelegramCommentsWidget
        discussion='durov/4'
        commentsLimit={15}
        height={300}
      />
    );
    expect(script).toBeDefined();
    expect(script!.getAttribute('data-telegram-discussion')).toBe('durov/4');
    expect(script!.getAttribute('data-comments-limit')).toBe('15');
    expect(script!.getAttribute('data-height')).toBe('300');
    expect(script!.getAttribute('data-color')).toBeNull();
    expect(script!.getAttribute('data-colorful')).toBeNull();
    expect(script!.getAttribute('data-dark')).toBeNull();
  });
});
