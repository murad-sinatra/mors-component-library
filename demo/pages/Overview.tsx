import { useState } from 'react';
import {
  Alert,
  AvatarGroup,
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Icon,
  Progress,
  SearchField,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  useToast,
} from '../../src';
import { CodeBlock, InlineCode, Section } from '../components/Doc';

const INSTALL = `npm install mors-component-library`;

const USAGE = `import { Button, Card, CardHeader, CardBody } from 'mors-component-library';
import 'mors-component-library/styles.css';

export function Panel() {
  return (
    <Card>
      <CardHeader title="Storage" subtitle="42 GB of 100 GB used" />
      <CardBody>Upgrade any time — your files stay exactly where they are.</CardBody>
      <Button variant="primary">Upgrade plan</Button>
    </Card>
  );
}`;

const THEME = `<!-- Palette (token file) and appearance are independent -->
<html data-mors-palette="farm" data-mors-theme="dark">

<!-- Or override tokens for one subtree -->
<div style="--mors-color-accent: #8b5cf6; --mors-radius-md: 6px">
  <Button>Purple, squarer button</Button>
</div>`;

const PRINCIPLES = [
  {
    icon: 'sliders',
    title: 'Tokens, not overrides',
    body: 'Every colour, space, radius, shadow and duration is a CSS custom property under the --mors- namespace. Rebrand without forking a component.',
  },
  {
    icon: 'star',
    title: 'Restrained by default',
    body: 'Neutral surfaces, one accent colour, generous spacing, tight display type and motion that stays under 320ms.',
  },
  {
    icon: 'check-circle',
    title: 'Accessible mechanics',
    body: 'Focus-visible rings, labelled controls, aria relationships, keyboard support in every composite widget, and reduced-motion support.',
  },
  {
    icon: 'arrow-right',
    title: 'Portable CSS',
    body: 'One prefixed stylesheet, no CSS-in-JS, no global reset. Drop it into an existing app and nothing else changes.',
  },
] as const;

export function Overview({ onNavigate }: { onNavigate: (route: 'components' | 'design-system') => void }) {
  const { toast } = useToast();
  const [notify, setNotify] = useState(true);
  const [filter, setFilter] = useState('all');

  return (
    <>
      <section className="demo-hero" aria-labelledby="hero-title">
        <Badge tone="accent" variant="soft" dot>
          React 19 · TypeScript · zero runtime dependencies
        </Badge>
        <h1 className="demo-hero-title" id="hero-title">
          A calm, Apple‑inspired component library for React.
        </h1>
        <p className="demo-hero-lede">
          Fifty-plus typed components, one token stylesheet, and a design language built on
          restrained typography, Apple blue, capsule buttons, and motion you feel more than you see.
        </p>
        <div className="demo-hero-actions">
          <Button size="lg" pill onClick={() => onNavigate('components')} endIcon={<Icon name="arrow-right" />}>
            Browse components
          </Button>
          <Button size="lg" pill variant="secondary" onClick={() => onNavigate('design-system')}>
            Design system
          </Button>
        </div>
      </section>

      <Section
        id="quick-start"
        title="Quick start"
        description="Install the package, import the stylesheet once, and import components from the root entry point."
      >
        <div className="demo-stack">
          <CodeBlock code={INSTALL} label="Install command" />
          <CodeBlock code={USAGE} label="Basic usage" />
          <Alert tone="info" title="One stylesheet, imported once">
            The stylesheet is shipped separately from the JavaScript so bundlers never inject styles
            you did not ask for. Import <InlineCode>mors-component-library/styles.css</InlineCode> at
            your app entry, or import <InlineCode>tokens.css</InlineCode> alone if you only want the
            design language.
          </Alert>
        </div>
      </Section>

      <Section
        id="principles"
        title="What it is built on"
        description="Four decisions shape every component in the library."
      >
        <div className="demo-grid">
          {PRINCIPLES.map((principle) => (
            <Card key={principle.title} elevation="raised">
              <CardHeader
                title={
                  <span className="demo-row">
                    <Icon name={principle.icon} /> {principle.title}
                  </span>
                }
              />
              <CardBody>{principle.body}</CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        id="in-context"
        title="In context"
        description="A few components composed the way you would actually use them — everything here is interactive."
      >
        <div className="demo-grid">
          <Card>
            <CardHeader
              title="Team workspace"
              subtitle="4 members · Pro plan"
              actions={
                <Badge tone="success" variant="soft" dot>
                  Active
                </Badge>
              }
            />
            <CardBody>
              <div className="demo-stack">
                <AvatarGroup
                  size="sm"
                  people={[
                    { name: 'Ada Lovelace' },
                    { name: 'Grace Hopper' },
                    { name: 'Alan Turing' },
                    { name: 'Katherine Johnson' },
                    { name: 'Radia Perlman' },
                  ]}
                />
                <Progress value={42} max={100} label="Storage used" showValue />
              </div>
            </CardBody>
            <CardFooter>
              <Button
                size="sm"
                onClick={() =>
                  toast({
                    title: 'Invitation sent',
                    description: 'They will get an email in a moment.',
                    tone: 'success',
                    action: { label: 'Undo', onClick: () => toast({ title: 'Invitation revoked' }) },
                  })
                }
              >
                Invite member
              </Button>
              <Button size="sm" variant="ghost">
                Manage
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader title="Preferences" subtitle="Controlled inputs, native semantics" />
            <CardBody>
              <div className="demo-stack">
                <SearchField label="Search settings" placeholder="Try “notifications”" size="sm" />
                <Switch
                  label="Weekly digest"
                  description="A short summary every Monday morning."
                  checked={notify}
                  onChange={(event) => setNotify(event.currentTarget.checked)}
                  labelPosition="start"
                />
                <Divider spacing="none" />
                <div className="demo-row">
                  {['all', 'mentions', 'none'].map((option) => (
                    <Chip
                      key={option}
                      size="sm"
                      selected={filter === option}
                      onClick={() => setFilter(option)}
                    >
                      {option === 'all' ? 'All activity' : option === 'mentions' ? 'Mentions' : 'Nothing'}
                    </Chip>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Release notes" subtitle="Tabs, badges and body copy" />
            <CardBody>
              <Tabs defaultValue="latest" variant="segmented" size="sm">
                <TabList label="Release notes">
                  <Tab value="latest">Latest</Tab>
                  <Tab value="beta">Beta</Tab>
                </TabList>
                <TabPanel value="latest">
                  Focus rings are now consistent across every control, and overlays share one
                  dismissal model.
                </TabPanel>
                <TabPanel value="beta">
                  A range slider with formatted values, plus a keyboard-navigable calendar grid.
                </TabPanel>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section
        id="theming"
        title="Theming"
        description="A palette is a CSS file of custom properties. Dark appearance is a second attribute on top of that."
      >
        <CodeBlock code={THEME} label="Theming example" />
      </Section>
    </>
  );
}
