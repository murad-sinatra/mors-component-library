import {
  createContext,
  useContext,
  useId,
  useMemo,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';
import { useControllableState } from '../hooks/useControllableState';
import { Icon } from './Icon';

interface TreeContextValue {
  selected?: string;
  onSelect: (id: string) => void;
  isExpanded: (id: string) => boolean;
  toggle: (id: string) => void;
}

const TreeContext = createContext<TreeContextValue | null>(null);
const TreeLevelContext = createContext(1);

function useTree(): TreeContextValue {
  const context = useContext(TreeContext);
  if (!context) throw new Error('<TreeItem> must be rendered inside <Tree>.');
  return context;
}

function visibleItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]')).filter(
    (item) => !item.parentElement?.closest('[hidden]'),
  );
}

const NONE: readonly string[] = [];

export interface TreeProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  selected?: string;
  defaultSelected?: string;
  onSelect?: (id: string) => void;
  expanded?: readonly string[];
  defaultExpanded?: readonly string[];
  onExpandedChange?: (ids: readonly string[]) => void;
  label?: string;
  children?: ReactNode;
}

/**
 * Nested files, settings and outlines. Arrow keys walk visible rows, Right
 * expands, Left collapses, Enter selects.
 */
export function Tree({
  selected,
  defaultSelected = '',
  onSelect,
  expanded,
  defaultExpanded = NONE,
  onExpandedChange,
  label,
  className,
  children,
  onKeyDown,
  ...rest
}: TreeProps) {
  const [current, setCurrent] = useControllableState(selected, defaultSelected, onSelect);
  const [openIds, setOpenIds] = useControllableState(expanded, defaultExpanded, onExpandedChange);

  const context = useMemo<TreeContextValue>(
    () => ({
      selected: current,
      onSelect: setCurrent,
      isExpanded: (id: string) => openIds.includes(id),
      toggle: (id: string) => {
        setOpenIds(openIds.includes(id) ? openIds.filter((entry) => entry !== id) : [...openIds, id]);
      },
    }),
    [current, setCurrent, openIds, setOpenIds],
  );

  const onKey = (event: KeyboardEvent<HTMLUListElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const root = event.currentTarget;
    const items = visibleItems(root);
    if (items.length === 0) return;
    const active = document.activeElement as HTMLElement | null;
    const index = items.indexOf(active as HTMLElement);

    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '];
    if (!keys.includes(event.key)) return;
    event.preventDefault();

    if (event.key === 'Home') {
      items[0]?.focus();
      return;
    }
    if (event.key === 'End') {
      items[items.length - 1]?.focus();
      return;
    }
    if (event.key === 'ArrowDown') {
      items[index < 0 ? 0 : (index + 1) % items.length]?.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      items[index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length]?.focus();
      return;
    }

    if (!active || !root.contains(active)) return;
    const id = active.dataset.morsTreeId;
    if (!id) return;

    if (event.key === 'Enter' || event.key === ' ') {
      setCurrent(id);
      return;
    }
    if (event.key === 'ArrowRight') {
      if (active.getAttribute('aria-expanded') === 'false') context.toggle(id);
      else active.querySelector<HTMLElement>(':scope > [role="group"] [role="treeitem"]')?.focus();
      return;
    }
    if (event.key === 'ArrowLeft') {
      if (active.getAttribute('aria-expanded') === 'true') context.toggle(id);
      else active.parentElement?.closest<HTMLElement>('[role="treeitem"]')?.focus();
    }
  };

  const onFocus = (event: FocusEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget) return;
    const items = visibleItems(event.currentTarget);
    const selectedItem = items.find((item) => item.getAttribute('aria-selected') === 'true');
    (selectedItem ?? items[0])?.focus();
  };

  return (
    <TreeContext value={context}>
      <ul
        role="tree"
        tabIndex={0}
        aria-label={label}
        className={cx('mors-tree', className)}
        onKeyDown={onKey}
        onFocus={onFocus}
        {...rest}
      >
        {children}
      </ul>
    </TreeContext>
  );
}

export interface TreeItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'id'> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}

export function TreeItem({ id, label, icon, className, children, ...rest }: TreeItemProps) {
  const tree = useTree();
  const level = useContext(TreeLevelContext);
  const branch = Boolean(children);
  const open = branch && tree.isExpanded(id);
  const selected = tree.selected === id;
  const groupId = `mors${useId()}-tree-group`;

  return (
    <li
      role="treeitem"
      data-mors-tree-id={id}
      tabIndex={-1}
      aria-selected={selected}
      aria-expanded={branch ? open : undefined}
      aria-level={level}
      className={cx(
        'mors-tree-item',
        selected && 'mors-tree-item--selected',
        open && 'mors-tree-item--open',
        className,
      )}
      onClick={(event) => {
        event.stopPropagation();
        tree.onSelect(id);
      }}
      {...rest}
    >
      <div
        className="mors-tree-row"
        style={{ paddingInlineStart: `calc(${(level - 1) * 0.9}rem + var(--mors-space-3))` }}
      >
        {branch ? (
          <span
            className="mors-tree-chevron"
            aria-hidden="true"
            onClick={(event) => {
              event.stopPropagation();
              tree.toggle(id);
            }}
          >
            <Icon name="chevron-right" />
          </span>
        ) : (
          <span className="mors-tree-chevron mors-tree-chevron--leaf" />
        )}
        {icon && <span className="mors-tree-icon">{icon}</span>}
        <span className="mors-tree-label">{label}</span>
      </div>
      {branch && (
        <ul id={groupId} role="group" className="mors-tree-group" hidden={!open}>
          <TreeLevelContext value={level + 1}>{children}</TreeLevelContext>
        </ul>
      )}
    </li>
  );
}
