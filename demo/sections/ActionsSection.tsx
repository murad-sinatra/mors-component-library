import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Link,
} from '../../src';
import { ComponentDoc, Example, Labelled, Section, type PropRow } from '../components/Doc';

const BUTTON_API: readonly PropRow[] = [
  ['variant', "'primary' | 'secondary' | 'subtle' | 'ghost' | 'destructive' | 'link'", "'primary'", 'Visual weight. One primary action per view.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Maps to the 32 / 44 / 48px control heights.'],
  ['pill', 'boolean', 'true', 'Fully rounded capsule shape, matching apple.com buttons.'],
  ['block', 'boolean', 'false', 'Stretches to the container width.'],
  ['loading', 'boolean', 'false', 'Swaps in a spinner, sets aria-busy and blocks activation.'],
  ['startIcon / endIcon', 'ReactNode', '—', 'Decorative icons around the label.'],
  ['…rest', 'ButtonHTMLAttributes', '—', 'Everything else lands on the native <button>.'],
];

const BADGE_API: readonly PropRow[] = [
  ['tone', "'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'", "'neutral'", 'Semantic colour.'],
  ['variant', "'soft' | 'solid' | 'outline'", "'soft'", 'Fill treatment.'],
  ['size', "'sm' | 'md'", "'md'", 'Compact form for use inside table cells.'],
  ['dot', 'boolean', 'false', 'Leading status dot.'],
];

const AVATAR_API: readonly PropRow[] = [
  ['name', 'string', '—', 'Required. Used as alt text and to derive initials.'],
  ['src', 'string', '—', 'Image URL; falls back to initials if it fails to load.'],
  ['size', "'xs' | 'sm' | 'md' | 'lg' | 'xl'", "'md'", '24 / 32 / 40 / 56 / 80px.'],
  ['shape', "'circle' | 'rounded'", "'circle'", 'Rounded squares suit product or org avatars.'],
  ['status', "'online' | 'busy' | 'offline'", '—', 'Adds a labelled presence dot.'],
];

