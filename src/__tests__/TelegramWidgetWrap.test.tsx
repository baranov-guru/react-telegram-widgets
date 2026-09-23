import { render, screen, act } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom';
import TelegramWidgetWrap from '../TelegramWidgetWrap';
import { TelegramScriptElement } from '../types';

const createMockScript = (): TelegramScriptElement => {
  const script = document.createElement('script') as TelegramScriptElement;
  script.async = false;
  script.src = '';
  script.onerror = null;
  script.onload = null;
  script._iframe = undefined;

  return script;
};

const createMockIframe = (): HTMLIFrameElement => {
  const iframe = document.createElement('iframe');
  iframe.onerror = null;
  iframe.onload = null;
  return iframe;
};

describe('TelegramWidgetWrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic rendering', () => {
    it('should render a div with the provided className', () => {
      const createScript = jest.fn(() => createMockScript());
      const className = 'test-class';

      render(
        <TelegramWidgetWrap createScript={createScript} className={className} />
      );

      const div = screen.getByTestId('telegram-widget-wrap');
      expect(div).toHaveClass(className);
    });

    it('should render without className when not provided', () => {
      const createScript = jest.fn(() => createMockScript());

      render(<TelegramWidgetWrap createScript={createScript} />);

      const div = screen.getByTestId('telegram-widget-wrap');
      expect(div).toBeInTheDocument();
    });
  });

  describe('Script creation and attachment', () => {
    it('should call createScript function', () => {
      const createScript = jest.fn(() => createMockScript());

      render(<TelegramWidgetWrap createScript={createScript} />);

      expect(createScript).toHaveBeenCalledTimes(1);
    });

    it('should append the script to the container', () => {
      const mockScript = createMockScript();
      const createScript = jest.fn(() => mockScript);

      render(<TelegramWidgetWrap createScript={createScript} />);

      const div = screen.getByTestId('telegram-widget-wrap');
      expect(div.contains(mockScript)).toBe(true);
    });

    it('should handle createScript throwing an error', () => {
      const error = new Error('Script creation failed');
      const createScript = jest.fn(() => {
        throw error;
      });
      const onError = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onError={onError} />
      );

      expect(createScript).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('Error handling', () => {
    it('should call onError when script.onerror is triggered', () => {
      const mockScript = createMockScript();
      const createScript = jest.fn(() => mockScript);
      const onError = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onError={onError} />
      );

      const error = new Error('Script load failed');
      mockScript.onerror?.(error as unknown as string | Event);

      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should not throw when script.onerror is triggered but onError is not provided', () => {
      const mockScript = createMockScript();
      const createScript = jest.fn(() => mockScript);

      render(<TelegramWidgetWrap createScript={createScript} />);

      const error = new Error('Script load failed');
      expect(() =>
        mockScript.onerror?.(error as unknown as string | Event)
      ).not.toThrow();
    });

    it('should call onError when iframe.onerror is triggered', () => {
      const mockScript = createMockScript();
      const mockIframe = createMockIframe();
      mockScript._iframe = mockIframe;

      const createScript = jest.fn(() => mockScript);
      const onError = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onError={onError} />
      );

      act(() => {
        mockScript.onload?.(new Event('load'));
      });

      const error = new Error('Iframe load failed');
      mockIframe.onerror?.(error as unknown as string | Event);

      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('Load handling', () => {
    it('should call onLoad when iframe.onload is triggered', () => {
      const mockScript = createMockScript();
      const mockIframe = createMockIframe();
      mockScript._iframe = mockIframe;

      const createScript = jest.fn(() => mockScript);
      const onLoad = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onLoad={onLoad} />
      );

      act(() => {
        mockScript.onload?.(new Event('load'));
      });

      act(() => {
        mockIframe.onload?.(new Event('load'));
      });

      expect(onLoad).toHaveBeenCalledTimes(1);
    });

    it('should not call onLoad when script.onload is triggered but iframe does not exist', () => {
      const mockScript = createMockScript();
      mockScript._iframe = undefined;

      const createScript = jest.fn(() => mockScript);
      const onLoad = jest.fn();

      render(
        <TelegramWidgetWrap createScript={createScript} onLoad={onLoad} />
      );

      act(() => {
        mockScript.onload?.(new Event('load'));
      });

      expect(onLoad).not.toHaveBeenCalled();
    });

    it('should not throw when iframe handlers fire without onLoad or onError', () => {
      const mockScript = createMockScript();
      const mockIframe = createMockIframe();
      mockScript._iframe = mockIframe;

      const createScript = jest.fn(() => mockScript);

      render(<TelegramWidgetWrap createScript={createScript} />);

      act(() => {
        mockScript.onload?.(new Event('load'));
      });

      expect(() => {
        mockIframe.onload?.(new Event('load'));
        mockIframe.onerror?.(new Error('fail') as unknown as string | Event);
      }).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should remove both script and sibling iframe on unmount', () => {
      const mockScript = createMockScript();
      const createScript = jest.fn(() => mockScript);

      const { unmount } = render(
        <TelegramWidgetWrap createScript={createScript} />
      );

      const div = screen.getByTestId('telegram-widget-wrap');
      const iframe = document.createElement('iframe');
      div.appendChild(iframe);

      expect(div.childNodes.length).toBe(2);

      unmount();

      expect(div.childNodes.length).toBe(0);
    });
  });

  describe('prepare', () => {
    it('should call prepare before appending the script', () => {
      const order: string[] = [];
      const mockScript = createMockScript();
      const createScript = jest.fn(() => {
        order.push('createScript');
        return mockScript;
      });
      const prepare = jest.fn(() => {
        order.push('prepare');
      });

      render(
        <TelegramWidgetWrap createScript={createScript} prepare={prepare} />
      );

      expect(prepare).toHaveBeenCalledTimes(1);
      expect(order).toEqual(['prepare', 'createScript']);
      expect(
        screen.getByTestId('telegram-widget-wrap').contains(mockScript)
      ).toBe(true);
    });

    it('should call prepare cleanup on unmount', () => {
      const prepareCleanup = jest.fn();
      const prepare = jest.fn(() => prepareCleanup);
      const createScript = jest.fn(() => createMockScript());

      const { unmount } = render(
        <TelegramWidgetWrap createScript={createScript} prepare={prepare} />
      );

      expect(prepareCleanup).not.toHaveBeenCalled();
      unmount();
      expect(prepareCleanup).toHaveBeenCalledTimes(1);
    });

    it('should call prepare cleanup before re-insert when createScript changes', () => {
      const prepareCleanup = jest.fn();
      const prepare = jest.fn(() => prepareCleanup);
      const createScript1 = jest.fn(() => createMockScript());
      const createScript2 = jest.fn(() => createMockScript());

      const { rerender } = render(
        <TelegramWidgetWrap createScript={createScript1} prepare={prepare} />
      );

      expect(prepare).toHaveBeenCalledTimes(1);
      expect(prepareCleanup).not.toHaveBeenCalled();

      rerender(
        <TelegramWidgetWrap createScript={createScript2} prepare={prepare} />
      );

      expect(prepareCleanup).toHaveBeenCalledTimes(1);
      expect(prepare).toHaveBeenCalledTimes(2);
      expect(createScript2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dependencies and re-renders', () => {
    it('should recreate script when createScript function changes', () => {
      const createScript1 = jest.fn(() => createMockScript());
      const createScript2 = jest.fn(() => createMockScript());

      const { rerender } = render(
        <TelegramWidgetWrap createScript={createScript1} />
      );

      expect(createScript1).toHaveBeenCalledTimes(1);

      rerender(<TelegramWidgetWrap createScript={createScript2} />);

      expect(createScript2).toHaveBeenCalledTimes(1);
    });

    it('should not recreate script when className changes', () => {
      const createScript = jest.fn(() => createMockScript());

      const { rerender } = render(
        <TelegramWidgetWrap createScript={createScript} />
      );

      expect(createScript).toHaveBeenCalledTimes(1);

      rerender(
        <TelegramWidgetWrap createScript={createScript} className='new-class' />
      );

      expect(createScript).toHaveBeenCalledTimes(1);
    });

    it('should not recreate script when onLoad or onError change', () => {
      const mockScript = createMockScript();
      const mockIframe = createMockIframe();
      mockScript._iframe = mockIframe;

      const createScript = jest.fn(() => mockScript);
      const onLoad1 = jest.fn();
      const onLoad2 = jest.fn();
      const onError1 = jest.fn();
      const onError2 = jest.fn();

      const { rerender } = render(
        <TelegramWidgetWrap
          createScript={createScript}
          onLoad={onLoad1}
          onError={onError1}
        />
      );

      expect(createScript).toHaveBeenCalledTimes(1);

      act(() => {
        mockScript.onload?.(new Event('load'));
      });

      rerender(
        <TelegramWidgetWrap
          createScript={createScript}
          onLoad={onLoad2}
          onError={onError2}
        />
      );

      expect(createScript).toHaveBeenCalledTimes(1);

      act(() => {
        mockIframe.onload?.(new Event('load'));
      });
      expect(onLoad1).not.toHaveBeenCalled();
      expect(onLoad2).toHaveBeenCalledTimes(1);

      const error = new Error('iframe error');
      mockIframe.onerror?.(error as unknown as string | Event);
      expect(onError1).not.toHaveBeenCalled();
      expect(onError2).toHaveBeenCalledWith(error);
    });
  });
});
