import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Switch,
  Table,
  type TableColumn,
} from '../../src';
import { CodeBlock, InlineCode, PageHeader, Section } from '../components/Doc';

const NEUTRALS = [0, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000];

const SEMANTIC_COLORS = [
  ['--mors-color-canvas', 'Page background'],
  ['--mors-color-surface', 'Cards, inputs, menus'],
  ['--mors-color-surface-sunken', 'Grouped or inset areas'],
  ['--mors-color-surface-hover', 'Hover feedback'],
  ['--mors-color-border', 'Standard hairlines'],
  ['--mors-color-border-strong', 'Control outlines'],
  ['--mors-color-text', 'Primary text'],
  ['--mors-color-text-secondary', 'Supporting text'],
  ['--mors-color-text-tertiary', 'Meta and placeholders'],
  ['--mors-color-accent', 'Primary actions, selection'],
  ['--mors-color-success', 'Positive status'],
  ['--mors-color-warning', 'Caution status'],
  ['--mors-color-danger', 'Errors, destructive actions'],
  ['--mors-color-info', 'Neutral information'],
] as const;

const TYPE_SCALE = [
  ['--mors-text-5xl', '64px', 'Hero display'],
  ['--mors-text-4xl', '52px', 'Display'],
  ['--mors-text-3xl', '40px', 'Page title'],
  ['--mors-text-2xl', '31px', 'Section title'],
  ['--mors-text-xl', '24px', 'Subsection'],
  ['--mors-text-lg', '20px', 'Dialog title'],
  ['--mors-text-md', '17px', 'Lede, large control'],
  ['--mors-text-base', '15px', 'Body, default control'],
  ['--mors-text-sm', '13px', 'Labels, help text'],
  ['--mors-text-xs', '12px', 'Badges, table headers'],
  ['--mors-text-2xs', '11px', 'Overlines'],
] as const;

const SPACING = [
  ['--mors-space-1', '2px'],
  ['--mors-space-2', '4px'],
  ['--mors-space-3', '8px'],
  ['--mors-space-4', '12px'],
  ['--mors-space-5', '16px'],
  ['--mors-space-6', '20px'],
  ['--mors-space-7', '24px'],
  ['--mors-space-8', '32px'],
  ['--mors-space-9', '40px'],
  ['--mors-space-10', '48px'],
  ['--mors-space-11', '64px'],
  ['--mors-space-12', '80px'],
] as const;

const RADII = [
  ['--mors-radius-xs', '4px'],
  ['--mors-radius-sm', '8px'],
  ['--mors-radius-md', '12px'],
  ['--mors-radius-lg', '16px'],
  ['--mors-radius-xl', '20px'],
  ['--mors-radius-2xl', '28px'],
  ['--mors-radius-pill', '999px'],
] as const;

const SHADOWS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const MOTION = [
  ['--mors-duration-instant', '80ms', 'Press feedback'],
  ['--mors-duration-fast', '140ms', 'Hover, small state changes'],
  ['--mors-duration-base', '220ms', 'Popovers, modals, toasts'],
  ['--mors-duration-slow', '320ms', 'Drawers, larger surfaces'],
  ['--mors-duration-slower', '480ms', 'Deliberate, rare transitions'],
] as const;

const EASINGS = [
  ['--mors-ease-standard', 'cubic-bezier(0.32, 0.72, 0, 1)', 'Default — decelerates hard at the end'],
  ['--mors-ease-out', 'cubic-bezier(0.22, 1, 0.36, 1)', 'Entrances'],
  ['--mors-ease-in', 'cubic-bezier(0.4, 0, 1, 1)', 'Exits'],
  ['--mors-ease-spring', 'cubic-bezier(0.34, 1.36, 0.64, 1)', 'Small overshoot on toggles'],
] as const;

interface BreakpointRow {
  token: string;
  value: string;
  behaviour: string;
}

const BREAKPOINTS: BreakpointRow[] = [
  { token: '--mors-breakpoint-sm', value: '480px', behaviour: 'Side drawers go full-width; modals dock to the bottom; form text is 16px to avoid iOS zoom.' },
  { token: '--mors-breakpoint-md', value: '768px', behaviour: 'Navbar links collapse; hideOnMobile table columns drop; filter bars stack.' },
  { token: '--mors-breakpoint-lg', value: '1024px', behaviour: 'Documentation sidebar appears; wide grids form.' },
  { token: '--mors-breakpoint-xl', value: '1280px', behaviour: 'Container max width (--mors-container-xl).' },
];

