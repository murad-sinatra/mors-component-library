import { useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Calendar,
  Chip,
  EmptyState,
  FilterBar,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  SearchField,
  Table,
  useToast,
  type TableColumn,
} from '../../src';
import { ComponentDoc, Example, Section, type PropRow } from '../components/Doc';

interface Account {
  id: string;
  name: string;
  owner: string;
  plan: 'Solo' | 'Team' | 'Enterprise';
  seats: number;
  status: 'active' | 'trialing' | 'paused';
}

const ACCOUNTS: Account[] = [
  { id: '1', name: 'Northwind Traders', owner: 'Ada Lovelace', plan: 'Enterprise', seats: 240, status: 'active' },
  { id: '2', name: 'Aperture Labs', owner: 'Grace Hopper', plan: 'Team', seats: 48, status: 'trialing' },
  { id: '3', name: 'Cyberdyne Systems', owner: 'Alan Turing', plan: 'Solo', seats: 3, status: 'paused' },
  { id: '4', name: 'Stark Industries', owner: 'Katherine Johnson', plan: 'Enterprise', seats: 1280, status: 'active' },
  { id: '5', name: 'Wayne Enterprises', owner: 'Radia Perlman', plan: 'Team', seats: 62, status: 'active' },
];

const STATUS_TONE = {
  active: 'success',
  trialing: 'info',
  paused: 'warning',
} as const;

const TABLE_API: readonly PropRow[] = [
  ['columns', 'readonly TableColumn<Row>[]', '—', '{ id, header, cell, sortValue?, align?, width?, hideOnMobile? }.'],
  ['rows / rowKey', 'readonly Row[] / (row) => string', '—', 'Data and a stable key per row.'],
  ['caption', 'ReactNode', '—', 'Visually hidden by default; always provide one.'],
  ['defaultSort / sort / onSortChange', 'TableSort | null', 'null', 'Uncontrolled, or controlled for server-side sorting.'],
  ['size / zebra / stickyHeader', "'sm' | 'md' / boolean", "'md' / false", 'Density and header behaviour.'],
  ['emptyState', 'ReactNode', "'No results'", 'Rendered in place of the body when rows is empty.'],
];

