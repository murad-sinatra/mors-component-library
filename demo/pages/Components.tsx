import { PageHeader } from '../components/Doc';
import { ActionsSection } from '../sections/ActionsSection';
import { FormsSection } from '../sections/FormsSection';
import { ContentSection } from '../sections/ContentSection';
import { FeedbackSection } from '../sections/FeedbackSection';
import { OverlaysSection } from '../sections/OverlaysSection';
import { NavigationSection } from '../sections/NavigationSection';
import { DataSection } from '../sections/DataSection';

const INDEX = [
  {
    group: 'Actions',
    items: [
      ['button', 'Button'],
      ['link', 'Link'],
      ['icon-button', 'IconButton'],
      ['button-group', 'ButtonGroup'],
      ['badge', 'Badge'],
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
    ],
  },
  {
    group: 'Content',
    items: [
      ['card', 'Card'],
      ['divider', 'Divider'],
      ['empty-state', 'EmptyState'],
      ['list', 'List'],
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
    ],
  },
  {
    group: 'Data',
    items: [
      ['table', 'Table'],
      ['filter-bar', 'FilterBar / Chip'],
      ['calendar', 'Calendar'],
    ],
  },
] as const;

export function Components() {
  return (
    <>
      <PageHeader
        eyebrow="Components"
        title="Every component, every state"
        description="Each entry documents what the component is for, how to use it, and the props that matter. Everything on this page is live — open the overlays, sort the table, pick a date."
      />

      <div className="demo-with-sidebar">
        <nav className="demo-sidebar" aria-label="Component index">
          <ul className="demo-sidebar-list">
            {INDEX.map(({ group, items }) => (
              <li key={group}>
                <p className="demo-sidebar-group">{group}</p>
                <ul className="demo-sidebar-list">
                  {items.map(([id, label]) => (
                    <li key={id}>
                      <a className="demo-sidebar-link" href={`#${id}`}>
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
          <NavigationSection />
          <DataSection />
        </div>
      </div>
    </>
  );
}
