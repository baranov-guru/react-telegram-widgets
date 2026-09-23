'use client';

import React, { useEffect, useRef } from 'react';

import { TelegramScriptElement, TelegramWidgetCommonProps } from './types';

/**
 * Props for the TelegramWidgetWrap component.
 */
type TelegramWidgetWrapProps = {
  /**
   * Function that creates and returns a Telegram script element.
   */
  createScript: () => TelegramScriptElement;
  /**
   * Optional hook invoked before the script is appended.
   * Return a cleanup function to run on unmount or before re-insert.
   */
  prepare?: () => void | (() => void);
} & TelegramWidgetCommonProps;

const TelegramWidgetWrap: React.FC<TelegramWidgetWrapProps> = ({
  className,
  createScript,
  prepare,
  onLoad,
  onError,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);

  onLoadRef.current = onLoad;
  onErrorRef.current = onError;

  useEffect(() => {
    const container = ref.current;
    let prepareCleanup: void | (() => void);

    try {
      prepareCleanup = prepare?.();
      const script = createScript();
      script.onerror = event => {
        onErrorRef.current?.(event);
      };
      script.onload = () => {
        const { _iframe } = script;
        if (_iframe) {
          _iframe.onerror = event => {
            onErrorRef.current?.(event);
          };
          _iframe.onload = () => {
            onLoadRef.current?.();
          };
        }
      };
      if (container) container.appendChild(script);
    } catch (e) {
      onErrorRef.current?.(e);
    }

    return () => {
      if (typeof prepareCleanup === 'function') {
        prepareCleanup();
      }
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [createScript, prepare]);

  return (
    <div className={className} ref={ref} data-testid='telegram-widget-wrap' />
  );
};

export default TelegramWidgetWrap;
