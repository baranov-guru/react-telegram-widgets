import { TELEGRAM_WIDGET_SCRIPT_SRC } from './constants';
import { TelegramScriptElement } from './types';

/**
 * Creates the base async script element used by embed widgets
 * (post, discussion, share, legacy login).
 */
export const createTelegramWidgetScript = (): TelegramScriptElement => {
  const script = document.createElement('script');
  script.async = true;
  script.src = TELEGRAM_WIDGET_SCRIPT_SRC;
  return script as TelegramScriptElement;
};
