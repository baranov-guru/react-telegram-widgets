import { render } from '@testing-library/react';
import React from 'react';

import TelegramPostWidget, {
  TelegramPostWidgetProps,
} from '../TelegramPostWidget';
import TelegramWidgetWrap from '../TelegramWidgetWrap';

jest.mock('../TelegramWidgetWrap', () => jest.fn(() => null));

describe('TelegramPostWidget', () => {
  const defaultProps: TelegramPostWidgetProps = {
    post: 'durov/1',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TelegramPostWidget {...defaultProps} />);
    expect(TelegramWidgetWrap).toHaveBeenCalled();
  });

  it('passes onLoad and onError to TelegramWidgetWrap', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();
    render(
      <TelegramPostWidget {...defaultProps} onLoad={onLoad} onError={onError} />
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
    render(<TelegramPostWidget post='durov/123' />);
    expect(script).toBeDefined();
    expect(script!.getAttribute('data-telegram-post')).toBe('durov/123');
    expect(script!.getAttribute('data-userpic')).toBeNull();
    expect(script!.getAttribute('data-width')).toBe('100%');
    expect(script!.getAttribute('data-dark')).toBeNull();
  });

  it('createScript sets all attributes when all props are provided', () => {
    let script: HTMLScriptElement | undefined;
    (TelegramWidgetWrap as jest.Mock).mockImplementation(({ createScript }) => {
      script = createScript();
      return null;
    });
    render(
      <TelegramPostWidget
        post='durov/2'
        userpic={true}
        width={400}
        dark={true}
      />
    );
    expect(script).toBeDefined();
    expect(script!.getAttribute('data-telegram-post')).toBe('durov/2');
    expect(script!.getAttribute('data-userpic')).toBe('true');
    expect(script!.getAttribute('data-width')).toBe('400');
    expect(script!.getAttribute('data-dark')).toBe('1');
  });
});
