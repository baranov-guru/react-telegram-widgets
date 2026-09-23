// Re-export components
export { default as TelegramDiscussionWidget } from './TelegramDiscussionWidget';
export { default as TelegramLegacyLoginWidget } from './TelegramLegacyLoginWidget';
export { default as TelegramLoginWidget } from './TelegramLoginWidget';
export { default as TelegramPostWidget } from './TelegramPostWidget';
export { default as TelegramShareWidget } from './TelegramShareWidget';

// Re-export hooks
export { useTelegramLogin } from './useTelegramLogin';
export type {
  TelegramLoginSuccess,
  UseTelegramLoginOptions,
  UseTelegramLoginReturn,
} from './useTelegramLogin';

// Re-export loaders
export { loadTelegramLoginScript } from './loadTelegramLoginScript';

// Re-export types
export type { TelegramDiscussionWidgetProps } from './TelegramDiscussionWidget';
export type { TelegramLegacyLoginWidgetProps } from './TelegramLegacyLoginWidget';
export type { TelegramLoginWidgetProps } from './TelegramLoginWidget';
export type { TelegramPostWidgetProps } from './TelegramPostWidget';
export type { TelegramShareWidgetProps } from './TelegramShareWidget';
export type {
  TelegramGlobal,
  TelegramLegacyLoginData,
  TelegramLoginInitOptions,
  TelegramLoginResult,
  TelegramLoginScope,
  TelegramLoginSdk,
  TelegramLoginUser,
  TelegramScriptElement,
  TelegramWidgetCommonProps,
  TelegramWidgetSize,
} from './types';

// Re-export constants
export {
  TELEGRAM_LOGIN_SCRIPT_SRC,
  TELEGRAM_WIDGET_SCRIPT_SRC,
} from './constants';
