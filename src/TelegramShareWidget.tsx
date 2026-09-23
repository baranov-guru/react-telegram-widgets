'use client';

import React, { useCallback } from 'react';

import { TELEGRAM_WIDGET_SCRIPT_SRC } from './constants';
import TelegramWidgetWrap from './TelegramWidgetWrap';
import {
  TelegramScriptElement,
  TelegramWidgetCommonProps,
  TelegramWidgetSize,
} from './types';

/**
 * Props for the TelegramShareWidget component.
 *
 * @see https://core.telegram.org/widgets/share
 */
export type TelegramShareWidgetProps = {
  /**
   * Absolute URL to share. Corresponds to `data-telegram-share-url`.
   */
  url: string;
  /**
   * Optional comment/description included with the shared link. Corresponds to `data-comment`.
   */
  comment?: string;
  /**
   * Button size. Corresponds to `data-size`.
   */
  size?: TelegramWidgetSize;
} & TelegramWidgetCommonProps;

/**
 * A React component that embeds a Telegram Sharing Button widget.
 *
 * @param {TelegramShareWidgetProps} props - The component props.
 * @returns {React.ReactElement} The rendered component.
 */
const TelegramShareWidget: React.FC<TelegramShareWidgetProps> = ({
  url,
  comment,
  size,
  onError,
  onLoad,
  className,
}) => {
  const createScript = useCallback(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = TELEGRAM_WIDGET_SCRIPT_SRC;
    script.setAttribute('data-telegram-share-url', url);
    if (comment) {
      script.setAttribute('data-comment', comment);
    }
    if (size) {
      script.setAttribute('data-size', size);
    }
    return script as TelegramScriptElement;
  }, [url, comment, size]);

  return (
    <TelegramWidgetWrap
      className={className}
      createScript={createScript}
      onError={onError}
      onLoad={onLoad}
    />
  );
};

export default TelegramShareWidget;
