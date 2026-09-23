import {
  TELEGRAM_LOGIN_SCRIPT_SRC,
  TELEGRAM_WIDGET_SCRIPT_SRC,
  TelegramDiscussionWidget,
  TelegramLegacyLoginWidget,
  TelegramLoginWidget,
  TelegramPostWidget,
  TelegramShareWidget,
  loadTelegramLoginScript,
  useTelegramLogin,
} from '../index';

describe('public API exports', () => {
  it('exports widget components, hooks, and script constants', () => {
    expect(TelegramPostWidget).toBeDefined();
    expect(TelegramDiscussionWidget).toBeDefined();
    expect(TelegramLoginWidget).toBeDefined();
    expect(TelegramLegacyLoginWidget).toBeDefined();
    expect(TelegramShareWidget).toBeDefined();
    expect(useTelegramLogin).toBeDefined();
    expect(loadTelegramLoginScript).toBeDefined();
    expect(TELEGRAM_WIDGET_SCRIPT_SRC).toBe(
      'https://telegram.org/js/telegram-widget.js?22'
    );
    expect(TELEGRAM_LOGIN_SCRIPT_SRC).toBe(
      'https://telegram.org/js/telegram-login.js'
    );
  });
});
