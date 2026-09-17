import { useMemo, type ReactNode, type TableHTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { Icon } from './Icon';

export type SortDirection = 'asc' | 'desc';

export interface TableSort {
  columnId: string;
  direction: SortDirection;
}

export interface TableColumn<Row> {
  id: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  /** Providing this makes the column sortable. */
  sortValue?: (row: Row) => string | number;
  align?: 'start' | 'center' | 'end';
  /** Any CSS length applied to the column. */
  width?: string;
  /** Hides the column below 768px, for dense tables on phones. */
  hideOnMobile?: boolean;
}

export interface TableProps<Row> extends Omit<TableHTMLAttributes<HTMLTableElement>, 'children'> {
  columns: readonly TableColumn<Row>[];
  rows: readonly Row[];
  rowKey: (row: Row) => string;
  /** Visually hidden by default; always provide one for screen readers. */
  caption?: ReactNode;
  showCaption?: boolean;
  size?: 'sm' | 'md';
  zebra?: boolean;
  stickyHeader?: boolean;
  sort?: TableSort | null;
  defaultSort?: TableSort | null;
  onSortChange?: (sort: TableSort | null) => void;
  /** Rendered in place of the body when there are no rows. */
  emptyState?: ReactNode;
}

/**
 * Semantic data table with three-state column sorting (ascending → descending →
 * unsorted). Sorting is applied in-memory when a column exposes `sortValue`;
 * pass `sort` + `onSortChange` to sort on the server instead.
 */
export function Table<Row>({
  columns,
  rows,
  rowKey,
  caption,
  showCaption = false,
  size = 'md',
  zebra = false,
  stickyHeader = false,
  sort,
  defaultSort = null,
  onSortChange,
  emptyState,
  className,
  ...rest
}: TableProps<Row>) {
  const [activeSort, setActiveSort] = useControllableState(sort, defaultSort, onSortChange);
  const controlled = sort !== undefined;

  const sortedRows = useMemo(() => {
    if (controlled || !activeSort) return rows;
    const column = columns.find((entry) => entry.id === activeSort.columnId);
    if (!column?.sortValue) return rows;

    const factor = activeSort.direction === 'asc' ? 1 : -1;
    return rows.toSorted((a, b) => {
      const left = column.sortValue!(a);
      const right = column.sortValue!(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor;
      return String(left).localeCompare(String(right), undefined, { numeric: true }) * factor;
    });
  }, [controlled, activeSort, rows, columns]);

  const toggleSort = (columnId: string) => {
    if (!activeSort || activeSort.columnId !== columnId) {
      setActiveSort({ columnId, direction: 'asc' });
    } else if (activeSort.direction === 'asc') {
      setActiveSort({ columnId, direction: 'desc' });
    } else {
      setActiveSort(null);
    }
  };

  return (
    <div className={cx('mors-table-wrapper', className)}>
      <table
        className={cx(
          'mors-table',
          `mors-table--${size}`,
          zebra && 'mors-table--zebra',
          stickyHeader && 'mors-table--sticky',
        )}
        {...rest}
      >
        {caption && (
          <caption className={cx('mors-table-caption', !showCaption && 'mors-visually-hidden')}>
            {caption}
          </caption>
        )}
        <thead className="mors-table-head">
          <tr>
            {columns.map((column) => {
              const sorted = activeSort?.columnId === column.id ? activeSort.direction : null;
              return (
                <th
                  key={column.id}
                  scope="col"
                  style={column.width ? { width: column.width } : undefined}
                  aria-sort={sorted ? (sorted === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={cx(
                    'mors-table-th',
                    column.align && `mors-table-cell--${column.align}`,
                    column.hideOnMobile && 'mors-table-cell--hide-mobile',
                  )}
                >
                  {column.sortValue ? (
                    <button
                      type="button"
                      className={cx('mors-table-sort', sorted && 'mors-table-sort--active')}
                      onClick={() => toggleSort(column.id)}
                    >
                      <span>{column.header}</span>
                      <Icon
                        name={sorted === 'asc' ? 'arrow-up' : sorted === 'desc' ? 'arrow-down' : 'sort'}
                        className="mors-table-sort-icon"
                      />
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="mors-table-body">
          {sortedRows.length === 0 ? (
            <tr>
              <td className="mors-table-empty" colSpan={columns.length}>
                {emptyState ?? 'No results'}
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr key={rowKey(row)} className="mors-table-row">
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cx(
                      'mors-table-td',
                      column.align && `mors-table-cell--${column.align}`,
                      column.hideOnMobile && 'mors-table-cell--hide-mobile',
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
