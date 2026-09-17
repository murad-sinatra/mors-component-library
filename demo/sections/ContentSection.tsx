import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardMedia,
  Divider,
  EmptyState,
  Icon,
  IconButton,
  Kbd,
  List,
  ListItem,
  Tree,
  TreeItem,
} from '../../src';
import { ComponentDoc, Example, Section, type PropRow } from '../components/Doc';

const CARD_API: readonly PropRow[] = [
  ['elevation', "'flat' | 'raised' | 'floating'", "'raised'", 'Sunken tint, hairline + soft shadow, or a lifted panel.'],
  ['padding', "'none' | 'sm' | 'md' | 'lg'", "'md'", 'Inner spacing; use none with CardMedia.'],
  ['hover', 'boolean', 'false', 'Optional lift and stronger shadow on pointer hover. Implied by interactive.'],
  ['interactive', 'boolean', 'false', 'Clickable treatment: hover lift, press feedback, and a pointer cursor.'],
];

export function ContentSection() {
  return (
    <Section
      id="content"
      title="Content surfaces"
      description="Cards, dividers and empty states — the containers everything else sits inside."
    >
      <ComponentDoc
        id="card"
        name="Card · CardHeader · CardBody · CardFooter · CardMedia"
        purpose="A rounded surface for grouped content. The subcomponents are optional and unopinionated: use the header for title/subtitle/actions, the body for prose, the footer for actions pinned to the bottom, and CardMedia for an edge-to-edge image area."
        usage={`<Card elevation="raised" padding="md">
  <CardHeader
    title="Storage"
    subtitle="42 GB of 100 GB used"
    actions={<IconButton label="Options" icon={<Icon name="more" />} />}
  />
  <CardBody>Upgrade any time — your files stay where they are.</CardBody>
  <CardFooter>
    <Button size="sm">Upgrade</Button>
  </CardFooter>
</Card>`}
        api={CARD_API}
      >
        <Example title="Elevations" layout="grid">
          <Card elevation="flat">
            <CardHeader title="Flat" subtitle="Sunken tint, no shadow" />
            <CardBody>For grouping inside an already elevated surface.</CardBody>
          </Card>
          <Card elevation="raised">
            <CardHeader title="Raised" subtitle="The default" />
            <CardBody>A hairline border plus a soft shadow.</CardBody>
          </Card>
          <Card elevation="floating">
            <CardHeader title="Floating" subtitle="Lifted panel" />
            <CardBody>For content that sits above the page.</CardBody>
          </Card>
        </Example>

        <Example title="Composition" layout="grid">
          <Card padding="none">
            <CardMedia ratio="16 / 9">
              <Icon name="star" size={32} />
            </CardMedia>
            <div style={{ padding: 'var(--mors-space-6)' }}>
              <CardHeader title="With media" subtitle="padding=none + CardMedia" />
              <CardBody>CardMedia bleeds to the edges of the card.</CardBody>
            </div>
          </Card>
          <Card hover>
            <CardHeader title="Hover" subtitle="Optional lift, not a click target" />
            <CardBody>Use when a card should respond to the pointer without implying it is a button.</CardBody>
          </Card>
          <Card interactive onClick={() => undefined}>
            <CardHeader
              title="Interactive"
              subtitle="Hover and press me"
              actions={<Badge tone="accent">New</Badge>}
            />
            <CardBody>Adds lift on hover; wire your own onClick and role.</CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost" endIcon={<Icon name="arrow-right" />}>
                Open
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader
              title="With actions"
              subtitle="Header trailing slot"
              actions={<IconButton label="Card options" icon={<Icon name="more" />} size="sm" />}
            />
            <CardBody>Footers push to the bottom, so cards in a grid line up.</CardBody>
            <CardFooter>
              <Button size="sm">Confirm</Button>
              <Button size="sm" variant="ghost">
                Dismiss
              </Button>
            </CardFooter>
          </Card>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="divider"
        name="Divider"
        purpose="A separator between content groups. Renders a real <hr> for the plain case, and a labelled variant for the classic “or” break between two paths."
        usage={`<Divider spacing="md" />
<Divider label="or" />
<Divider orientation="vertical" spacing="sm" />`}
        api={[
          ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Vertical stretches to the flex parent.'],
          ['label', 'ReactNode', '—', 'Centred label; horizontal only.'],
          ['spacing', "'none' | 'sm' | 'md' | 'lg'", "'md'", 'Margin around the rule.'],
        ]}
      >
        <Example title="Variants" layout="stack">
          <div>
            <p>Above the rule</p>
            <Divider />
            <p>Below the rule</p>
          </div>
          <Divider label="or" />
          <div className="demo-row" style={{ minHeight: 40 }}>
            <span>Left</span>
            <Divider orientation="vertical" spacing="sm" />
            <span>Middle</span>
            <Divider orientation="vertical" spacing="sm" />
            <span>Right</span>
          </div>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="empty-state"
        name="EmptyState"
        purpose="What to show when there is nothing to show. Pairs a short explanation with the action that resolves it, so an empty screen still tells the user what to do next."
        usage={`<EmptyState
  title="No invoices yet"
  description="Invoices appear here once your first payment clears."
  actions={<Button size="sm">Create invoice</Button>}
/>`}
        api={[
          ['title', 'ReactNode', '—', 'Required. Short and factual.'],
          ['description', 'ReactNode', '—', 'One or two sentences of context.'],
          ['icon', 'ReactNode | null', 'inbox glyph', 'Pass null for a text-only state.'],
          ['actions', 'ReactNode', '—', 'Primary and secondary calls to action.'],
          ['size', "'sm' | 'md'", "'md'", 'Compact form for inline panels.'],
        ]}
      >
        <Example title="Default and compact" layout="grid">
          <EmptyState
            title="No invoices yet"
            description="Invoices appear here once your first payment clears."
            actions={
              <>
                <Button size="sm" startIcon={<Icon name="plus" />}>
                  Create invoice
                </Button>
                <Button size="sm" variant="ghost">
                  Import
                </Button>
              </>
            }
          />
          <EmptyState
            size="sm"
            icon={<Icon name="search" />}
            title="No results for “retainer”"
            description="Check the spelling or clear a filter."
            actions={
              <Button size="sm" variant="secondary">
                Clear filters
              </Button>
            }
          />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="list"
        name="List · ListItem"
        purpose="Grouped rows in the style of Apple settings: a title, optional subtitle, leading and trailing slots, and a chevron when the row navigates."
        usage={`<List inset>
  <ListItem title="Wi-Fi" subtitle="Home" trailing={<Badge size="sm">On</Badge>} href="#wifi" />
  <ListItem title="Bluetooth" trailing={<Switch />} />
</List>`}
        api={[
          ['inset', 'boolean', 'false', 'Sunken grouped background, like iOS Settings.'],
          ['title', 'ReactNode', '—', 'Required row label.'],
          ['subtitle', 'ReactNode', '—', 'Secondary line under the title.'],
          ['leading / trailing', 'ReactNode', '—', 'Icon, avatar, switch, or value.'],
          ['href / onClick', 'string / handler', '—', 'Makes the row interactive; chevron follows.'],
          ['chevron', 'boolean', 'auto', 'Override the trailing chevron.'],
        ]}
      >
        <Example title="Grouped rows" layout="grid">
          <List>
            <ListItem
              title="Wi-Fi"
              subtitle="Home"
              leading={<Icon name="star" />}
              trailing={<Badge size="sm" tone="success">On</Badge>}
              href="#/components"
            />
            <ListItem
              title="Notifications"
              subtitle="Banners, sounds, badges"
              href="#/components"
            />
            <ListItem title="Storage" trailing={<span className="demo-example-note">42 GB</span>} />
          </List>
          <List inset>
            <ListItem title="Name" trailing={<span className="demo-example-note">Ada Lovelace</span>} />
            <ListItem title="Plan" trailing={<Badge size="sm" tone="accent">Pro</Badge>} href="#/overview" />
          </List>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="tree"
        name="Tree · TreeItem"
        tags={['keyboard']}
        purpose="Nested files, settings and outlines. Arrow keys walk visible rows, Right expands, Left collapses, Enter selects."
        usage={`<Tree label="Project" defaultExpanded={['src']} defaultSelected="index">
  <TreeItem id="src" label="src" icon={<Icon name="folder" />}>
    <TreeItem id="index" label="index.ts" />
  </TreeItem>
</Tree>`}
        api={[
          ['selected / onSelect', 'string / (id) => void', '—', 'The selected row id.'],
          ['expanded / defaultExpanded', 'readonly string[]', '[]', 'Open branch ids.'],
          ['TreeItem id / label / icon', 'string / ReactNode / ReactNode', '—', 'Row identity and chrome.'],
        ]}
      >
        <Example title="Files" layout="stack">
          <Tree label="Project files" defaultExpanded={['src', 'components']} defaultSelected="button">
            <TreeItem id="src" label="src" icon={<Icon name="folder" />}>
              <TreeItem id="components" label="components" icon={<Icon name="folder" />}>
                <TreeItem id="button" label="Button.tsx" />
                <TreeItem id="modal" label="Modal.tsx" />
              </TreeItem>
              <TreeItem id="index" label="index.ts" />
            </TreeItem>
            <TreeItem id="package" label="package.json" />
          </Tree>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="kbd"
        name="Kbd"
        purpose="A keyboard key, or a combo when keys is provided. Use it in CommandPalette shortcuts, tooltips and helper copy."
        usage={`<Kbd>⌘</Kbd>
<Kbd keys={['⌘', 'K']} />`}
        api={[
          ['keys', 'readonly ReactNode[]', '—', 'Renders a combo; otherwise children is a single key.'],
        ]}
      >
        <Example title="Keys">
          <Kbd>⌘</Kbd>
          <Kbd keys={['⌘', 'K']} />
          <Kbd keys={['Shift', 'Enter']} />
        </Example>
      </ComponentDoc>
    </Section>
  );
}
