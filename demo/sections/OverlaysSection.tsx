import { useState } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Drawer,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Modal,
  Popover,
  Select,
  TextField,
  Tooltip,
  useToast,
  type DrawerSide,
} from '../../src';
import { ComponentDoc, Example, Section, type PropRow } from '../components/Doc';

const DIALOG_API: readonly PropRow[] = [
  ['open / onClose', 'boolean / () => void', '—', 'Fully controlled; you own the state.'],
  ['title / description', 'ReactNode', '—', 'Wired to aria-labelledby / aria-describedby.'],
  ['footer', 'ReactNode', '—', 'Action row pinned to the bottom.'],
  ['closeOnScrimClick', 'boolean', 'true', 'Set false for destructive confirmations.'],
  ['closeOnEscape', 'boolean', 'true', 'Escape dismissal.'],
  ['showCloseButton', 'boolean', 'true', 'The header close affordance.'],
  ['ariaLabel', 'string', '—', 'Required when there is no visible title.'],
];

export function OverlaysSection() {
  const { toast } = useToast();
  const [modal, setModal] = useState<null | 'form' | 'confirm'>(null);
  const [drawerSide, setDrawerSide] = useState<DrawerSide | null>(null);

  return (
    <Section
      id="overlays"
      title="Overlays"
      description="Modal, Drawer, Popover, Menu and Tooltip share one dismissal model: Escape closes, an outside pointer press closes, and focus is handled deliberately in each case."
    >
      <ComponentDoc
        id="modal"
        name="Modal"
        tags={['focus trap', 'scroll lock']}
        purpose="A centred dialog for a focused task or a decision. While open, focus is trapped inside, the page behind is scroll-locked, and on close focus returns to whatever opened it. Add data-mors-autofocus to a child to choose where focus lands."
        usage={`const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Invite teammate"
  description="They will get an email invitation."
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={submit}>Send invite</Button>
    </>
  }
>
  <TextField label="Email" data-mors-autofocus />
</Modal>`}
        api={[...DIALOG_API, ['size', "'sm' | 'md' | 'lg'", "'md'", '24 / 32 / 46rem maximum width.'], ['role', "'dialog' | 'alertdialog'", "'dialog'", 'Use alertdialog for destructive confirmations.']]}
      >
        <Example title="Interactive">
          <Button onClick={() => setModal('form')}>Open form dialog</Button>
          <Button variant="destructive" onClick={() => setModal('confirm')}>
            Delete project…
          </Button>
        </Example>

        <Modal
          open={modal === 'form'}
          onClose={() => setModal(null)}
          title="Invite teammate"
          description="They will receive an email invitation to this workspace."
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setModal(null);
                  toast({ title: 'Invitation sent', tone: 'success' });
                }}
              >
                Send invite
              </Button>
            </>
          }
        >
          <div className="demo-stack">
            <TextField
              label="Email address"
              type="email"
              placeholder="you@company.com"
              data-mors-autofocus
            />
            <Select
              label="Role"
              defaultValue="member"
              options={[
                { label: 'Member', value: 'member' },
                { label: 'Admin', value: 'admin' },
                { label: 'Billing only', value: 'billing' },
              ]}
            />
            <Checkbox label="Send a copy to me" />
          </div>
        </Modal>

        <Modal
          open={modal === 'confirm'}
          onClose={() => setModal(null)}
          role="alertdialog"
          size="sm"
          closeOnScrimClick={false}
          title="Delete this project?"
          description="This removes 214 files and cannot be undone."
          footer={
            <>
              <Button variant="ghost" onClick={() => setModal(null)}>
                Keep project
              </Button>
              <Button
                variant="destructive"
                data-mors-autofocus
                onClick={() => {
                  setModal(null);
                  toast({ title: 'Project deleted', tone: 'danger' });
                }}
              >
                Delete
              </Button>
            </>
          }
        >
          <Alert tone="danger" variant="outline" icon={null}>
            The scrim is inert here, so a stray click cannot destroy anything.
          </Alert>
        </Modal>
      </ComponentDoc>

      <ComponentDoc
        id="drawer"
        name="Drawer"
        tags={['focus trap', 'scroll lock']}
        purpose="An edge-anchored panel that shares Modal's behaviour. Use it for filters, details and secondary navigation; left and right drawers become near-full-width sheets on phones."
        usage={`<Drawer
  open={open}
  onClose={close}
  side="right"
  size="26rem"
  title="Filters"
  footer={<Button block onClick={apply}>Show results</Button>}
>
  {/* filter controls */}
</Drawer>`}
        api={[...DIALOG_API, ['side', "'left' | 'right' | 'top' | 'bottom'", "'right'", 'Which edge it slides from.'], ['size', 'string (CSS length)', "'24rem'", 'Width for left/right, height for top/bottom.']]}
      >
        <Example title="Every side">
          {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
            <Button key={side} variant="secondary" onClick={() => setDrawerSide(side)}>
              Open {side}
            </Button>
          ))}
        </Example>

        <Drawer
          open={drawerSide !== null}
          onClose={() => setDrawerSide(null)}
          side={drawerSide ?? 'right'}
          title="Filters"
          description="Narrow the result set."
          footer={
            <Button block onClick={() => setDrawerSide(null)}>
              Show 42 results
            </Button>
          }
        >
          <div className="demo-stack">
            <Checkbox label="Active only" defaultChecked />
            <Checkbox label="Include archived" />
            <Select
              label="Owner"
              defaultValue="any"
              options={[
                { label: 'Anyone', value: 'any' },
                { label: 'Me', value: 'me' },
                { label: 'My team', value: 'team' },
              ]}
            />
            <TextField label="Contains" placeholder="Search text" />
          </div>
        </Drawer>
      </ComponentDoc>

      <ComponentDoc
        id="popover"
        name="Popover"
        purpose="A floating panel anchored to a trigger, for content too big for a tooltip and too small for a dialog. Placement flips when the preferred side does not fit and is clamped inside the viewport."
        usage={`<Popover
  trigger={<Button variant="secondary">Share</Button>}
  placement="bottom"
  align="end"
  ariaLabel="Share options"
>
  <div className="stack">…</div>
</Popover>`}
        api={[
          ['trigger', 'ReactElement', '—', 'Receives ref, aria-expanded and aria-controls.'],
          ['open / defaultOpen / onOpenChange', 'boolean / …', 'false', 'Controlled or uncontrolled.'],
          ['placement', "'top' | 'bottom' | 'left' | 'right'", "'bottom'", 'Preferred side; flips if it does not fit.'],
          ['align', "'start' | 'center' | 'end'", "'center'", 'Cross-axis alignment.'],
          ['offset', 'number', '8', 'Gap from the trigger, in px.'],
          ['padding', "'none' | 'md'", "'md'", 'Use none when the panel supplies its own padding.'],
          ['ariaLabel', 'string', '—', 'Names the panel when it has no heading.'],
        ]}
      >
        <Example title="Placements">
          {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
            <Popover
              key={placement}
              placement={placement}
              ariaLabel={`${placement} popover`}
              trigger={<Button variant="secondary">{placement}</Button>}
            >
              <div className="demo-stack">
                <strong>Anchored {placement}</strong>
                <span className="demo-example-note">
                  Scroll or resize the window — the panel repositions and flips when space runs out.
                </span>
              </div>
            </Popover>
          ))}
        </Example>

        <Example title="With content">
          <Popover
            align="start"
            ariaLabel="Share link"
            trigger={<Button startIcon={<Icon name="external" />}>Share</Button>}
          >
            <div className="demo-stack">
              <TextField label="Anyone with the link" defaultValue="https://mors.dev/p/8f2c" size="sm" />
              <Button size="sm" onClick={() => toast({ title: 'Link copied', tone: 'success' })}>
                Copy link
              </Button>
            </div>
          </Popover>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="menu"
        name="Menu · MenuItem · MenuLabel · MenuSeparator"
        tags={['roving focus']}
        purpose="A dropdown of actions. Arrow Down or Up from the trigger opens it with focus on the first or last item; arrows move, Home and End jump, Enter or Space activates, Escape closes and focus returns to the trigger."
        usage={`<Menu
  trigger={<IconButton label="Row actions" icon={<Icon name="more" />} />}
  ariaLabel="Row actions"
>
  <MenuLabel>Manage</MenuLabel>
  <MenuItem icon={<Icon name="copy" />} shortcut="⌘D" onSelect={duplicate}>
    Duplicate
  </MenuItem>
  <MenuSeparator />
  <MenuItem tone="danger" icon={<Icon name="trash" />} onSelect={remove}>
    Delete
  </MenuItem>
</Menu>`}
        api={[
          ['trigger', 'ReactElement', '—', 'Gets aria-haspopup="menu" and aria-expanded.'],
          ['placement / align / offset', 'see Popover', "'bottom' / 'end' / 6", 'Anchoring.'],
          ['MenuItem onSelect', '() => void', '—', 'Runs, then the menu closes.'],
          ['MenuItem icon / shortcut', 'ReactNode', '—', 'Leading glyph and trailing hint.'],
          ['MenuItem tone', "'default' | 'danger'", "'default'", 'Destructive items read in red.'],
        ]}
      >
        <Example title="Interactive">
          <Menu
            ariaLabel="Row actions"
            trigger={<Button variant="secondary" endIcon={<Icon name="chevron-down" />}>Actions</Button>}
          >
            <MenuLabel>Manage</MenuLabel>
            <MenuItem
              icon={<Icon name="copy" />}
              shortcut="⌘D"
              onSelect={() => toast({ title: 'Duplicated' })}
            >
              Duplicate
            </MenuItem>
            <MenuItem icon={<Icon name="star" />} onSelect={() => toast({ title: 'Added to favourites' })}>
              Add to favourites
            </MenuItem>
            <MenuItem icon={<Icon name="external" />} disabled>
              Open in new tab
            </MenuItem>
            <MenuSeparator />
            <MenuItem
              tone="danger"
              icon={<Icon name="trash" />}
              onSelect={() => toast({ title: 'Deleted', tone: 'danger' })}
            >
              Delete
            </MenuItem>
          </Menu>
          <Menu
            ariaLabel="More options"
            align="start"
            trigger={<IconButton label="More options" icon={<Icon name="more" />} variant="subtle" />}
          >
            <MenuItem onSelect={() => toast({ title: 'Renaming…' })}>Rename</MenuItem>
            <MenuItem onSelect={() => toast({ title: 'Moved' })}>Move to…</MenuItem>
          </Menu>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="tooltip"
        name="Tooltip"
        purpose="A short description for a control whose purpose is not obvious — most often an icon-only button. It appears on hover after a delay and immediately on keyboard focus, and Escape dismisses it so it can never trap a keyboard user. Never put interactive content inside one."
        usage={`<Tooltip content="Archive this project" placement="top">
  <IconButton label="Archive" icon={<Icon name="inbox" />} />
</Tooltip>`}
        api={[
          ['content', 'ReactNode', '—', 'Short, plain text.'],
          ['children', 'ReactElement', '—', 'The trigger; gets aria-describedby.'],
          ['placement / align / offset', 'see Popover', "'top' / 'center' / 8", 'Anchoring.'],
          ['delay', 'number', '200', 'Hover delay in ms; focus always shows immediately.'],
        ]}
      >
        <Example title="Hover or focus with Tab">
          <Tooltip content="Archive this project">
            <IconButton label="Archive" icon={<Icon name="inbox" />} variant="secondary" />
          </Tooltip>
          <Tooltip content="Notifications are muted until Monday" placement="bottom">
            <IconButton label="Notifications" icon={<Icon name="bell" />} variant="secondary" />
          </Tooltip>
          <Tooltip content="Appears instantly" delay={0} placement="right">
            <Button variant="secondary">No delay</Button>
          </Tooltip>
          <Tooltip
            content="Tooltips wrap to a maximum of 18rem, which is enough for a sentence but not a paragraph."
            placement="top"
          >
            <Button variant="secondary">Longer text</Button>
          </Tooltip>
        </Example>
      </ComponentDoc>
    </Section>
  );
}