const BREAKPOINT_COLUMNS: TableColumn<BreakpointRow>[] = [
  { id: 'token', header: 'Token', cell: (row) => <code>{row.token}</code>, sortValue: (row) => row.token },
  { id: 'value', header: 'Value', cell: (row) => row.value },
  { id: 'behaviour', header: 'What changes', cell: (row) => row.behaviour },
];

const TOKEN_OVERRIDE = `/* Pick a shipped palette */
<html data-mors-palette="farm" data-mors-theme="dark">

/* Or rebrand by copying a theme file and changing values */
[data-mors-palette='default'] {
  --mors-color-accent: #6b46e5;
  --mors-radius-md: 6px;
  --mors-font-sans: 'Inter', system-ui, sans-serif;
}

/* …or only for one subtree, palette aside */
.marketing-panel {
  --mors-color-accent: #0f9d58;
  --mors-shadow-md: none;
}`;

const A11Y = [
  ['Focus visibility', 'Every interactive element shows a 3px accent ring on :focus-visible only, so pointer users never see a ring they did not ask for.'],
  ['Labels', 'Text controls render a real <label> tied by id. IconButton, Avatar status dots and pagination arrows require or generate accessible names.'],
  ['Descriptions and errors', 'Help text and error messages are linked with aria-describedby, and an error sets aria-invalid on the control.'],
  ['Keyboard support', 'Tabs, Menu, Accordion, Calendar, Table sorting, Pagination, Modal and Drawer are all operable from the keyboard, following the ARIA pattern for each.'],
  ['Focus management', 'Modal and Drawer trap focus while open and return it to the trigger on close. Menu returns focus to its trigger; Escape closes every overlay.'],
  ['Live regions', 'Alerts and toasts pick their politeness from tone: info and success announce as status, warning and danger as alert. Filter summaries are polite live regions.'],
  ['Reduced motion', 'A single prefers-reduced-motion block collapses transitions and animations; the useReducedMotion hook lets JS-driven motion opt out too.'],
  ['Colour and contrast', 'Body and label text meets WCAG AA against its surface in both appearances; status is never signalled by colour alone (dots, icons and text carry it too).'],
] as const;