export function ActionsSection() {
  const [alignment, setAlignment] = useState('left');
  const [loading, setLoading] = useState(false);

  const runLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1400);
  };

  return (
    <Section
      id="actions"
      title="Actions"
      description="Buttons carry the visual weight of the library: one accent-filled primary action, quieter secondary and ghost styles around it."
    >
      <ComponentDoc
        id="button"
        name="Button"
        tags={['native button']}
        purpose="The primary interaction primitive. Six variants cover the full hierarchy from a single filled call to action down to an inline text link, and the loading state keeps layout stable while work is in flight."
        usage={`<Button variant="primary" size="lg" pill endIcon={<Icon name="arrow-right" />}>
  Get started
</Button>`}
        api={BUTTON_API}
      >
        <Example title="Variants" layout="stack">
          <Labelled label="All six">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="subtle">Subtle</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Delete</Button>
            <Button variant="link">Learn more</Button>
          </Labelled>
          <Labelled label="Disabled">
            <Button disabled>Primary</Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
            <Button variant="ghost" disabled>
              Ghost
            </Button>
          </Labelled>
        </Example>

        <Example title="Sizes and shapes" layout="stack">
          <Labelled label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Labelled>
          <Labelled label="Pill + icons">
            <Button startIcon={<Icon name="plus" />}>
              New project
            </Button>
            <Button variant="secondary" endIcon={<Icon name="external" />}>
              Open docs
            </Button>
            <Button pill={false} variant="subtle">
              Squared
            </Button>
          </Labelled>
        </Example>

        <Example title="Loading" note="Press to see the spinner swap in for 1.4s">
          <Button loading={loading} onClick={runLoading}>
            Save changes
          </Button>
          <Button variant="secondary" loading>
            Always loading
          </Button>
          <Button variant="primary" block loading={loading} onClick={runLoading}>
            Full-width
          </Button>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="link"
        name="Link"
        purpose="Inline text navigation using Apple blue. External links open in a new tab and pick up a trailing arrow automatically."
        usage={`<Link href="https://www.apple.com" external>
  Learn more
</Link>`}
        api={[
          ['href', 'string', '—', 'Destination.'],
          ['external', 'boolean', 'false', 'Opens in a new tab with rel="noopener noreferrer" and an icon.'],
          ['endIcon', 'ReactNode', '—', 'Override the trailing icon.'],
        ]}
      >
        <Example title="Inline and external">
          <p>
            Last chance to shop with education savings.{' '}
            <Link href="#/components">Shop</Link>
          </p>
          <Link href="https://www.apple.com" external>
            Learn more
          </Link>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="icon-button"
        name="IconButton"
        purpose="A square, icon-only button. The label prop is required and becomes the accessible name, so an icon-only control is never unlabelled."
        usage={`<IconButton
  label="Delete file"
  icon={<Icon name="trash" />}
  variant="ghost"
/>`}
        api={[
          ['label', 'string', '—', 'Required accessible name (aria-label).'],
          ['icon', 'ReactNode', '—', 'The glyph to render.'],
          ['variant / size', 'see Button', "'ghost' / 'md'", 'Shares the Button scale.'],
          ['pill', 'boolean', 'true', 'Circular by default.'],
        ]}
      >
        <Example title="Variants and sizes">
          <IconButton label="Search" icon={<Icon name="search" />} />
          <IconButton label="Notifications" icon={<Icon name="bell" />} variant="secondary" />
          <IconButton label="More actions" icon={<Icon name="more" />} variant="subtle" />
          <IconButton label="Delete" icon={<Icon name="trash" />} variant="destructive" />
          <IconButton label="Small" icon={<Icon name="plus" />} size="sm" variant="secondary" />
          <IconButton label="Large" icon={<Icon name="plus" />} size="lg" variant="secondary" />
          <IconButton label="Square" icon={<Icon name="sliders" />} variant="secondary" pill={false} />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="button-group"
        name="ButtonGroup"
        purpose="Groups related buttons — welded together as a segmented control, or spaced for a form action row. Use aria-pressed on children to express which option is active."
        usage={`<ButtonGroup label="Text alignment">
  <Button
    variant="secondary"
    aria-pressed={value === 'left'}
    onClick={() => setValue('left')}
  >
    Left
  </Button>
  {/* … */}
</ButtonGroup>`}
        api={[
          ['variant', "'attached' | 'spaced'", "'attached'", 'Segmented control vs. a spaced row.'],
          ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Stacking direction.'],
          ['label', 'string', '—', 'Names the group for assistive tech.'],
        ]}
      >
        <Example title="Attached (segmented)" layout="stack">
          <ButtonGroup label="Text alignment">
            {['left', 'center', 'right'].map((option) => (
              <Button
                key={option}
                variant="secondary"
                aria-pressed={alignment === option}
                onClick={() => setAlignment(option)}
              >
                {option[0]!.toUpperCase() + option.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
          <span className="demo-example-note">Selected: {alignment}</span>
        </Example>

        <Example title="Spaced">
          <ButtonGroup variant="spaced" label="Form actions">
            <Button variant="ghost">Cancel</Button>
            <Button>Publish</Button>
          </ButtonGroup>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="badge"
        name="Badge"
        purpose="A small, non-interactive status or metadata label. Soft fills are the default so badges stay quiet inside dense layouts; solid fills are for the rare case that needs to shout."
        usage={`<Badge tone="success" variant="soft" dot>
  Active
</Badge>`}
        api={BADGE_API}
      >
        <Example title="Tones and variants" layout="stack">
          <Labelled label="Soft">
            <Badge>Neutral</Badge>
            <Badge tone="accent">Accent</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Badge tone="info">Info</Badge>
          </Labelled>
          <Labelled label="Solid">
            <Badge variant="solid">Neutral</Badge>
            <Badge variant="solid" tone="accent">
              Accent
            </Badge>
            <Badge variant="solid" tone="success">
              Success
            </Badge>
            <Badge variant="solid" tone="danger">
              Danger
            </Badge>
          </Labelled>
          <Labelled label="Outline · dots · icons · small">
            <Badge variant="outline" tone="accent">
              Outline
            </Badge>
            <Badge tone="success" dot>
              Operational
            </Badge>
            <Badge tone="info" startIcon={<Icon name="star" />}>
              Featured
            </Badge>
            <Badge size="sm">sm</Badge>
          </Labelled>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="avatar"
        name="Avatar · AvatarGroup"
        purpose="Represents a person or entity. Falls back from image to initials automatically, and AvatarGroup collapses overflow into a +n chip."
        usage={`<Avatar name="Ada Lovelace" src={user.photo} status="online" />

<AvatarGroup
  max={3}
  people={[{ name: 'Ada Lovelace' }, { name: 'Grace Hopper' }]}
/>`}
        api={AVATAR_API}
      >
        <Example title="Sizes" layout="stack">
          <Labelled label="xs → xl">
            <Avatar name="Ada Lovelace" size="xs" />
            <Avatar name="Grace Hopper" size="sm" />
            <Avatar name="Alan Turing" size="md" />
            <Avatar name="Katherine Johnson" size="lg" />
            <Avatar name="Radia Perlman" size="xl" />
          </Labelled>
          <Labelled label="Shape and status">
            <Avatar name="Rounded Square" shape="rounded" />
            <Avatar name="Ada Lovelace" status="online" />
            <Avatar name="Grace Hopper" status="busy" />
            <Avatar name="Alan Turing" status="offline" />
          </Labelled>
          <Labelled label="Group with overflow">
            <AvatarGroup
              max={3}
              people={[
                { name: 'Ada Lovelace' },
                { name: 'Grace Hopper' },
                { name: 'Alan Turing' },
                { name: 'Katherine Johnson' },
                { name: 'Radia Perlman' },
              ]}
            />
          </Labelled>
        </Example>
      </ComponentDoc>
    </Section>
  );
}
