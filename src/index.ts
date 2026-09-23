// Widgets
export { default as TelegramDiscussionWidget } from './widgets/TelegramDiscussionWidget';
export { default as TelegramLegacyLoginWidget } from './widgets/TelegramLegacyLoginWidget';
export { default as TelegramPostWidget } from './widgets/TelegramPostWidget';
export { default as TelegramShareWidget } from './widgets/TelegramShareWidget';

// Login (OIDC)
export { default as TelegramLoginWidget } from './login/TelegramLoginWidget';
export { useTelegramLogin } from './login/useTelegramLogin';
export { loadTelegramLoginScript } from './login/loadTelegramLoginScript';

// Widget prop types
export type { TelegramDiscussionWidgetProps } from './widgets/TelegramDiscussionWidget';
export type { TelegramLegacyLoginWidgetProps } from './widgets/TelegramLegacyLoginWidget';
export type { TelegramPostWidgetProps } from './widgets/TelegramPostWidget';
export type { TelegramShareWidgetProps } from './widgets/TelegramShareWidget';
export type { TelegramLoginWidgetProps } from './login/TelegramLoginWidget';

// Hook types
export type {
  TelegramLoginSuccess,
  UseTelegramLoginOptions,
  UseTelegramLoginReturn,
} from './login/useTelegramLogin';

// Shared types
export type {
  TelegramLegacyLoginData,
  TelegramScriptElement,
  TelegramWidgetCommonProps,
  TelegramWidgetSize,
} from './shared/types';

// Login types
export type {
  TelegramGlobal,
  TelegramLoginInitOptions,
  TelegramLoginResult,
  TelegramLoginScope,
  TelegramLoginSdk,
  TelegramLoginUser,
} from './login/types';

// Constants
export {
  TELEGRAM_LOGIN_SCRIPT_SRC,
  TELEGRAM_WIDGET_SCRIPT_SRC,
} from './shared/constants';
