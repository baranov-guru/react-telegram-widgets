# @baranov-guru/react-telegram-widgets

React components for embedding Telegram posts and comments widgets in your web applications.

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
import { TelegramPostWidget } from "@baranov-guru/react-telegram-widgets";

function App() {
  return (
    <div>
      <h1>My Blog Post</h1>
      <p>Check out this Telegram post:</p>
      <TelegramPostWidget
        post="https://t.me/username/123"
        dark={true}
        onSuccess={() => console.log("Post loaded successfully!")}
        onError={(error) => console.error("Failed to load post:", error)}
      />
    </div>
  );
}
```

### TelegramCommentsWidget

Embed Telegram comments for a discussion:

```tsx
import { TelegramCommentsWidget } from "@baranov-guru/react-telegram-widgets";

function App() {
  return (
    <div>
      <h1>Discussion</h1>
      <TelegramCommentsWidget
        discussion="https://t.me/username/123"
        commentsLimit={10}
        dark={true}
        colorful={true}
        onLoad={() => console.log("Comments loaded!")}
        onError={(error) => console.error("Failed to load comments:", error)}
      />
    </div>
  );
}
```

## API Reference

### TelegramPostWidget Props

| Prop        | Type                   | Default      | Description                               |
| ----------- | ---------------------- | ------------ | ----------------------------------------- |
| `post`      | `string`               | **required** | The URL of the Telegram post to embed     |
| `userpic`   | `boolean \| "auto"`    | `"auto"`     | Whether to show user avatars              |
| `height`    | `number`               | -            | Height of the widget in pixels            |
| `dark`      | `boolean`              | `false`      | Enable dark theme                         |
| `onError`   | `(e: unknown) => void` | -            | Callback when an error occurs             |
| `onSuccess` | `() => void`           | -            | Callback when the post loads successfully |

### TelegramCommentsWidget Props

| Prop            | Type                   | Default      | Description                                 |
| --------------- | ---------------------- | ------------ | ------------------------------------------- |
| `discussion`    | `string`               | **required** | The URL of the Telegram discussion to embed |
| `commentsLimit` | `number`               | `5`          | Maximum number of comments to display       |
| `height`        | `number`               | -            | Height of the widget in pixels              |
| `color`         | `string`               | -            | Custom color for the widget                 |
| `colorful`      | `boolean`              | `false`      | Enable colorful theme                       |
| `dark`          | `boolean`              | `false`      | Enable dark theme                           |
| `onError`       | `(e: unknown) => void` | -            | Callback when an error occurs               |
| `onLoad`        | `() => void`           | -            | Callback when comments load successfully    |

## Examples

### Basic Usage

```tsx
import {
  TelegramPostWidget,
  TelegramCommentsWidget,
} from "@baranov-guru/react-telegram-widgets";

function BlogPost() {
  return (
    <article>
      <h1>My Article</h1>
      <p>Article content...</p>

      {/* Embed a related Telegram post */}
      <TelegramPostWidget post="https://t.me/technews/456" dark={true} />

      {/* Add comments section */}
      <h2>Comments</h2>
      <TelegramCommentsWidget
        discussion="https://t.me/technews/456"
        commentsLimit={20}
        colorful={true}
      />
    </article>
  );
}
```

### With Error Handling

```tsx
import { TelegramPostWidget } from "@baranov-guru/react-telegram-widgets";

function SafeTelegramWidget() {
  const handleError = (error: unknown) => {
    console.error("Telegram widget error:", error);
    // Show fallback content or error message
  };

  const handleSuccess = () => {
    console.log("Telegram widget loaded successfully");
  };

  return (
    <TelegramPostWidget
      post="https://t.me/username/123"
      onError={handleError}
      onSuccess={handleSuccess}
    />
  );
}
```

## Requirements

- React 16.8.0 or higher
- React DOM 16.8.0 or higher

## Browser Support

This package uses the official Telegram Widget API, which supports all modern browsers.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
