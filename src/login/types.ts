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
 * Successful login payload handed to consumers.
 */
export type TelegramLoginSuccess = {
  id_token: string;
  user: TelegramLoginUser;
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
