# @baranov-guru/react-telegram-widgets

[![npm version](https://img.shields.io/npm/v/@baranov-guru/react-telegram-widgets.svg)](https://www.npmjs.com/package/@baranov-guru/react-telegram-widgets)
[![npm downloads](https://img.shields.io/npm/dm/@baranov-guru/react-telegram-widgets.svg)](https://www.npmjs.com/package/@baranov-guru/react-telegram-widgets)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@baranov-guru/react-telegram-widgets)](https://bundlephobia.com/package/@baranov-guru/react-telegram-widgets)
[![npm license](https://img.shields.io/npm/l/@baranov-guru/react-telegram-widgets.svg)](https://github.com/baranov-guru/react-telegram-widgets/blob/main/LICENSE)
[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/baranov-guru/react-telegram-widgets/ci.yml?branch=main)](https://github.com/baranov-guru/react-telegram-widgets/actions)
[![Codecov](https://img.shields.io/codecov/c/github/baranov-guru/react-telegram-widgets)](https://codecov.io/gh/baranov-guru/react-telegram-widgets)
[![GitHub issues](https://img.shields.io/github/issues/baranov-guru/react-telegram-widgets.svg)](https://github.com/baranov-guru/react-telegram-widgets/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/baranov-guru/react-telegram-widgets.svg)](https://github.com/baranov-guru/react-telegram-widgets/pulls)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

React components for embedding Telegram posts and comments widgets in your web applications.

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
        post='durov/123'
        width='100%'
        dark={true}
        onLoad={() => console.log('Post loaded successfully!')}
        onError={error => console.error('Failed to load post:', error)}
      />
    </div>
  );
}
```

### TelegramCommentsWidget

Embed Telegram comments for a discussion:

```tsx
import { TelegramCommentsWidget } from '@baranov-guru/react-telegram-widgets';

function App() {
  return (
    <div>
      <h1>Discussion</h1>
      <TelegramCommentsWidget
        discussion='durov/123'
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

## API Reference

### TelegramPostWidget Props

| Prop        | Type                               | Default      | Description                                                                 |
| ----------- | ---------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `post`      | `string`                           | **required** | The post identifier in format "channel/post_id" (e.g., "durov/1")           |
| `userpic`   | `boolean \| "auto"`                | `"auto"`     | Whether to show user pictures. "auto" shows them only if post contains them |
| `width`     | `CSSProperties["width"] \| "100%"` | `"100%"`     | The width of the widget                                                     |
| `dark`      | `boolean`                          | `false`      | Enable dark theme                                                           |
| `className` | `string`                           | -            | Optional CSS class for the container                                        |
| `onError`   | `(e: unknown) => void`             | -            | Callback when an error occurs                                               |
| `onLoad`    | `() => void`                       | -            | Callback when the widget loads successfully                                 |

### TelegramCommentsWidget Props

| Prop            | Type                   | Default      | Description                                                             |
| --------------- | ---------------------- | ------------ | ----------------------------------------------------------------------- |
| `discussion`    | `string`               | **required** | The discussion identifier in format "channel/post_id" (e.g., "durov/1") |
| `commentsLimit` | `number`               | `5`          | Maximum number of comments to display                                   |
| `height`        | `number`               | -            | Height of the widget in pixels                                          |
| `color`         | `string`               | -            | Color of widget elements (hex format, e.g., "#cbcbcb")                  |
| `colorful`      | `boolean`              | `false`      | Enable colorful usernames                                               |
| `dark`          | `boolean`              | `false`      | Enable dark theme                                                       |
| `className`     | `string`               | -            | Optional CSS class for the container                                    |
| `onError`       | `(e: unknown) => void` | -            | Callback when an error occurs                                           |
| `onLoad`        | `() => void`           | -            | Callback when the widget loads successfully                             |

## Examples

### Basic Usage

```tsx
import {
  TelegramPostWidget,
  TelegramCommentsWidget,
} from '@baranov-guru/react-telegram-widgets';

function BlogPost() {
  return (
    <article>
      <h1>My Article</h1>
      <p>Article content...</p>

      {/* Embed a related Telegram post */}
      <TelegramPostWidget post='durov/456' width='100%' dark={true} />

      {/* Add comments section */}
      <h2>Comments</h2>
      <TelegramCommentsWidget
        discussion='durov/456'
        commentsLimit={20}
        height={500}
        colorful={true}
      />
    </article>
  );
}
```

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
      post='durov/123'
      onError={handleError}
      onLoad={handleSuccess}
    />
  );
}
```

### Custom Styling

```tsx
import { TelegramCommentsWidget } from '@baranov-guru/react-telegram-widgets';

function CustomComments() {
  return (
    <TelegramCommentsWidget
      discussion='durov/789'
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
  TelegramCommentsWidget,
  TelegramCommentsWidgetProps,
} from '@baranov-guru/react-telegram-widgets';

// Use the types for your own components
const MyComponent: React.FC<TelegramPostWidgetProps> = props => {
  return <TelegramPostWidget {...props} />;
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
- Website: [alexeybaranov.dev](https://alexeybaranov.dev)

## Support the Author

If you find this package helpful and would like to support its development, please consider:

[![Support the Author](https://img.shields.io/badge/Support%20the%20Author-FF6B6B?style=for-the-badge&logo=heart&logoColor=white)](https://alexeybaranov.dev/support/)

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
