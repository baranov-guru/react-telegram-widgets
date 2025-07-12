'use client';

import React, { CSSProperties, useCallback } from 'react';

import { TELEGRAM_WIDGET_SCRIPT_SRC } from './constants';
import TelegramWidgetWrap from './TelegramWidgetWrap';
import { TelegramScriptElement, TelegramWidgetCommonProps } from './types';

/**
 * Props for the TelegramPostWidget component.
 *
 * @see https://core.telegram.org/widgets/posts
 *
 */
export type TelegramPostWidgetProps = {
  /**
   * The post identifier in the format "<channel>/<post_id>" (e.g., "durov/1").
   */
  post: string;
  /**
   * Whether to show user pictures. If "auto", shows user pictures only if the post contains them.
   */
  userpic?: boolean | 'auto';
  /**
   * The width of the widget. Corresponds to `data-width`.
   */
  width?: CSSProperties['width'] | '100%';
  /**
   * Whether to use the dark theme. If true, sets `data-dark="1"`.
   */
  dark?: boolean;
} & TelegramWidgetCommonProps;

/**
 * A React component that embeds a Telegram post widget.
 *
 * @param {TelegramPostWidgetProps} props - The component props.
 * @returns {React.ReactElement} The rendered component.
 */
const TelegramPostWidget: React.FC<TelegramPostWidgetProps> = ({
  post,
  userpic = 'auto',
  width = '100%',
  dark,
  onError,
  onLoad,
  className,
}) => {
  const createScript = useCallback(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = TELEGRAM_WIDGET_SCRIPT_SRC;
    script.setAttribute('data-telegram-post', post);
    if (userpic !== 'auto') {
      script.setAttribute('data-userpic', userpic.toString());
    }
    if (width) script.setAttribute('data-width', width.toString());
    if (dark) script.setAttribute('data-dark', '1');

    return script as TelegramScriptElement;
  }, [post, userpic, width, dark]);

  return (
    <TelegramWidgetWrap
      className={className}
      createScript={createScript}
      onError={onError}
      onLoad={onLoad}
    />
  );
};

export default TelegramPostWidget;
