# Snake Rounds

A fast-paced snake game with rounds, power-ups, and increasing difficulty. Mobile-friendly with swipe controls.

## Project Structure

```
snake/
├── src/index.ts      # Game HTML export (edit this for changes)
├── index.html        # Standalone browser testing
├── dist/             # Built package files (auto-generated)
├── package.json
└── tsconfig.json
```

## Development Workflow

### Making Changes

1. **Edit the game** in `src/index.ts`
2. **Build the package:**
   ```bash
   npm run build
   ```
3. **Test in browser** by opening `index.html` (for quick visual testing)
4. **Test in mobile app** - changes are picked up automatically via file link in majority-apps
5. **Commit and push** to this repo

### Testing in Majority Apps

The majority-apps repo references this package via file path. After running `npm run build`, changes are available immediately in the mobile app - just reload the app.

```bash
# In snake repo
npm run build

# In majority-apps - just reload the simulator
```

## Usage

### React Native (WebView)

```tsx
import { snakeGameHtml } from "@majority-protocol/snake";
import WebView from "react-native-webview";

<WebView
  source={{ html: snakeGameHtml }}
  javaScriptEnabled={true}
/>
```

### Web (iframe)

```tsx
import { snakeGameHtml } from "@majority-protocol/snake";

<iframe srcDoc={snakeGameHtml} />
```

## Commands

```bash
npm install      # Install dependencies
npm run build    # Build the package
npm run dev      # Watch mode (rebuilds on changes)
```

## How to Play

- **Desktop**: Arrow Keys to move
- **Mobile**: Swipe to change direction
- **Goal**: Reach the target length before time runs out

## Game Items

| Item | Color | Effect |
|------|-------|--------|
| Apple | Red | Grow (normal food) |
| Energy Orb | Purple | Speed boost |
| Diamond | Blue/Cyan | EXTREME speed boost |
| Ice Crystal | Light Blue | Slows you down |
| Coins | Gold | Collect 50 for extra life |
| Barriers | Red | Avoid! (appear in Round 2+) |

## Notes

- The `src/index.ts` has a `margin-left: 45px` on the header to avoid the back button in the mobile app
- The `index.html` doesn't have this margin since there's no back button in browser
- Keep both files in sync when making visual changes
