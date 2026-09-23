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

/**
 * Scope values accepted by `Telegram.Login.init` / `auth`.
 *
 * @see https://core.telegram.org/widgets/login
 */
export type TelegramLoginScope = 'profile' | 'phone' | 'write';

/**
 * Options passed to the Telegram Login JS library.
 *
 * @see https://core.telegram.org/widgets/login
 */
export type TelegramLoginInitOptions = {
  client_id: number;
  scope?: TelegramLoginScope[];
  lang?: string;
  nonce?: string;
};

/**
 * Decoded user claims from a Telegram OIDC `id_token`.
 *
 * @see https://core.telegram.org/widgets/login
 */
export type TelegramLoginUser = {
  id?: number;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  picture?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  sub?: string;
  iss?: string;
  aud?: string | number;
  iat?: number;
  exp?: number;
  nonce?: string;
};

/**
 * Payload returned by the Telegram Login JS library callback.
 *
 * @see https://core.telegram.org/widgets/login
 */
export type TelegramLoginResult =
  | {
      id_token: string;
      user: TelegramLoginUser;
      error?: undefined;
    }
  | {
      error: string;
      id_token?: undefined;
      user?: undefined;
    };

/**
 * Telegram Login JS SDK surface used by this package.
 */
export type TelegramLoginSdk = {
  init: (
    options: TelegramLoginInitOptions,
    callback: (result: TelegramLoginResult) => void
  ) => void;
  open: (callback?: (result: TelegramLoginResult) => void) => void;
  auth: (
    options: TelegramLoginInitOptions,
    callback: (result: TelegramLoginResult) => void
  ) => void;
};

export type TelegramGlobal = {
  Login: TelegramLoginSdk;
};
