import type { ReactNode } from 'react';
import { Badge, Button, Icon, useToast } from '../../src';

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="demo-page-header">
      {eyebrow && <span className="demo-eyebrow">{eyebrow}</span>}
      <h1 className="demo-title">{title}</h1>
      {description && <p className="demo-lede">{description}</p>}
    </header>
  );
}

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="demo-section" id={id} aria-labelledby={`${id}-title`}>
      <div className="demo-section-header">
        <h2 className="demo-section-title" id={`${id}-title`}>
          {title}
        </h2>
        {description && <p className="demo-section-description">{description}</p>}
      </div>
      {children}
    </section>
  );
}

/** `[name, type, default, description]` — compact enough to stay readable inline. */
export type PropRow = readonly [string, string, string, string];

export function PropsTable({ rows, caption }: { rows: readonly PropRow[]; caption: string }) {
  return (
    <div className="demo-table-scroll">
      <table className="demo-props">
        <caption className="mors-visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([name, type, fallback, description]) => (
            <tr key={name}>
              <td className="demo-props-name" data-label="Prop">
                <code>{name}</code>
              </td>
              <td className="demo-props-type" data-label="Type">
                <code>{type}</code>
              </td>
              <td className="demo-props-default" data-label="Default">
                <code>{fallback || '—'}</code>
              </td>
              <td className="demo-props-description" data-label="Notes">
                {description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({ code, label = 'code' }: { code: string; label?: string }) {
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: 'Copied to clipboard', tone: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Copying is blocked in this browser', tone: 'warning' });
    }
  };

  return (
    /* Focusable + labelled so keyboard users can scroll a long snippet. */
    <pre className="demo-code" role="region" tabIndex={0} aria-label={label}>
      <Button
        className="demo-code-copy"
        variant="ghost"
        size="sm"
        startIcon={<Icon name="copy" />}
        onClick={copy}
      >
        Copy
      </Button>
      <code>{code}</code>
    </pre>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return <code className="demo-code demo-code--inline">{children}</code>;
}

export function Example({
  title,
  note,
  layout = 'row',
  children,
}: {
  title: string;
  note?: string;
  layout?: 'row' | 'stack' | 'grid' | 'center';
  children: ReactNode;
}) {
  return (
    <figure className="demo-example">
      <figcaption className="demo-example-header">
        <span className="demo-example-title">{title}</span>
        {note && <span className="demo-example-note">{note}</span>}
      </figcaption>
      <div className={`demo-example-body demo-example-body--${layout}`}>{children}</div>
    </figure>
  );
}

export function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="demo-figure-label">{label}</span>
      <div className="demo-row">{children}</div>
    </div>
  );
}

/**
 * One documented component: purpose, live examples, import snippet and the
 * props that matter. Every entry on the Components page uses this shape.
 */
export function ComponentDoc({
  id,
  name,
  tags,
  purpose,
  usage,
  api,
  children,
}: {
  id: string;
  name: string;
  tags?: readonly string[];
  purpose: ReactNode;
  usage: string;
  api?: readonly PropRow[];
  children: ReactNode;
}) {
  return (
    <article className="demo-doc" id={id} aria-labelledby={`${id}-name`}>
      <div className="demo-doc-head">
        <h3 className="demo-doc-name" id={`${id}-name`}>
          {name}
        </h3>
        {tags?.map((tag) => (
          <Badge key={tag} size="sm" tone="neutral">
            {tag}
          </Badge>
        ))}
      </div>
      <p className="demo-doc-purpose">{purpose}</p>
      <div className="demo-examples">
        {children}
        <CodeBlock code={usage} label={`${name} usage example`} />
        {api && <PropsTable rows={api} caption={`${name} props`} />}
      </div>
    </article>
  );
}
