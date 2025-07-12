'use client';

import React, { useCallback } from 'react';

import { TELEGRAM_WIDGET_SCRIPT_SRC } from './constants';
import TelegramWidgetWrap from './TelegramWidgetWrap';
import { TelegramScriptElement, TelegramWidgetCommonProps } from './types';

/**
 * Props for the TelegramDiscussionWidget component.
 *
 * @see https://core.telegram.org/widgets/discussion
 *
 */
export type TelegramDiscussionWidgetProps = {
  /**
   * The discussion identifier in the format "<channel>/<post_id>" (e.g., "durov/1").
   */
  discussion: string;
  /**
   * The number of comments to display (default: 5). Corresponds to `data-comments-limit`.
   */
  commentsLimit?: number;
  /**
   * The height of the widget in pixels. Corresponds to `data-height`.
   */
  height?: number;
  /**
   * The color of the widget's elements (hex format, e.g., "#cbcbcb"). Corresponds to `data-color`.
   */
  color?: string;
  /**
   * Whether to use colorful usernames. If true, sets `data-colorful="1"`.
   */
  colorful?: boolean;
  /**
   * Whether to use the dark theme. If true, sets `data-dark="1"`.
   */
  dark?: boolean;
} & TelegramWidgetCommonProps;

/**
 * A React component that embeds a Telegram discussion widget.
 *
 * @param {TelegramDiscussionWidgetProps} props - The component props.
 * @returns {React.ReactElement} The rendered component.
 */
const TelegramDiscussionWidget: React.FC<TelegramDiscussionWidgetProps> = ({
  discussion,
  commentsLimit,
  height,
  color,
  colorful,
  dark,
  onError,
  onLoad,
  className,
}) => {
  const createScript = useCallback(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = TELEGRAM_WIDGET_SCRIPT_SRC;
    script.setAttribute('data-telegram-discussion', discussion);
    script.setAttribute(
      'data-comments-limit',
      commentsLimit ? commentsLimit.toString() : '5'
    );
    if (height) script.setAttribute('data-height', height.toString());
    if (color) script.setAttribute('data-color', color);
    if (colorful) script.setAttribute('data-colorful', '1');
    if (dark) script.setAttribute('data-dark', '1');

    return script as TelegramScriptElement;
  }, [discussion, commentsLimit, height, color, colorful, dark]);

  return (
    <TelegramWidgetWrap
      className={className}
      createScript={createScript}
      onError={onError}
      onLoad={onLoad}
    />
  );
};

export default TelegramDiscussionWidget;
