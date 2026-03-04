# react-canvas-snow

Lightweight, high-performance snowfall effect for React. Uses HTML Canvas for rendering hundreds of snowflakes with minimal CPU usage.

![npm](https://img.shields.io/npm/v/react-canvas-snow)
![bundle size](https://img.shields.io/bundlephobia/minzip/react-canvas-snow)
![license](https://img.shields.io/npm/l/react-canvas-snow)

## Features

- Canvas-based rendering (no DOM pollution with hundreds of elements)
- Configurable snowflake count, size, speed, opacity, and swing
- Custom snowflake color
- Responsive — adapts to container resize via `ResizeObserver`
- Zero runtime dependencies (only `react` as peer dependency)
- TypeScript support with full type definitions
- Tiny bundle size

## Installation

```bash
npm install react-canvas-snow
```

or

```bash
yarn add react-canvas-snow
```

or

```bash
pnpm add react-canvas-snow
```

## Quick Start

```tsx
import { Snow } from 'react-canvas-snow';
import 'react-canvas-snow/styles.css';

function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#1a1a2e' }}>
      <Snow />
    </div>
  );
}
```

> **Important:** The `<Snow />` component is absolutely positioned and fills its parent container. Make sure the parent has `position: relative` (or `absolute`/`fixed`) and a defined width/height.

## Props

### `config` (optional)

Partial configuration object. Any omitted fields use the defaults shown below.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `count` | `number` | `350` | Total number of snowflakes rendered on the canvas |
| `size.min` | `number` | `2` | Minimum snowflake diameter in pixels |
| `size.max` | `number` | `9` | Maximum snowflake diameter in pixels |
| `speed.min` | `number` | `15` | Minimum fall duration in seconds (slower) |
| `speed.max` | `number` | `25` | Maximum fall duration in seconds (slowest) |
| `opacity.min` | `number` | `0.1` | Minimum snowflake opacity (0–1) |
| `opacity.max` | `number` | `0.5` | Maximum snowflake opacity (0–1) |
| `swing.min` | `number` | `20` | Minimum horizontal swing amplitude in pixels |
| `swing.max` | `number` | `200` | Maximum horizontal swing amplitude in pixels |
| `color` | `string` | `"white"` | Snowflake color (any valid CSS color value) |

### `className` (optional)

Additional CSS class name applied to the container `<div>`.

### `style` (optional)

Inline styles applied to the container `<div>`.

## Configuration Examples

### Light snow

```tsx
<Snow config={{ count: 100, size: { min: 1, max: 4 }, speed: { min: 20, max: 35 } }} />
```

### Heavy blizzard

```tsx
<Snow config={{ count: 800, size: { min: 3, max: 12 }, speed: { min: 5, max: 12 } }} />
```

### Golden particles

```tsx
<Snow config={{ count: 200, color: '#ffd700', opacity: { min: 0.3, max: 0.8 } }} />
```

### Gentle drift (minimal swing)

```tsx
<Snow config={{ count: 250, swing: { min: 5, max: 30 } }} />
```

## How It Works

The component renders a `<canvas>` element inside an absolutely positioned container. Snowflakes are simulated as particles with individual properties (position, size, speed, opacity, swing, rotation, skew). Each frame, the canvas is cleared and all snowflakes are redrawn using the Canvas 2D API with `Path2D` caching for performance.

The internal canvas resolution is halved (`0.5x`) and scaled back up via CSS to reduce the number of pixels drawn while maintaining visual quality — this gives a significant performance boost especially with high snowflake counts.

A `ResizeObserver` watches the parent container so the canvas automatically adapts when the window or container is resized.

## TypeScript

Full type definitions are included. You can import the types directly:

```tsx
import type { SnowConfig, SnowProps } from 'react-canvas-snow';

const myConfig: Partial<SnowConfig> = {
  count: 500,
  color: '#e0e8ff',
};
```

## Browser Support

Works in all modern browsers that support:
- HTML Canvas 2D (`CanvasRenderingContext2D`)
- `Path2D`
- `ResizeObserver`
- `requestAnimationFrame`

## Publishing to npm

1. Update `author` and `repository.url` in `package.json`
2. Build the library:

```bash
npm install
npm run build
```

3. Preview what will be published:

```bash
npm pack --dry-run
```

4. Publish:

```bash
npm login
npm publish
```

## Development

```bash
git clone <your-repo-url>
cd react-canvas-snow
npm install
npm run dev      # watch mode with tsup
npm run build    # production build
npm run typecheck # type checking without emitting
```

## License

MIT