export function DataSection() {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [plans, setPlans] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const filtered = useMemo(
    () =>
      ACCOUNTS.filter((account) => {
        const matchesQuery =
          query.length === 0 ||
          `${account.name} ${account.owner}`.toLowerCase().includes(query.toLowerCase());
        const matchesPlan = plans.length === 0 || plans.includes(account.plan);
        return matchesQuery && matchesPlan;
      }),
    [query, plans],
  );

  const columns: TableColumn<Account>[] = useMemo(
    () => [
      {
        id: 'name',
        header: 'Account',
        sortValue: (row) => row.name,
        cell: (row) => (
          <span className="demo-row">
            <Avatar name={row.owner} size="sm" />
            <span>
              <strong style={{ fontWeight: 'var(--mors-weight-medium)' }}>{row.name}</strong>
              <br />
              <span style={{ color: 'var(--mors-color-text-tertiary)', fontSize: 'var(--mors-text-sm)' }}>
                {row.owner}
              </span>
            </span>
          </span>
        ),
      },
      {
        id: 'plan',
        header: 'Plan',
        sortValue: (row) => row.plan,
        hideOnMobile: true,
        cell: (row) => row.plan,
      },
      {
        id: 'seats',
        header: 'Seats',
        align: 'end',
        sortValue: (row) => row.seats,
        cell: (row) => row.seats.toLocaleString(),
      },
      {
        id: 'status',
        header: 'Status',
        sortValue: (row) => row.status,
        cell: (row) => (
          <Badge tone={STATUS_TONE[row.status]} dot>
            {row.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'end',
        width: '5rem',
        cell: (row) => (
          <Menu
            ariaLabel={`Actions for ${row.name}`}
            trigger={<IconButton label={`Actions for ${row.name}`} icon={<Icon name="more" />} size="sm" />}
          >
            <MenuItem onSelect={() => toast({ title: `Opened ${row.name}` })}>Open</MenuItem>
            <MenuItem onSelect={() => toast({ title: `${row.name} paused`, tone: 'warning' })}>
              Pause billing
            </MenuItem>
          </Menu>
        ),
      },
    ],
    [toast],
  );

  const togglePlan = (plan: string) =>
    setPlans((current) =>
      current.includes(plan) ? current.filter((entry) => entry !== plan) : [...current, plan],
    );

  return (
    <Section
      id="data"
      title="Data"
      description="Tables, filters and date selection — the components that carry the most information per pixel, so they lean hardest on the type and spacing scale."
    >
      <ComponentDoc
        id="table"
        name="Table"
        tags={['generic', 'sortable']}
        purpose="A semantic data table with three-state column sorting: ascending, descending, then back to the source order. Sorting happens in memory when a column exposes sortValue; pass sort and onSortChange instead to sort on the server. Columns are defined as data, so cells stay declarative."
        usage={`const columns: TableColumn<Account>[] = [
  { id: 'name', header: 'Account', cell: (row) => row.name, sortValue: (row) => row.name },
  { id: 'seats', header: 'Seats', align: 'end', cell: (row) => row.seats, sortValue: (row) => row.seats },
];

<Table
  columns={columns}
  rows={rows}
  rowKey={(row) => row.id}
  caption="Customer accounts"
  defaultSort={{ columnId: 'seats', direction: 'desc' }}
  zebra
/>`}
        api={TABLE_API}
      >
        <Example title="Sortable, filterable" layout="stack">
          <FilterBar
            label="Account filters"
            summary={`${filtered.length} of ${ACCOUNTS.length} accounts`}
            leading={
              <SearchField
                label="Search accounts"
                size="sm"
                placeholder="Search name or owner"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
                onClear={() => setQuery('')}
              />
            }
            trailing={
              (plans.length > 0 || query.length > 0) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPlans([]);
                    setQuery('');
                  }}
                >
                  Clear all
                </Button>
              )
            }
          >
            {(['Solo', 'Team', 'Enterprise'] as const).map((plan) => (
              <Chip
                key={plan}
                size="sm"
                selected={plans.includes(plan)}
                count={ACCOUNTS.filter((account) => account.plan === plan).length}
                onClick={() => togglePlan(plan)}
              >
                {plan}
              </Chip>
            ))}
          </FilterBar>

          <Table
            columns={columns}
            rows={filtered}
            rowKey={(row) => row.id}
            caption="Customer accounts, sortable by account, plan, seats and status"
            defaultSort={{ columnId: 'seats', direction: 'desc' }}
            zebra
            emptyState={
              <EmptyState
                size="sm"
                icon={<Icon name="search" />}
                title="No accounts match"
                description="Clear a filter or try a different search."
              />
            }
          />
          <span className="demo-example-note">
            Click a column header to cycle ascending → descending → unsorted. The Plan column is
            hidden below 768px via <code>hideOnMobile</code>.
          </span>
        </Example>

        <Example title="Compact, sticky header" layout="stack">
          <div style={{ maxHeight: 220, overflow: 'auto', borderRadius: 'var(--mors-radius-lg)' }}>
            <Table
              size="sm"
              stickyHeader
              columns={columns.slice(0, 3)}
              rows={ACCOUNTS}
              rowKey={(row) => row.id}
              caption="Compact accounts table"
            />
          </div>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="filter-bar"
        name="FilterBar · Chip"
        purpose="A row of filters above a result set. Chips are toggle buttons with aria-pressed, optionally showing a count or a remove affordance, and the FilterBar summary is a polite live region so screen-reader users hear the result count change."
        usage={`<FilterBar
  label="Account filters"
  summary={\`\${results.length} results\`}
  leading={<SearchField label="Search" size="sm" />}
  trailing={<Button size="sm" variant="ghost">Clear all</Button>}
>
  <Chip selected={active} count={12} onClick={toggle}>Team</Chip>
  <Chip onRemove={() => remove('eu-west')}>eu-west</Chip>
</FilterBar>`}
        api={[
          ['FilterBar label', 'string', '—', 'Names the filter group.'],
          ['FilterBar leading / trailing', 'ReactNode', '—', 'Search control and clear/sort actions.'],
          ['FilterBar summary', 'ReactNode', '—', 'Live result count (aria-live="polite").'],
          ['Chip selected', 'boolean', 'false', 'Exposed as aria-pressed.'],
          ['Chip count', 'number', '—', 'Trailing count.'],
          ['Chip onRemove', '() => void', '—', 'Adds a labelled remove button.'],
          ['Chip size', "'sm' | 'md'", "'md'", 'Chip density.'],
        ]}
      >
        <Example title="Chips" layout="stack">
          <div className="demo-row">
            <Chip>Unselected</Chip>
            <Chip selected>Selected</Chip>
            <Chip count={24}>With count</Chip>
            <Chip startIcon={<Icon name="filter" />}>With icon</Chip>
            <Chip size="sm">Small</Chip>
            <Chip onRemove={() => toast({ title: 'Filter removed' })}>Removable</Chip>
          </div>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="calendar"
        name="Calendar"
        tags={['keyboard grid']}
        purpose="A month grid following the ARIA date-grid pattern: arrow keys move by day, PageUp and PageDown by month (with Shift, by year), Home and End reach the ends of the week, and only one day is ever in the tab order. Weekday names and day labels come from Intl, so it localises for free."
        usage={`<Calendar
  value={date}
  onChange={setDate}
  min={new Date()}
  weekStartsOn={1}
  locale="en-GB"
  isDateDisabled={(day) => day.getDay() === 0}
  footer={<Button variant="link" size="sm">Today</Button>}
/>`}
        api={[
          ['value / defaultValue', 'Date | null', 'null', 'Selected day.'],
          ['onChange', '(date: Date) => void', '—', 'Fires on selection.'],
          ['month / defaultMonth / onMonthChange', 'Date', 'today', 'Control which month is visible.'],
          ['min / max', 'Date', '—', 'Out-of-range days are disabled.'],
          ['weekStartsOn', '0 | 1', '1', 'Sunday or Monday.'],
          ['isDateDisabled', '(date: Date) => boolean', '—', 'Disable individual days.'],
          ['locale', 'string', 'browser locale', 'BCP 47 tag for Intl formatting.'],
        ]}
      >
        <Example title="Selection and constraints" layout="grid">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            footer={
              <>
                <Button variant="link" size="sm" onClick={() => setSelectedDate(new Date())}>
                  Today
                </Button>
                <Button variant="link" size="sm" onClick={() => setSelectedDate(null)}>
                  Clear
                </Button>
              </>
            }
          />
          <div className="demo-stack">
            <Calendar
              weekStartsOn={0}
              min={new Date()}
              isDateDisabled={(day) => day.getDay() === 0 || day.getDay() === 6}
              locale="en-US"
            />
            <span className="demo-example-note">
              Weekends and past dates disabled, weeks starting Sunday, US locale.
            </span>
          </div>
        </Example>
        <Example title="Selected value">
          <span className="demo-example-note">
            {selectedDate ? selectedDate.toDateString() : 'Nothing selected — try the arrow keys.'}
          </span>
        </Example>
      </ComponentDoc>
    </Section>
  );
}
