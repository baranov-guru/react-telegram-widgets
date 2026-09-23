# @baranov-guru/react-telegram-widgets

[![npm version](https://img.shields.io/npm/v/@baranov-guru/react-telegram-widgets.svg)](https://www.npmjs.com/package/@baranov-guru/react-telegram-widgets)
[![npm downloads](https://img.shields.io/npm/dm/@baranov-guru/react-telegram-widgets.svg)](https://www.npmjs.com/package/@baranov-guru/react-telegram-widgets)
[![npm license](https://img.shields.io/npm/l/@baranov-guru/react-telegram-widgets.svg)](https://github.com/baranov-guru/react-telegram-widgets/blob/main/LICENSE)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/baranov-guru/react-telegram-widgets/ci.yml?branch=main)](https://github.com/baranov-guru/react-telegram-widgets/actions)
[![Codecov](https://img.shields.io/codecov/c/github/baranov-guru/react-telegram-widgets)](https://codecov.io/gh/baranov-guru/react-telegram-widgets)
[![GitHub issues](https://img.shields.io/github/issues/baranov-guru/react-telegram-widgets.svg)](https://github.com/baranov-guru/react-telegram-widgets/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/baranov-guru/react-telegram-widgets.svg)](https://github.com/baranov-guru/react-telegram-widgets/pulls)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

React components for embedding Telegram posts, comments, login, and share widgets in your web applications.

> 📖 **Official Documentation**: This package is based on the [Telegram Widget API](https://core.telegram.org/widgets). For detailed information about widget configuration and options, please refer to the official documentation.

## Installation

```bash
npm install @baranov-guru/react-telegram-widgets
```

or

```bash
yarn add @baranov-guru/react-telegram-widgets
```

## Usage

### TelegramPostWidget

Embed a Telegram post in your React application:

```tsx
import { TelegramPostWidget } from '@baranov-guru/react-telegram-widgets';

function App() {
  return (
    <div>
      <h1>My Blog Post</h1>
      <p>Check out this Telegram post:</p>
      <TelegramPostWidget
        post='baranov_guru/61'
        width='100%'
        dark={true}
        onLoad={() => console.log('Post loaded successfully!')}
        onError={error => console.error('Failed to load post:', error)}
      />
    </div>
  );
}
```

### TelegramDiscussionWidget

Embed Telegram comments for a discussion:

```tsx
import { TelegramDiscussionWidget } from '@baranov-guru/react-telegram-widgets';

function App() {
  return (
    <div>
      <h1>Discussion</h1>
      <TelegramDiscussionWidget
        discussion='baranov_guru/61'
        commentsLimit={10}
        height={400}
        color='#ff0000'
        colorful={true}
        dark={true}
        onLoad={() => console.log('Comments loaded!')}
        onError={error => console.error('Failed to load comments:', error)}
      />
    </div>
  );
}
```

### TelegramLoginWidget

Log in with Telegram using the current [OpenID Connect login library](https://core.telegram.org/widgets/login).

Register your site origin in @BotFather (Login Widget → Allowed URLs) and use the numeric **Client ID**.

> Important: `telegram-login.js` uses a popup. If your site sends `Cross-Origin-Opener-Policy: same-origin`, login will fail. Use `same-origin-allow-popups` (or remove the header).

```tsx
import {
  TelegramLoginWidget,
  TelegramLoginSuccess,
} from '@baranov-guru/react-telegram-widgets';

function LoginPage() {
  const handleAuth = async (result: TelegramLoginSuccess) => {
    // Send id_token to your backend and verify it there (see Server-side verification).
    await fetch('/api/auth/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: result.id_token }),
    });
  };

  return (
    <TelegramLoginWidget
      clientId={123456789}
      scope={['profile', 'write']}
      onAuth={handleAuth}
      onError={error => console.error('Login failed:', error)}
    />
  );
}
```

Headless usage with the hook:

```tsx
import { useTelegramLogin } from '@baranov-guru/react-telegram-widgets';

function CustomLoginButton() {
  const { login, isReady, isLoading, error } = useTelegramLogin({
    clientId: 123456789,
    scope: ['profile'],
    onAuth: result => console.log(result.id_token, result.user),
  });

  return (
    <button type='button' disabled={!isReady || isLoading} onClick={() => login()}>
      Continue with Telegram
    </button>
  );
}
```

### TelegramLegacyLoginWidget

Embed the [legacy iframe Login Widget](https://core.telegram.org/widgets/login-legacy) (payload with `hash`). Prefer `TelegramLoginWidget` for new integrations.

```tsx
import {
  TelegramLegacyLoginWidget,
  TelegramLegacyLoginData,
} from '@baranov-guru/react-telegram-widgets';

function LegacyLoginPage() {
  const handleAuth = async (user: TelegramLegacyLoginData) => {
    await fetch('/api/auth/telegram-legacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
  };

  return (
    <TelegramLegacyLoginWidget
      botName='SampleBot'
      size='large'
      radius={8}
      requestAccess={true}
      onAuth={handleAuth}
      onError={error => console.error('Login widget error:', error)}
    />
  );
}
```

You can also redirect after legacy login with `authUrl` instead of (or in addition to) `onAuth`.

### TelegramShareWidget

Embed a [Telegram Sharing Button](https://core.telegram.org/widgets/share):

```tsx
import { TelegramShareWidget } from '@baranov-guru/react-telegram-widgets';

function ShareSection() {
  return (
    <TelegramShareWidget
      url='https://example.com/article'
      comment='Check out this article!'
      size='large'
    />
  );
}
```

## API Reference

### TelegramPostWidget Props

| Prop        | Type                               | Default      | Description                                                                    |
| ----------- | ---------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| `post`      | `string`                           | **required** | The post identifier in format "channel/post_id" (e.g., "baranov_guru/1") |
| `userpic`   | `boolean \| "auto"`                | `"auto"`     | Whether to show user pictures. "auto" shows them only if post contains them    |
| `width`     | `CSSProperties["width"] \| "100%"` | `"100%"`     | The width of the widget                                                        |
| `dark`      | `boolean`                          | `false`      | Enable dark theme                                                              |
| `className` | `string`                           | -            | Optional CSS class for the container                                           |
| `onError`   | `(e: unknown) => void`             | -            | Callback when an error occurs                                                  |
| `onLoad`    | `() => void`                       | -            | Callback when the widget loads successfully                                    |

### TelegramDiscussionWidget Props

| Prop            | Type                   | Default      | Description                                                                                                                    |
| --------------- | ---------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `discussion`    | `string`               | **required** | The discussion identifier in format "channel/post_id" or just "channel" (e.g., "baranov_guru/1" or "baranov_guru") |
| `commentsLimit` | `number`               | `5`          | Maximum number of comments to display                                                                                          |
| `height`        | `number`               | -            | Height of the widget in pixels                                                                                                 |
| `color`         | `string`               | -            | Color of widget elements (hex format, e.g., "#cbcbcb")                                                                         |
| `colorful`      | `boolean`              | `false`      | Enable colorful usernames                                                                                                      |
| `dark`          | `boolean`              | `false`      | Enable dark theme                                                                                                              |
| `className`     | `string`               | -            | Optional CSS class for the container                                                                                           |
| `onError`       | `(e: unknown) => void` | -            | Callback when an error occurs                                                                                                  |
| `onLoad`        | `() => void`           | -            | Callback when the widget loads successfully                                                                                    |

### TelegramLoginWidget Props

| Prop        | Type                                                         | Default  | Description                                                                 |
| ----------- | ------------------------------------------------------------ | -------- | --------------------------------------------------------------------------- |
| `clientId`  | `number`                                                     | **required** | Bot Client ID from @BotFather                                           |
| `scope`     | `Array<"profile" \| "phone" \| "write">`                     | -        | Optional scopes (`write` ≈ bot messaging permission in the JS API)          |
| `lang`      | `string`                                                     | -        | Optional UI language code                                                   |
| `nonce`     | `string`                                                     | -        | Optional server-generated nonce bound into the `id_token`                   |
| `onAuth`    | `(result: TelegramLoginSuccess) => void`                     | -        | Success callback with `id_token` and decoded `user`                         |
| `onError`   | `(error: string) => void`                                    | -        | Error callback                                                              |
| `autoInit`  | `boolean`                                                    | `true`   | Load script and call `Telegram.Login.init` on mount                         |
| `disabled`  | `boolean`                                                    | `false`  | Extra disabled flag                                                         |
| `className` | `string`                                                     | -        | CSS class for the default `<button>`                                        |
| `children`  | `React.ReactNode`                                            | -        | Custom label, or a single element cloned with `onClick` / `disabled`        |

`TelegramLoginSuccess`: `{ id_token: string; user: TelegramLoginUser }`.

Always verify `id_token` on your server. This package does not include server helpers.

### TelegramLegacyLoginWidget Props

| Prop            | Type                                         | Default      | Description                                                                    |
| --------------- | -------------------------------------------- | ------------ | ------------------------------------------------------------------------------ |
| `botName`       | `string`                                     | **required** | Bot username used for authorization (without `@`)                              |
| `size`          | `"large" \| "medium" \| "small"`             | -            | Button size (`data-size`). Telegram uses large when omitted                    |
| `userpic`       | `boolean`                                    | `true`       | Whether to show the user avatar. When `false`, sets `data-userpic="false"`     |
| `radius`        | `number`                                     | -            | Corner radius of the button in pixels                                          |
| `requestAccess` | `boolean`                                    | `false`      | When `true`, requests write access (`data-request-access="write"`)             |
| `authUrl`       | `string`                                     | -            | Redirect URL after authorization (`data-auth-url`)                             |
| `onAuth`        | `(data: TelegramLegacyLoginData) => void`    | -            | Callback with user data after successful authorization                         |
| `className`     | `string`                                     | -            | Optional CSS class for the container                                           |
| `onError`       | `(e: unknown) => void`                       | -            | Callback when an error occurs                                                  |
| `onLoad`        | `() => void`                                 | -            | Callback when the widget loads successfully                                    |

`TelegramLegacyLoginData` fields: `id`, `first_name?`, `last_name?`, `username?`, `photo_url?`, `auth_date`, `hash`.

### TelegramShareWidget Props

| Prop        | Type                             | Default      | Description                                      |
| ----------- | -------------------------------- | ------------ | ------------------------------------------------ |
| `url`       | `string`                         | **required** | Absolute URL to share                            |
| `comment`   | `string`                         | -            | Optional comment included with the shared link   |
| `size`      | `"large" \| "medium" \| "small"` | -            | Button size                                      |
| `className` | `string`                         | -            | Optional CSS class for the container             |
| `onError`   | `(e: unknown) => void`           | -            | Callback when an error occurs                    |
| `onLoad`    | `() => void`                     | -            | Callback when the widget loads successfully      |

## Examples

### Basic Usage

```tsx
import {
  TelegramPostWidget,
  TelegramDiscussionWidget,
  TelegramLoginWidget,
  TelegramShareWidget,
} from '@baranov-guru/react-telegram-widgets';

function BlogPost() {
  return (
    <article>
      <h1>My Article</h1>
      <p>Article content...</p>

      <TelegramShareWidget
        url='https://example.com/my-article'
        comment='Read this article'
      />

      <TelegramPostWidget
        post='baranov_guru/1'
        width='100%'
        dark={true}
      />

      <h2>Comments</h2>
      <TelegramDiscussionWidget
        discussion='baranov_guru'
        commentsLimit={20}
        height={500}
        colorful={true}
      />

      <h2>Sign in</h2>
      <TelegramLoginWidget
        clientId={123456789}
        scope={['profile']}
        onAuth={result => console.log(result.id_token, result.user)}
      />
    </article>
  );
}
```

### Server-side verification

These snippets are **documentation examples only** — they are not exported from this package. Always verify Telegram credentials on your backend.

#### OIDC `id_token` (recommended)

Verify the JWT with Telegram's JWKS. Example using [`jose`](https://github.com/panva/jose):

```ts
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL('https://oauth.telegram.org/.well-known/jwks.json')
);

export async function verifyTelegramIdToken(
  idToken: string,
  clientId: number,
  expectedNonce?: string
) {
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: 'https://oauth.telegram.org',
    audience: String(clientId),
  });

  if (expectedNonce && payload.nonce !== expectedNonce) {
    throw new Error('Invalid nonce');
  }

  return payload;
}

// Example Express-style handler
app.post('/api/auth/telegram', async (req, res) => {
  const { id_token } = req.body;
  const claims = await verifyTelegramIdToken(
    id_token,
    Number(process.env.TELEGRAM_CLIENT_ID),
    req.session.telegramNonce // if you issued a nonce
  );
  // create your session from claims.id / claims.sub
  res.json({ ok: true, userId: claims.id ?? claims.sub });
});
```

See the official [Log In With Telegram](https://core.telegram.org/widgets/login) docs for claim details. For full redirect-based OIDC (authorization code + PKCE), use Telegram as a standard OIDC provider — that flow is outside this React package.

#### Legacy `hash`

```ts
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { TelegramLegacyLoginData } from '@baranov-guru/react-telegram-widgets';

export function verifyTelegramLegacyLogin(
  data: TelegramLegacyLoginData,
  botToken: string,
  maxAgeSeconds = 86400
) {
  const { hash, ...fields } = data;
  const checkString = Object.keys(fields)
    .sort()
    .map(key => `${key}=${(fields as Record<string, unknown>)[key]}`)
    .join('\n');

  const secretKey = createHash('sha256').update(botToken).digest();
  const computed = createHmac('sha256', secretKey)
    .update(checkString)
    .digest('hex');

  const a = Buffer.from(computed, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error('Invalid Telegram login hash');
  }

  const now = Math.floor(Date.now() / 1000);
  if (now - data.auth_date > maxAgeSeconds) {
    throw new Error('Telegram login data is too old');
  }

  return data;
}
```

Never put the bot token or Client Secret in client-side code.

### With Error Handling

```tsx
import { TelegramPostWidget } from '@baranov-guru/react-telegram-widgets';

function SafeTelegramWidget() {
  const handleError = (error: unknown) => {
    console.error('Telegram widget error:', error);
    // Show fallback content or error message
  };

  const handleSuccess = () => {
    console.log('Telegram widget loaded successfully');
  };

  return (
    <TelegramPostWidget
      post='baranov_guru/61'
      onError={handleError}
      onLoad={handleSuccess}
    />
  );
}
```

### Custom Styling

```tsx
import { TelegramDiscussionWidget } from '@baranov-guru/react-telegram-widgets';

function CustomComments() {
  return (
    <TelegramDiscussionWidget
      discussion='baranov_guru/61'
      commentsLimit={15}
      height={600}
      color='#4a90e2'
      colorful={true}
      dark={true}
      className='my-custom-comments-widget'
    />
  );
}
```

## TypeScript Support

The package includes full TypeScript support with exported types:

```tsx
import {
  TelegramPostWidget,
  TelegramPostWidgetProps,
  TelegramDiscussionWidget,
  TelegramDiscussionWidgetProps,
  TelegramLoginWidget,
  TelegramLoginWidgetProps,
  TelegramLoginSuccess,
  TelegramLegacyLoginWidget,
  TelegramLegacyLoginWidgetProps,
  TelegramLegacyLoginData,
  TelegramShareWidget,
  TelegramShareWidgetProps,
  useTelegramLogin,
} from '@baranov-guru/react-telegram-widgets';

const MyComponent: React.FC<TelegramPostWidgetProps> = props => {
  return <TelegramPostWidget {...props} />;
};

const handleAuth = (result: TelegramLoginSuccess) => {
  // forward result.id_token to your API
};

const handleLegacyAuth = (user: TelegramLegacyLoginData) => {
  // forward user (with hash) to your API
};
```

## Requirements

- React 16.8.0 or higher
- React DOM 16.8.0 or higher

## Browser Support

This package uses the official Telegram Widget API, which supports all modern browsers.

## Author

**Alexey Baranov (Nejivoi)**

- GitHub: [@Nejivoi](https://github.com/Nejivoi)
- Website: [baranov.guru](https://baranov.guru)

## Support the Author

If you find this package helpful and would like to support its development, please consider:

[![Support the Author](https://img.shields.io/badge/Support%20the%20Author-FF6B6B?style=for-the-badge&logo=heart&logoColor=white)](https://baranov.guru/support/)

Your support helps maintain and improve this package! ❤️

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Publishing

This package uses GitHub Actions for automated publishing. To publish a new version:

1. **Set up NPM Token**: Add your NPM token as a GitHub secret named `NPM_TOKEN`
   - Go to your GitHub repository settings
   - Navigate to Secrets and variables → Actions
   - Add a new secret with name `NPM_TOKEN` and your NPM access token as the value

2. **Create a Release**:
   - Create a new release on GitHub
   - Tag it with the version (e.g., `v1.0.1`)
   - The workflow will automatically build, test, and publish to npm

### Manual Publishing

If you prefer to publish manually:

```bash
npm run build
npm publish --access public
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build package
npm run build

# Watch mode for development
npm run dev

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check code formatting
npm run format:check

# Run all checks (lint, format, test)
npm run check
```
