import { useEffect, useLayoutEffect, useState } from 'react';
import { Select } from '../../src';
import { PageHeader } from '../components/Doc';
import { ActionsSection } from '../sections/ActionsSection';
import { FormsSection } from '../sections/FormsSection';
import { ContentSection } from '../sections/ContentSection';
import { FeedbackSection } from '../sections/FeedbackSection';
import { OverlaysSection } from '../sections/OverlaysSection';
import { LayoutSection } from '../sections/LayoutSection';
import { NavigationSection } from '../sections/NavigationSection';
import { DataSection } from '../sections/DataSection';

function sectionFromHash(): string | undefined {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts[0] === 'components') return parts[1];
  if (parts.length === 1 && parts[0] !== 'overview' && parts[0] !== 'design-system') {
    return parts[0];
  }
  return undefined;
}

function scrollToSection(id: string | undefined) {
  if (!id) return;
  const run = () => {
    const node = document.getElementById(id);
    if (!node) return;
    const offset = 136;
    const top = window.scrollY + node.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
  };
  requestAnimationFrame(run);
}

const INDEX = [
  {
    group: 'Actions',
    items: [
      ['button', 'Button'],
      ['link', 'Link'],
      ['icon-button', 'IconButton'],
      ['button-group', 'ButtonGroup'],
      ['badge', 'Badge'],
      ['swatch', 'Swatch'],
      ['avatar', 'Avatar'],
    ],
  },
  {
    group: 'Forms',
    items: [
      ['text-field', 'TextField'],
      ['textarea', 'Textarea'],
      ['select', 'Select'],
      ['search-field', 'SearchField'],
      ['number-field', 'NumberField'],
      ['file-field', 'FileField'],
      ['checkbox-radio', 'Checkbox / Radio'],
      ['switch', 'Switch'],
      ['slider', 'Slider'],
      ['date-picker', 'DatePicker'],
      ['time-picker', 'TimePicker'],
      ['combobox', 'Combobox'],
      ['otp-field', 'OtpField'],
      ['token-field', 'TokenField'],
    ],
  },
  {
    group: 'Content',
    items: [
      ['card', 'Card'],
      ['divider', 'Divider'],
      ['empty-state', 'EmptyState'],
      ['list', 'List'],
      ['tree', 'Tree'],
      ['kbd', 'Kbd'],
    ],
  },
  {
    group: 'Feedback',
    items: [
      ['alert', 'Alert'],
      ['loaders', 'Spinner / Skeleton / Progress'],
      ['toast', 'Toast'],
    ],
  },
  {
    group: 'Overlays',
    items: [
      ['modal', 'Modal'],
      ['drawer', 'Drawer'],
      ['popover', 'Popover'],
      ['menu', 'Menu'],
      ['tooltip', 'Tooltip'],
      ['sheet', 'Sheet'],
      ['action-sheet', 'ActionSheet'],
      ['confirm-dialog', 'ConfirmDialog'],
      ['command-palette', 'CommandPalette'],
      ['context-menu', 'ContextMenu'],
    ],
  },
  {
    group: 'Layout',
    items: [
      ['app-shell', 'AppShell'],
      ['sidebar', 'Sidebar'],
      ['tab-bar', 'TabBar'],
      ['toolbar', 'Toolbar'],
    ],
  },
  {
    group: 'Navigation',
    items: [
      ['tabs', 'Tabs'],
      ['accordion', 'Accordion'],
      ['breadcrumbs', 'Breadcrumbs'],
      ['pagination', 'Pagination'],
      ['navbar', 'Navbar'],
      ['steps', 'Steps'],
      ['skip-link', 'SkipLink'],
    ],
  },
  {
    group: 'Data',
    items: [
      ['table', 'Table'],
      ['filter-bar', 'FilterBar / Chip'],
      ['calendar', 'Calendar'],
      ['event-calendar', 'EventCalendar'],
    ],
  },
] as const;

const JUMP_OPTIONS = INDEX.flatMap(({ group, items }) =>
  items.map(([id, label]) => ({ value: id, label: `${group} · ${label}` })),
);

export function Components() {
  const [active, setActive] = useState(sectionFromHash);

  useLayoutEffect(() => {
    scrollToSection(sectionFromHash());
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const id = sectionFromHash();
      setActive(id);
      scrollToSection(id);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Every component, every state"
        description="Each entry documents what the component is for, how to use it, and the props that matter. Everything on this page is live — open the overlays, sort the table, pick a date."
      />

      <div className="demo-toc">
        <Select
          label="Jump to component"
          size="sm"
          placeholder="Choose a component"
          value={active ?? ''}
          onChange={(id) => {
            window.location.hash = `#/components/${id}`;
          }}
          options={JUMP_OPTIONS}
        />
      </div>

      <div className="demo-with-sidebar">
        <nav className="demo-sidebar" aria-label="Component index">
          <ul className="demo-sidebar-list">
            {INDEX.map(({ group, items }) => (
              <li key={group}>
                <p className="demo-sidebar-group">{group}</p>
                <ul className="demo-sidebar-list">
                  {items.map(([id, label]) => (
                    <li key={id}>
                      <a
                        className={`demo-sidebar-link${active === id ? ' demo-sidebar-link--active' : ''}`}
                        href={`#/components/${id}`}
                        aria-current={active === id ? 'location' : undefined}
                        onClick={(event) => {
                          if (sectionFromHash() !== id) return;
                          event.preventDefault();
                          scrollToSection(id);
                        }}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <ActionsSection />
          <FormsSection />
          <ContentSection />
          <FeedbackSection />
          <OverlaysSection />
          <LayoutSection />
          <NavigationSection />
          <DataSection />
        </div>
      </div>
    </>
  );
}
