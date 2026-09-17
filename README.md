# mors-component-library

An independent, Apple-inspired React component library. Neutral surfaces, Apple blue (`#0071e3`), capsule buttons, SF/system type, and one portable CSS file you can drop into any project.

Not affiliated with or endorsed by Apple Inc.

## What’s in the box

- **React 19 + TypeScript**, Vite 8, zero runtime dependencies besides React
- **40+ components** covering actions, forms, overlays, navigation, and data
- **One stylesheet** (`mors-component-library/styles.css`) — no CSS-in-JS, no global reset
- **`--mors-*` design tokens** so you can rebrand without forking a component
- **Palettes** via `data-mors-palette` (`default`, `farm`, `cyberpunk`, `retro`, `modern`) — each is a CSS file of the same custom properties
- **Light and dark** via `data-mors-theme="dark"` on any subtree
- **Mobile and desktop**: navbar disclosure, edge-to-edge modals, hide-on-mobile table columns

### Components

| Group | Components |
| --- | --- |
| Actions | `Button`, `IconButton`, `ButtonGroup`, `Link`, `Icon` |
| Forms | `TextField`, `Textarea`, `Select`, `SearchField`, `NumberField`, `FileField`, `Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `DatePicker` |
| Content | `Card`, `List`, `Divider`, `EmptyState`, `Badge`, `Swatch`, `SwatchGroup`, `Avatar`, `AvatarGroup` |
| Feedback | `Alert`, `Spinner`, `Skeleton`, `Progress`, `Toast` |
| Overlays | `Modal`, `Drawer`, `Popover`, `Menu`, `Tooltip` |
| Navigation | `Navbar`, `Tabs`, `Accordion`, `Breadcrumbs`, `Pagination` |
| Data | `Table`, `FilterBar`, `Chip`, `Calendar`, `EventCalendar` |

Live examples, prop tables, and the design system live in the demo (`npm run dev`).

## Install

```bash
npm install mors-component-library
```

Peer range: React 18.2+ or 19.

```tsx
import { Button, Card, CardHeader, CardBody } from 'mors-component-library';
import 'mors-component-library/styles.css';

export function Panel() {
  return (
    <Card>
      <CardHeader title="Storage" subtitle="42 GB of 100 GB used" />
      <CardBody>Upgrade any time — your files stay exactly where they are.</CardBody>
      <Button>Upgrade plan</Button>
    </Card>
  );
}
```

Import the stylesheet **once** at your app entry. Components do not inject CSS themselves, so bundlers never ship styles you did not ask for.

## Moving the CSS

The stylesheet is designed to travel:

| You want | You take |
| --- | --- |
| The whole library | `dist/mors-component-library.css` (or the `./styles.css` export) |
| Tokens only | `src/styles/tokens.css` — custom properties, no element styles |
| A palette | `src/styles/themes/*.css` — copy one to add another |
| A single component | Copy the component `.tsx` plus the matching block in `src/styles/` |

Every class is prefixed `mors-`. There is no global reset, so dropping the file into an existing app will not restyle your headings, buttons, or forms.

Override any token at `:root` or on a subtree:

```css
:root {
  --mors-color-accent: #6b46e5;
  --mors-radius-md: 6px;
}

.marketing-panel {
  --mors-color-accent: #0f9d58;
}
```

Dark appearance:

```html
<html data-mors-theme="dark">
```

Shipped palettes (Default Theme is the `:root` fallback; the rest are opt-in):

```html
<html data-mors-palette="farm">
<html data-mors-palette="cyberpunk" data-mors-theme="dark">
<html data-mors-palette="retro">
<html data-mors-palette="modern">
```

## Design language

Colours, type, space, and radii match the public apple.com language as closely as an independent library reasonably can:

- Text `#1d1d1f` / secondary `#6e6e73` / canvas `#f5f5f7`
- Accent `#0071e3` (hover `#0077ed`)
- Capsule buttons, 44px default controls, 48px translucent navbar
- System/SF stack — no webfont to download

See the **Design system** page in the demo for the full token list.

## Scripts

```bash
npm run dev          # demo site
npm run build        # library JS + CSS + types, plus the demo
npm run check        # lint, typecheck
```

## License

MIT. Apple, the Apple logo, and related marks are trademarks of Apple Inc.