export function DesignSystem() {
  const [animate, setAnimate] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Design system"
        title="The design language, token by token"
        description="Everything visual in the library resolves to a CSS custom property in the --mors- namespace. Palettes swap those properties; light and dark remap the semantic colours. No build step, no theme provider."
      />

      <Section
        id="foundations"
        title="Foundations"
        description="The library ships tokens.css (shared scales) plus one file per palette under src/styles/themes. Component sheets only consume custom properties."
      >
        <div className="demo-grid">
          <Card>
            <CardHeader title="Typeface" subtitle="A token, not a download" />
            <CardBody>
              <InlineCode>--mors-font-sans</InlineCode> and{' '}
              <InlineCode>--mors-font-display</InlineCode> are set per palette. Default Theme uses
              the system/SF stack; Farm Theme switches display type to a serif. Nothing to
              download, nothing to lay out twice.
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Letter spacing" subtitle="Tightens as type grows" />
            <CardBody>
              Display sizes use <InlineCode>--mors-tracking-tighter</InlineCode> and body copy sits
              at <InlineCode>--mors-tracking-tight</InlineCode>. Farm Theme opens both so headlines
              read as bookish rather than product-UI.
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Palettes and appearance" subtitle="Two attributes" />
            <CardBody>
              Set <InlineCode>data-mors-palette</InlineCode> to switch the token file (
              <InlineCode>default</InlineCode> or <InlineCode>farm</InlineCode>). Independently,{' '}
              <InlineCode>data-mors-theme=&quot;dark&quot;</InlineCode> remaps semantic colour. The
              header controls on this page write both onto <InlineCode>&lt;html&gt;</InlineCode>.
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section
        id="palettes"
        title="Palettes"
        description="Each palette is a CSS file that assigns the same --mors-* properties. Components never change; only the variables do. The header menu on this demo writes data-mors-palette onto html."
      >
        <CodeBlock
          code={`/* src/styles/themes/default.css — current look, also applied to :root */
:root,
[data-mors-palette='default'] {
  --mors-font-sans: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
  --mors-color-accent: #0071e3;
  --mors-radius-pill: 999px;
}

/* src/styles/themes/farm.css — opt in with one attribute */
[data-mors-palette='farm'] {
  --mors-font-display: Georgia, Palatino, serif;
  --mors-color-accent: #d47a3c;
  --mors-radius-pill: 8px;
}`}
          label="Palette files"
        />
      </Section>

      <Section id="typography" title="Typography" description="Eleven steps. The sizes below are Default Theme; Farm Theme redefines the same tokens in farm.css.">
        {TYPE_SCALE.map(([token, size, use]) => (
          <div className="demo-type-row" key={token}>
            <span className="demo-type-meta">
              {token} · {size} · {use}
            </span>
            <span
              style={{
                fontFamily: 'var(--mors-font-display)',
                fontSize: `var(${token})`,
                fontWeight: 'var(--mors-weight-semibold)',
                letterSpacing:
                  Number.parseFloat(size) >= 24
                    ? 'var(--mors-tracking-tighter)'
                    : 'var(--mors-tracking-tight)',
                lineHeight: 'var(--mors-leading-tight)',
              }}
            >
              The quick brown fox
            </span>
          </div>
        ))}
        <p className="demo-example-note" style={{ marginTop: 'var(--mors-space-5)' }}>
          Weights: 400 regular · 500 medium (labels, buttons) · 600 semibold (titles) · 700 bold
          (rare). Line heights: 1.08 tight, 1.25 snug, 1.45 normal, 1.6 relaxed.
        </p>
      </Section>

      <Section
        id="colour"
        title="Colour"
        description="A fourteen-step neutral ramp plus six semantic hues. Components only ever reference the semantic tokens, which is why palettes and dark mode are token swaps rather than rewrites."
      >
        <div className="demo-stack">
          <div>
            <span className="demo-figure-label">Neutral ramp (0 → 1000)</span>
            <div className="demo-ramp">
              {NEUTRALS.map((step) => (
                <div
                  key={step}
                  className="demo-ramp-step"
                  style={{ background: `var(--mors-neutral-${step})` }}
                  title={`--mors-neutral-${step}`}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="demo-figure-label">Semantic tokens</span>
            <div className="demo-swatches">
              {SEMANTIC_COLORS.map(([token, use]) => (
                <div className="demo-swatch" key={token}>
                  <div className="demo-swatch-chip" style={{ background: `var(${token})` }} />
                  <span className="demo-swatch-name">{token.replace('--mors-color-', '')}</span>
                  <span className="demo-swatch-value">{use}</span>
                </div>
              ))}
            </div>
          </div>

          <Alert tone="info" title="Status is never colour alone">
            Every status treatment pairs colour with a dot, an icon or a word, so the meaning
            survives greyscale and colour-vision differences.
          </Alert>
        </div>
      </Section>

      <Section
        id="spacing"
        title="Spacing"
        description="A 4px rhythm with a 2px half-step for optical adjustments. Component padding, gaps and page rhythm all come from this one scale."
      >
        {SPACING.map(([token, value]) => (
          <div className="demo-scale-row" key={token}>
            <span className="demo-scale-label">
              {token.replace('--mors-space-', 'space-')} · {value}
            </span>
            <span className="demo-scale-bar" style={{ width: `var(${token})` }} />
          </div>
        ))}
      </Section>

      <Section
        id="radii"
        title="Radii"
        description="Rounded but not soft in Default Theme (8–12px controls, 16–20px cards). Farm Theme tightens the same tokens so corners sit closer to square, without going sharp."
      >
        <div className="demo-swatches">
          {RADII.map(([token, value]) => (
            <div className="demo-swatch" key={token}>
              <div className="demo-radius-box" style={{ borderRadius: `var(${token})` }}>
                {value}
              </div>
              <span className="demo-swatch-name">{token.replace('--mors-radius-', 'radius-')}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="elevation"
        title="Elevation"
        description="Five shadows, each a soft ambient layer plus a tight contact layer. Dark mode deepens them instead of lightening surfaces."
      >
        <div className="demo-swatches">
          {SHADOWS.map((step) => (
            <div className="demo-swatch" key={step}>
              <div className="demo-shadow-box" style={{ boxShadow: `var(--mors-shadow-${step})` }}>
                shadow-{step}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="motion"
        title="Motion"
        description="Motion confirms a change; it never performs. Nothing runs longer than 320ms except deliberate exceptions, and everything collapses under prefers-reduced-motion."
      >
        <div className="demo-stack">
          <Switch
            label="Play the durations"
            description="Toggle to move each dot across its track."
            checked={animate}
            onChange={(event) => setAnimate(event.currentTarget.checked)}
          />
          {MOTION.map(([token, value, use]) => (
            <div className="demo-row" key={token}>
              <span className="demo-scale-label">
                {token.replace('--mors-duration-', '')} · {value}
              </span>
              <span className="demo-motion-track">
                <span
                  className={animate ? 'demo-motion-dot is-playing' : 'demo-motion-dot'}
                  style={{ transitionDuration: `var(${token})` }}
                />
              </span>
              <span className="demo-example-note">{use}</span>
            </div>
          ))}

          <div>
            <span className="demo-figure-label">Easings</span>
            <div className="demo-table-scroll">
              <table className="demo-props">
                <caption className="mors-visually-hidden">Easing tokens</caption>
                <thead>
                  <tr>
                    <th scope="col">Token</th>
                    <th scope="col">Curve</th>
                    <th scope="col">Used for</th>
                  </tr>
                </thead>
                <tbody>
                  {EASINGS.map(([token, curve, use]) => (
                    <tr key={token}>
                      <td className="demo-props-name" data-label="Token">
                        <code>{token}</code>
                      </td>
                      <td className="demo-props-type" data-label="Curve">
                        <code>{curve}</code>
                      </td>
                      <td className="demo-props-description" data-label="Used for">
                        {use}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="breakpoints"
        title="Breakpoints"
        description="Four documented widths. Custom properties cannot be used inside media queries, so the component sheets inline the same values — these tokens exist so your app can reason about the same numbers."
      >
        <Table
          columns={BREAKPOINT_COLUMNS}
          rows={BREAKPOINTS}
          rowKey={(row) => row.token}
          caption="Breakpoint tokens and the layout changes at each width"
          size="sm"
        />
      </Section>

      <Section
        id="overriding"
        title="Overriding tokens"
        description="Because every value is a custom property, a new palette is a CSS file — no wrapper components, no theme object, no rebuild. Default Theme is src/styles/themes/default.css; Farm Theme is farm.css."
      >
        <CodeBlock code={TOKEN_OVERRIDE} label="Token override example" />
        <div className="demo-row" style={{ marginTop: 'var(--mors-space-6)' }}>
          <div
            className="demo-row"
            style={{
              ['--mors-color-accent' as string]: '#6b46e5',
              ['--mors-radius-md' as string]: '6px',
              ['--mors-radius-pill' as string]: '8px',
            }}
          >
            <Button>Overridden</Button>
            <Badge tone="accent">Accent follows</Badge>
          </div>
          <div className="demo-row">
            <Button>Default</Button>
            <Badge tone="accent">Accent</Badge>
          </div>
        </div>
      </Section>

      <Section
        id="accessibility"
        title="Accessibility"
        description="What the library guarantees, and what it expects from you."
      >
        <div className="demo-grid">
          {A11Y.map(([title, body]) => (
            <Card key={title} elevation="flat">
              <CardHeader title={title} />
              <CardBody>{body}</CardBody>
            </Card>
          ))}
        </div>
        <Alert tone="warning" title="Your side of the contract" style={{ marginTop: 'var(--mors-space-6)' }}>
          Provide a <InlineCode>label</InlineCode> for every input, an{' '}
          <InlineCode>ariaLabel</InlineCode> for dialogs without a visible title, a{' '}
          <InlineCode>caption</InlineCode> for every table, and meaningful{' '}
          <InlineCode>alt</InlineCode>/name text for avatars. The library cannot invent those for
          you.
        </Alert>
      </Section>
    </>
  );
}
