export type TelegramScriptElement = HTMLScriptElement & {
  _iframe: HTMLIFrameElement | undefined;
};

export type TelegramWidgetCommonProps = {
  /**
   * Optional CSS class for the container div.
   */
  className?: string;
  /**
   * Optional callback invoked when the widget loads successfully.
   */
  onLoad?: () => void;
  /**
   * Optional callback invoked when an error occurs during widget loading.
   */
  onError?: (e: unknown) => void;
};

/**
 * User data returned by the legacy Telegram Login Widget after authorization.
 *
 * @see https://core.telegram.org/widgets/login-legacy
 */
export type TelegramLegacyLoginData = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

/**
 * Size of Telegram login / share widget buttons.
 */
export type TelegramWidgetSize = 'large' | 'medium' | 'small';
