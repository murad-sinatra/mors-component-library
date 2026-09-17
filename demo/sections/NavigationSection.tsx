import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Badge,
  Breadcrumbs,
  Button,
  Icon,
  IconButton,
  Kbd,
  Navbar,
  NavbarLink,
  Pagination,
  Step,
  Steps,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from '../../src';
import { ComponentDoc, Example, Section, type PropRow } from '../components/Doc';

const TABS_API: readonly PropRow[] = [
  ['defaultValue', 'string', '—', 'Required for uncontrolled use.'],
  ['value / onValueChange', 'string / (value) => void', '—', 'Controlled mode.'],
  ['variant', "'underline' | 'segmented'", "'underline'", 'Page-level tabs vs. a compact switch.'],
  ['size', "'sm' | 'md'", "'md'", 'Tab label size.'],
  ['TabList label', 'string', '—', 'Names the tab set for assistive tech.'],
  ['Tab value / badge / disabled', 'string / ReactNode / boolean', '—', 'Per-tab options.'],
  ['TabPanel keepMounted', 'boolean', 'false', 'Keep hidden panels mounted to preserve their state.'],
];

export function NavigationSection() {
  const [page, setPage] = useState(3);

  return (
    <Section
      id="navigation"
      title="Navigation"
      description="Moving between views and disclosing content, with the keyboard behaviour each pattern is expected to have."
    >
      <ComponentDoc
        id="tabs"
        name="Tabs · TabList · Tab · TabPanel"
        tags={['roving focus']}
        purpose="Switches between sibling views. Activation is automatic: arrow keys move focus and select in one step, which is the right behaviour when panels are cheap to render. Home and End jump to the ends, and disabled tabs are skipped."
        usage={`<Tabs defaultValue="overview">
  <TabList label="Project sections">
    <Tab value="overview">Overview</Tab>
    <Tab value="activity" badge={<Badge size="sm">12</Badge>}>Activity</Tab>
  </TabList>
  <TabPanel value="overview">…</TabPanel>
  <TabPanel value="activity">…</TabPanel>
</Tabs>`}
        api={TABS_API}
      >
        <Example title="Underline (default)" layout="stack">
          <Tabs defaultValue="overview">
            <TabList label="Project sections">
              <Tab value="overview">Overview</Tab>
              <Tab value="activity" badge={<Badge size="sm">12</Badge>}>
                Activity
              </Tab>
              <Tab value="files">Files</Tab>
              <Tab value="archive" disabled>
                Archive
              </Tab>
            </TabList>
            <TabPanel value="overview">
              Automatic activation means one keystroke changes the view — try the arrow keys.
            </TabPanel>
            <TabPanel value="activity">Twelve events since your last visit.</TabPanel>
            <TabPanel value="files">Nothing uploaded yet.</TabPanel>
          </Tabs>
        </Example>

        <Example title="Segmented" layout="stack">
          <Tabs defaultValue="week" variant="segmented" size="sm">
            <TabList label="Date range">
              <Tab value="day">Day</Tab>
              <Tab value="week">Week</Tab>
              <Tab value="month">Month</Tab>
            </TabList>
            <TabPanel value="day">24 hours of data.</TabPanel>
            <TabPanel value="week">Seven days of data.</TabPanel>
            <TabPanel value="month">Thirty days of data.</TabPanel>
          </Tabs>
        </Example>

        <Example title="Overuse — twelve tabs" layout="stack">
          <Tabs defaultValue="01">
            <TabList label="Many sections">
              {Array.from({ length: 12 }, (_, index) => {
                const id = String(index + 1).padStart(2, '0');
                return (
                  <Tab key={id} value={id}>
                    Section {id}
                  </Tab>
                );
              })}
            </TabList>
            <TabPanel value="01">The list scrolls horizontally instead of wrapping or crushing labels.</TabPanel>
          </Tabs>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="accordion"
        name="Accordion · AccordionItem"
        purpose="Collapsible sections for content that is secondary until asked for — FAQs, advanced settings, long forms. Single mode keeps one section open at a time; multiple allows several."
        usage={`<Accordion type="single" defaultValue={['billing']}>
  <AccordionItem value="billing" title="Billing" subtitle="Cards and invoices">
    …
  </AccordionItem>
  <AccordionItem value="security" title="Security">…</AccordionItem>
</Accordion>`}
        api={[
          ['type', "'single' | 'multiple'", "'single'", 'How many items can be open.'],
          ['defaultValue / value', 'readonly string[]', '[]', 'Open item values.'],
          ['onValueChange', '(value: readonly string[]) => void', '—', 'Fires on every toggle.'],
          ['flush', 'boolean', 'false', 'Removes the outer border for use inside a Card.'],
          ['AccordionItem title / subtitle', 'ReactNode', '—', 'Trigger content.'],
        ]}
      >
        <Example title="Single" layout="stack">
          <Accordion type="single" defaultValue={['shipping']}>
            <AccordionItem value="shipping" title="Shipping" subtitle="Where and how fast">
              Orders placed before 14:00 ship the same day. Tracking arrives by email.
            </AccordionItem>
            <AccordionItem value="returns" title="Returns">
              Anything unopened can go back within 30 days, no questions asked.
            </AccordionItem>
            <AccordionItem value="warranty" title="Warranty" disabled>
              Unavailable in your region.
            </AccordionItem>
          </Accordion>
        </Example>

        <Example title="Multiple" layout="stack">
          <Accordion type="multiple" defaultValue={['a', 'b']}>
            <AccordionItem value="a" title="Both of these start open">
              Because <code>type="multiple"</code> allows more than one at a time.
            </AccordionItem>
            <AccordionItem value="b" title="And they toggle independently">
              Each trigger owns its own aria-expanded state.
            </AccordionItem>
          </Accordion>
        </Example>

        <Example title="Overuse — twelve sections" layout="stack">
          <Accordion type="single" defaultValue={['item-1']}>
            {Array.from({ length: 12 }, (_, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                title={`Policy ${index + 1}`}
                subtitle={index % 3 === 0 ? 'Required reading' : undefined}
              >
                Placeholder copy so we can see a long accordion scroll inside the page, not explode it.
              </AccordionItem>
            ))}
          </Accordion>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="breadcrumbs"
        name="Breadcrumbs"
        purpose="Shows where the current page sits in a hierarchy. The last item is static text with aria-current=&quot;page&quot; — you cannot navigate to where you already are — and long trails collapse in the middle."
        usage={`<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Northwind' },
  ]}
/>`}
        api={[
          ['items', 'readonly BreadcrumbItem[]', '—', '{ label, href?, onClick? } entries.'],
          ['maxItems', 'number', '4', 'Above this, middle items collapse to an ellipsis.'],
          ['label', 'string', "'Breadcrumb'", 'Accessible name of the nav landmark.'],
        ]}
      >
        <Example title="Short and collapsed" layout="stack">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '#/components' },
              { label: 'Projects', href: '#/components' },
              { label: 'Northwind' },
            ]}
          />
          <Breadcrumbs
            items={[
              { label: 'Home', href: '#/components' },
              { label: 'Workspaces', href: '#/components' },
              { label: 'Acme', href: '#/components' },
              { label: 'Projects', href: '#/components' },
              { label: 'Northwind', href: '#/components' },
              { label: 'Settings' },
            ]}
          />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="pagination"
        name="Pagination"
        purpose="Page navigation for lists that are too long to scroll. Truncates around the current page, marks it with aria-current, and disables the edge controls at the boundaries."
        usage={`<Pagination
  page={page}
  pageCount={12}
  onPageChange={setPage}
  siblingCount={1}
/>`}
        api={[
          ['page', 'number', '—', '1-based current page.'],
          ['pageCount', 'number', '—', 'Total number of pages.'],
          ['onPageChange', '(page: number) => void', '—', 'Receives a clamped page number.'],
          ['siblingCount', 'number', '1', 'Pages shown either side of the current one.'],
          ['size', "'sm' | 'md'", "'md'", 'Control size.'],
        ]}
      >
        <Example title="Interactive" layout="stack">
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
          <Pagination page={page} pageCount={12} onPageChange={setPage} size="sm" siblingCount={2} />
          <span className="demo-example-note">Page {page} of 12</span>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="navbar"
        name="Navbar · NavbarLink"
        purpose="The application bar. It is translucent and sticky by default, and below 768px the links collapse behind a disclosure button wired with aria-expanded and aria-controls — the bar at the top of this page is the same component."
        usage={`<Navbar
  brand={<strong>mors</strong>}
  actions={<IconButton label="Account" icon={<Icon name="user" />} />}
>
  <NavbarLink href="#/overview" active>Overview</NavbarLink>
  <NavbarLink href="#/components">Components</NavbarLink>
</Navbar>`}
        api={[
          ['brand', 'ReactNode', '—', 'Wordmark or logo at the start.'],
          ['children', 'ReactNode', '—', 'NavbarLink elements; collapse on small screens.'],
          ['actions', 'ReactNode', '—', 'Trailing controls.'],
          ['sticky', 'boolean', 'true', 'Sticks to the top of the viewport.'],
          ['translucent', 'boolean', 'true', 'Blurred, semi-transparent background.'],
          ['NavbarLink active', 'boolean', 'false', 'Sets aria-current="page".'],
        ]}
      >
        <Example title="Static example" layout="stack">
          <div style={{ border: '1px solid var(--mors-color-border)', borderRadius: 'var(--mors-radius-lg)' }}>
            <Navbar
              sticky={false}
              brand={
                <span className="demo-brand">
                  <span className="demo-brand-mark" aria-hidden="true">
                    m
                  </span>
                  Acme
                </span>
              }
              actions={
                <>
                  <IconButton label="Search" icon={<Icon name="search" />} />
                  <Button size="sm">Sign in</Button>
                </>
              }
            >
              <NavbarLink href="#/components" active>
                Products
              </NavbarLink>
              <NavbarLink href="#/components">Pricing</NavbarLink>
              <NavbarLink href="#/components">Docs</NavbarLink>
            </Navbar>
          </div>
          <span className="demo-example-note">
            Narrow the window below 768px to see the links collapse into the disclosure panel.
          </span>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="steps"
        name="Steps · Step"
        purpose="Linear process indicator for onboarding, checkout and wizards. Current, complete and upcoming states are exposed to assistive tech via aria-current."
        usage={`<Steps current={1}>
  <Step title="Account" description="Email and password" />
  <Step title="Profile" description="Name and photo" />
  <Step title="Done" />
</Steps>`}
        api={[
          ['current', 'number', '—', '0-based index of the active step.'],
          ['orientation', "'horizontal' | 'vertical'", "'horizontal'", 'Stacks on small screens either way.'],
        ]}
      >
        <Example title="Horizontal" layout="stack">
          <Steps current={1}>
            <Step title="Account" description="Email and password" />
            <Step title="Profile" description="Name and photo" />
            <Step title="Review" description="Confirm and pay" />
          </Steps>
        </Example>
        <Example title="Vertical" layout="stack">
          <Steps current={0} orientation="vertical">
            <Step title="Invite sent" description="They have 7 days to accept." />
            <Step title="Joined workspace" />
            <Step title="Assigned a role" />
          </Steps>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="skip-link"
        name="SkipLink"
        purpose="Visually hidden until focused. Place it as the first focusable node in the document so keyboard users can jump past chrome. The one at the top of this demo is the same component."
        usage={`<SkipLink href="#main">Skip to content</SkipLink>`}
        api={[['href', 'string', '—', 'Target id, including the hash.'], ['children', 'ReactNode', "'Skip to content'", 'Link label.']]}
      >
        <Example title="Keyboard only" layout="stack">
          <p className="demo-example-note">
            Press Tab from the top of the page — the skip link is the first control. Shortcuts in copy look like{' '}
            <Kbd keys={['⌘', 'K']} />.
          </p>
        </Example>
      </ComponentDoc>
    </Section>
  );
}
