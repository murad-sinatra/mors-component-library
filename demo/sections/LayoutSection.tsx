import { useState } from 'react';
import {
  AppShell,
  AppShellTrigger,
  Avatar,
  Badge,
  Button,
  Icon,
  IconButton,
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarNav,
  SidebarSection,
  TabBar,
  TabBarItem,
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarSpacer,
} from '../../src';
import { ComponentDoc, Example, Section } from '../components/Doc';

export function LayoutSection() {
  const [page, setPage] = useState('inbox');
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Section
      id="layout"
      title="Layout"
      description="App chrome — the frames people live in. Sidebar is persistent navigation, TabBar is mobile primary nav, and AppShell wires them together with a header and main column."
    >
      <ComponentDoc
        id="app-shell"
        name="AppShell"
        purpose="A grid that places an optional sidebar, header, main region and tab bar. Below 768px the sidebar becomes an overlay controlled by sidebarOpen; the tab bar sits on the bottom with safe-area padding."
        usage={`<AppShell
  sidebar={<Sidebar>…</Sidebar>}
  header={
    <Toolbar>
      <AppShellTrigger />
    </Toolbar>
  }
  tabBar={<TabBar>…</TabBar>}
>
  {children}
</AppShell>`}
        api={[
          ['sidebar / header / tabBar', 'ReactNode', '—', 'Optional chrome slots.'],
          ['sidebarOpen / onSidebarOpenChange', 'boolean / (open) => void', 'false', 'Mobile overlay only; ignored on desktop.'],
          ['AppShellTrigger', '—', '—', 'Toggles the overlay. Hidden at 769px and up.'],
        ]}
      >
        <Example title="Mini app" layout="stack" note="Resize below 768px, then use the menu button to open the sidebar overlay. Collapse the sidebar on desktop to icons, then expand it from the chevron.">
          <div className="demo-frame">
            <AppShell
              sidebarOpen={sidebarOpen}
              onSidebarOpenChange={setSidebarOpen}
              sidebar={
                <Sidebar collapsed={collapsed}>
                  <SidebarHeader>
                    <span className="demo-brand">
                      <span className="demo-brand-mark" aria-hidden="true">
                        m
                      </span>
                      <span>Mail</span>
                    </span>
                    <ToolbarSpacer />
                    <IconButton
                      label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                      icon={<Icon name={collapsed ? 'chevron-right' : 'chevron-left'} />}
                      size="sm"
                      onClick={() => setCollapsed((value) => !value)}
                    />
                  </SidebarHeader>
                  <SidebarNav>
                    <SidebarSection label="Mailbox">
                      <SidebarItem
                        icon={<Icon name="inbox" />}
                        active={page === 'inbox'}
                        badge={
                          <Badge size="sm" tone="accent">
                            3
                          </Badge>
                        }
                        onClick={() => {
                          setPage('inbox');
                          setSidebarOpen(false);
                        }}
                      >
                        Inbox
                      </SidebarItem>
                      <SidebarItem
                        icon={<Icon name="star" />}
                        active={page === 'starred'}
                        onClick={() => {
                          setPage('starred');
                          setSidebarOpen(false);
                        }}
                      >
                        Starred
                      </SidebarItem>
                      <SidebarItem
                        icon={<Icon name="user" />}
                        active={page === 'people'}
                        onClick={() => {
                          setPage('people');
                          setSidebarOpen(false);
                        }}
                      >
                        People
                      </SidebarItem>
                    </SidebarSection>
                  </SidebarNav>
                  <SidebarFooter>
                    <Avatar name="Ada Lovelace" size="sm" />
                    <span className="mors-sidebar-item-label">Ada Lovelace</span>
                  </SidebarFooter>
                </Sidebar>
              }
              header={
                <Toolbar label="Inbox actions">
                  <AppShellTrigger />
                  <ToolbarGroup>
                    <IconButton label="Edit" icon={<Icon name="edit" />} size="sm" />
                    <IconButton label="Filter" icon={<Icon name="filter" />} size="sm" />
                  </ToolbarGroup>
                  <ToolbarSeparator />
                  <ToolbarSpacer />
                  <Button size="sm">Compose</Button>
                </Toolbar>
              }
              tabBar={
                <TabBar value={page} onValueChange={setPage} aria-label="Mailbox">
                  <TabBarItem value="inbox" icon={<Icon name="inbox" />} label="Inbox" badge="3" />
                  <TabBarItem value="starred" icon={<Icon name="star" />} label="Starred" />
                  <TabBarItem value="people" icon={<Icon name="user" />} label="People" />
                </TabBar>
              }
            >
              <div className="demo-shell-main">
                <p className="demo-example-note" style={{ margin: 0 }}>
                  {page === 'inbox'
                    ? 'Three unread messages.'
                    : page === 'starred'
                      ? 'Nothing starred yet.'
                      : 'Twelve people in this workspace.'}
                </p>
              </div>
            </AppShell>
          </div>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="sidebar"
        name="Sidebar · SidebarItem"
        purpose="Persistent application navigation. Not a Drawer — there is no scrim or focus trap. Collapse it to icons; labels stay available via the title attribute and assistive tech."
        usage={`<Sidebar collapsed={collapsed}>
  <SidebarHeader>Mail</SidebarHeader>
  <SidebarNav>
    <SidebarSection label="Mailbox">
      <SidebarItem icon={<Icon name="inbox" />} active>Inbox</SidebarItem>
    </SidebarSection>
  </SidebarNav>
</Sidebar>`}
        api={[
          ['collapsed', 'boolean', 'false', 'Icon-only width; pair with AppShell.'],
          ['SidebarItem icon / badge / active', 'ReactNode / ReactNode / boolean', '—', 'Row chrome.'],
          ['SidebarItem href', 'string', '—', 'Renders an anchor; otherwise a button.'],
        ]}
      >
        <Example title="Standalone" layout="stack">
          <div style={{ maxWidth: '16.5rem', height: 280, border: '1px solid var(--mors-color-border)', borderRadius: 'var(--mors-radius-lg)', overflow: 'hidden' }}>
            <Sidebar>
              <SidebarHeader>
                <strong>Workspace</strong>
              </SidebarHeader>
              <SidebarNav>
                <SidebarSection label="Browse">
                  <SidebarItem icon={<Icon name="home" />} active>
                    Home
                  </SidebarItem>
                  <SidebarItem icon={<Icon name="folder" />}>Projects</SidebarItem>
                  <SidebarItem icon={<Icon name="sliders" />}>Settings</SidebarItem>
                </SidebarSection>
              </SidebarNav>
            </Sidebar>
          </div>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="tab-bar"
        name="TabBar · TabBarItem"
        purpose="Primary mobile navigation: three to five destinations, icon plus label, optional badge, and safe-area padding. Distinct from Tabs (in-page) and Navbar (top chrome). Hidden above 768px unless visibility is always."
        usage={`<TabBar defaultValue="home" aria-label="App">
  <TabBarItem value="home" icon={<Icon name="home" />} label="Home" />
  <TabBarItem value="inbox" icon={<Icon name="inbox" />} label="Inbox" badge="3" />
</TabBar>`}
        api={[
          ['value / onValueChange', 'string / (value) => void', '—', 'Controlled selection.'],
          ['visibility', "'mobile' | 'always'", "'mobile'", 'Hide on desktop, or keep it.'],
          ['TabBarItem icon / label / badge', 'ReactNode', '—', 'Required icon and label.'],
        ]}
      >
        <Example title="Always visible" layout="stack">
          <div className="demo-tab-bar-frame">
            <TabBar defaultValue="home" visibility="always" aria-label="Demo tabs">
              <TabBarItem value="home" icon={<Icon name="home" />} label="Home" />
              <TabBarItem value="inbox" icon={<Icon name="inbox" />} label="Inbox" badge="3" />
              <TabBarItem value="search" icon={<Icon name="search" />} label="Search" />
              <TabBarItem value="you" icon={<Icon name="user" />} label="You" />
            </TabBar>
          </div>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="toolbar"
        name="Toolbar"
        purpose="Compact action row for editors, mail and tables. Arrow keys move between the focusable controls inside it."
        usage={`<Toolbar label="Editor">
  <ToolbarGroup>
    <IconButton label="Edit" icon={<Icon name="edit" />} />
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarSpacer />
  <Button size="sm">Save</Button>
</Toolbar>`}
        api={[
          ['label', 'string', '—', 'Accessible name of the toolbar.'],
          ['ToolbarGroup / ToolbarSeparator / ToolbarSpacer', '—', '—', 'Cluster, divide, and push trailing actions.'],
        ]}
      >
        <Example title="Editor row" layout="stack">
          <Toolbar label="Editor">
            <ToolbarGroup>
              <IconButton label="Bold" icon={<Icon name="edit" />} size="sm" />
              <IconButton label="Filter" icon={<Icon name="filter" />} size="sm" />
            </ToolbarGroup>
            <ToolbarSeparator />
            <IconButton label="Delete" icon={<Icon name="trash" />} size="sm" />
            <ToolbarSpacer />
            <Button size="sm">Save</Button>
          </Toolbar>
        </Example>
      </ComponentDoc>
    </Section>
  );
}
