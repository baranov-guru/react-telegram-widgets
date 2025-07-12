"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { TelegramScriptElement, TelegramWidgetCommonProps } from "./types";

/**
 * Props for the TelegramWidgetWrap component.
 */
type TelegramWidgetWrapProps = {
  /**
   * Function that creates and returns a Telegram script element.
   */
  createScript: () => TelegramScriptElement;
} & TelegramWidgetCommonProps;

const TelegramWidgetWrap: React.FC<TelegramWidgetWrapProps> = ({
  className,
  createScript,
  onLoad,
  onError,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const onLoadCallback = useCallback(
    (script: TelegramScriptElement) => {
      const { _iframe } = script;
      if (_iframe) {
        if (onError) _iframe.onerror = onError;
        if (onLoad) _iframe.onload = onLoad;
      }
    },
    [onError, onLoad]
  );

  useEffect(() => {
    const container = ref.current;
    try {
      const script = createScript();
      if (onError) script.onerror = onError;
      if (onLoad) script.onload = () => onLoadCallback(script);
      if (container) container.appendChild(script);
    } catch (e) {
      onError && onError(e);
    }
    return () => {
      if (container) {
        container.childNodes.forEach((cn) => {
          container.removeChild(cn);
        });
      }
    };
  }, [createScript, onError, onLoad, onLoadCallback]);

  return (
    <div className={className} ref={ref} data-testid="telegram-widget-wrap" />
  );
};

export default TelegramWidgetWrap;
