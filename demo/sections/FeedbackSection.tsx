import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Skeleton,
  Spinner,
  useToast,
} from '../../src';
import { ComponentDoc, Example, Labelled, Section, type PropRow } from '../components/Doc';

const ALERT_API: readonly PropRow[] = [
  ['tone', "'info' | 'success' | 'warning' | 'danger' | 'neutral'", "'info'", 'Colour and default icon.'],
  ['variant', "'soft' | 'outline'", "'soft'", 'Tinted fill or hairline outline.'],
  ['title', 'ReactNode', '—', 'Bolded first line.'],
  ['icon', 'ReactNode | null', 'tone icon', 'Pass null to hide the icon.'],
  ['actions', 'ReactNode', '—', 'Buttons under the message.'],
  ['onDismiss', '() => void', '—', 'Adds a close button when provided.'],
];

const TOAST_API: readonly PropRow[] = [
  ['toast(options)', '(options: ToastOptions) => string', '—', 'Shows a toast, returns its id.'],
  ['options.tone', "'neutral' | 'success' | 'warning' | 'danger' | 'info'", "'neutral'", 'Warning and danger use role="alert".'],
  ['options.duration', 'number', '5000', 'Milliseconds; 0 keeps it until dismissed.'],
  ['options.action', '{ label, onClick }', '—', 'One inline action, e.g. Undo.'],
  ['dismiss(id) / dismissAll()', '(id: string) => void', '—', 'Imperative dismissal.'],
  ['<ToastProvider position max>', "'bottom-right' … | number", "'bottom-right' | 4", 'Viewport corner and queue limit.'],
];

export function FeedbackSection() {
  const { toast, dismissAll } = useToast();

  return (
    <Section
      id="feedback"
      title="Feedback"
      description="Telling the user what happened, what is happening, and what is missing — with the right live-region politeness for each case."
    >
      <ComponentDoc
        id="alert"
        name="Alert"
        purpose="An inline message tied to the content around it. Info and success announce politely as status; warning and danger use role=alert so they interrupt."
        usage={`<Alert
  tone="warning"
  title="Card expiring soon"
  actions={<Button size="sm" variant="secondary">Update card</Button>}
  onDismiss={() => setHidden(true)}
>
  Your Visa ending 4242 expires next month.
</Alert>`}
        api={ALERT_API}
      >
        <Example title="Tones" layout="stack">
          <Alert tone="info" title="Scheduled maintenance">
            The API will be read-only on Sunday from 02:00 to 04:00 UTC.
          </Alert>
          <Alert tone="success" title="Payment received">
            Your invoice has been marked as paid.
          </Alert>
          <Alert
            tone="warning"
            title="Card expiring soon"
            actions={
              <Button size="sm" variant="secondary">
                Update card
              </Button>
            }
          >
            Your Visa ending 4242 expires next month.
          </Alert>
          <Alert tone="danger" title="Deployment failed" onDismiss={() => undefined}>
            Two of three health checks did not pass.
          </Alert>
          <Alert tone="neutral" variant="outline" icon={null}>
            A quiet, icon-free note for secondary information.
          </Alert>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="loaders"
        name="Spinner · Skeleton · Progress"
        purpose="Three ways to show work in flight: a spinner for short indeterminate waits, skeletons for content whose shape is known, and a progress bar when you can measure completion."
        usage={`<Spinner size="md" label="Loading" />

<Skeleton variant="text" lines={3} />
<Skeleton variant="circle" width={40} height={40} />

<Progress value={64} label="Uploading" showValue />
<Progress label="Syncing" />  {/* indeterminate */}`}
        api={[
          ['Spinner size', "'sm' | 'md' | 'lg'", "'md'", '16 / 20 / 28px; inherits currentColor.'],
          ['Spinner label', 'string | null', "'Loading'", 'Announced via role=status; null for decorative use.'],
          ['Skeleton variant', "'text' | 'rect' | 'circle'", "'text'", 'Shape of the placeholder.'],
          ['Skeleton lines', 'number', '1', 'Stacked text lines; last line is shortened.'],
          ['Progress value', 'number | undefined', '—', 'Omit for an indeterminate bar.'],
          ['Progress tone', "'accent' | 'success' | 'warning' | 'danger'", "'accent'", 'Fill colour.'],
        ]}
      >
        <Example title="Spinner" layout="stack">
          <Labelled label="Sizes">
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </Labelled>
          <Labelled label="Inherits colour">
            <span style={{ color: 'var(--mors-color-accent)' }}>
              <Spinner />
            </span>
            <span style={{ color: 'var(--mors-color-danger)' }}>
              <Spinner />
            </span>
          </Labelled>
        </Example>

        <Example title="Skeleton" layout="grid">
          <Card>
            <CardHeader title="Loading card" />
            <CardBody>
              <div className="demo-stack">
                <div className="demo-row">
                  <Skeleton variant="circle" width={40} height={40} />
                  <Skeleton variant="text" width="8rem" />
                </div>
                <Skeleton variant="text" lines={3} />
                <Skeleton variant="rect" height={80} />
              </div>
            </CardBody>
          </Card>
        </Example>

        <Example title="Progress" layout="stack">
          <Progress value={64} label="Uploading assets" showValue />
          <Progress value={92} tone="success" label="Almost done" showValue size="sm" />
          <Progress value={18} tone="danger" label="Storage remaining" showValue />
          <Progress label="Syncing (indeterminate)" />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="toast"
        name="ToastProvider · useToast"
        purpose="Transient notifications for work that finished somewhere other than where the user is looking. One provider owns the queue and renders a single portalled live region; anything below it can publish with the useToast hook."
        usage={`// once, near the root
<ToastProvider position="bottom-right" max={4}>
  <App />
</ToastProvider>

// anywhere below
const { toast } = useToast();

toast({
  title: 'Project archived',
  description: 'You can restore it for 30 days.',
  tone: 'success',
  action: { label: 'Undo', onClick: restore },
});`}
        api={TOAST_API}
      >
        <Example title="Publish a toast" layout="stack">
          <div className="demo-row">
            <Button
              variant="secondary"
              onClick={() => toast({ title: 'Saved', description: 'Your changes are live.' })}
            >
              Neutral
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: 'Project archived',
                  description: 'You can restore it for 30 days.',
                  tone: 'success',
                  action: { label: 'Undo', onClick: () => toast({ title: 'Restored', tone: 'info' }) },
                })
              }
            >
              Success + action
            </Button>
            <Button
              variant="secondary"
              onClick={() => toast({ title: 'Quota almost reached', tone: 'warning' })}
            >
              Warning
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                toast({
                  title: 'Could not reach the server',
                  description: 'Retrying in the background.',
                  tone: 'danger',
                  duration: 0,
                })
              }
            >
              Danger (sticky)
            </Button>
            <Button variant="ghost" onClick={dismissAll}>
              Dismiss all
            </Button>
          </div>
          <span className="demo-example-note">
            The queue keeps the four most recent toasts; warning and danger are announced
            assertively.
          </span>
        </Example>
      </ComponentDoc>
    </Section>
  );
}
