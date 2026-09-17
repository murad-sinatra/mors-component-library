import type { HTMLAttributes } from 'react';
import { cx } from '../utils/cx';
import { Icon } from './Icon';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'onChange'> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  size?: 'sm' | 'md';
  label?: string;
}

const ELLIPSIS = 'ellipsis';

function buildRange(page: number, pageCount: number, siblingCount: number): (number | typeof ELLIPSIS)[] {
  const total = siblingCount * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const left = Math.max(page - siblingCount, 2);
  const right = Math.min(page + siblingCount, pageCount - 1);
  const range: (number | typeof ELLIPSIS)[] = [1];

  if (left > 2) range.push(ELLIPSIS);
  for (let index = left; index <= right; index += 1) range.push(index);
  if (right < pageCount - 1) range.push(ELLIPSIS);
  range.push(pageCount);

  return range;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblingCount = 1,
  size = 'md',
  label = 'Pagination',
  className,
  ...rest
}: PaginationProps) {
  const pages = buildRange(page, pageCount, siblingCount);
  const go = (next: number) => onPageChange(Math.min(Math.max(1, next), pageCount));

  return (
    <nav aria-label={label} className={cx('mors-pagination', size !== 'md' && `mors-pagination--${size}`, className)} {...rest}>
      <button
        type="button"
        className="mors-page-button mors-page-button--edge"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <Icon name="chevron-left" />
      </button>

      <ol className="mors-pagination-list">
        {pages.map((entry, index) =>
          entry === ELLIPSIS ? (
            <li key={`ellipsis-${index}`} className="mors-pagination-ellipsis" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                className={cx('mors-page-button', entry === page && 'mors-page-button--current')}
                aria-current={entry === page ? 'page' : undefined}
                aria-label={`Page ${entry}`}
                onClick={() => go(entry)}
              >
                {entry}
              </button>
            </li>
          ),
        )}
      </ol>

      <button
        type="button"
        className="mors-page-button mors-page-button--edge"
        onClick={() => go(page + 1)}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        <Icon name="chevron-right" />
      </button>
    </nav>
  );
}
