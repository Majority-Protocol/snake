# Snake Rounds

A fast-paced snake game with rounds, power-ups, and increasing difficulty. Mobile-friendly with swipe controls.

## Installation

```bash
npm install @anthropic-internal/snake
```

## Usage

### React Native (WebView)

```tsx
import { snakeGameHtml } from "@anthropic-internal/snake";
import WebView from "react-native-webview";

<WebView
  source={{ html: snakeGameHtml }}
  javaScriptEnabled={true}
/>
```

### Web (iframe)

```tsx
import { snakeGameHtml } from "@anthropic-internal/snake";

<iframe srcDoc={snakeGameHtml} />
```

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode for development
npm run dev
```

## Testing Standalone

Open `index.html` in a web browser to test the game directly.

## How to Play

- **Desktop**: Arrow Keys to move
- **Mobile**: Swipe to change direction
- **Goal**: Reach the target length before time runs out

## Items

- **Red Apple**: Eat to grow (normal)
- **Purple Orb**: Speed boost
- **Blue Diamond**: EXTREME speed boost
- **Ice Hexagon**: Slows you down
- **Gold Coins**: Collect 50 for an extra life
- **Red Diamonds**: Barriers - avoid these (appear in round 2+)
