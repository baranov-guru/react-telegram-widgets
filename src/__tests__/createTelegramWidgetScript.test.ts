import { TELEGRAM_WIDGET_SCRIPT_SRC } from '../shared/constants';
import { createTelegramWidgetScript } from '../shared/createTelegramWidgetScript';

describe('createTelegramWidgetScript', () => {
  it('creates an async script pointing at the Telegram widget CDN', () => {
    const script = createTelegramWidgetScript();

    expect(script.async).toBe(true);
    expect(script.src).toBe(TELEGRAM_WIDGET_SCRIPT_SRC);
  });

  it('returns a fresh script element on each call', () => {
    const first = createTelegramWidgetScript();
    const second = createTelegramWidgetScript();

    expect(first).not.toBe(second);
  });
});
