import { useState } from 'react';
import {
  Button,
  Checkbox,
  DatePicker,
  FileField,
  Icon,
  NumberField,
  Radio,
  RadioGroup,
  SearchField,
  Select,
  Slider,
  Switch,
  TextField,
  Textarea,
} from '../../src';
import { ComponentDoc, Example, Section, type PropRow } from '../components/Doc';

const FIELD_API: readonly PropRow[] = [
  ['label', 'ReactNode', '—', 'Rendered as a real <label> tied to the control by id.'],
  ['description', 'ReactNode', '—', 'Help text, linked with aria-describedby.'],
  ['error', 'ReactNode', '—', 'Presence switches the field to its invalid state and sets aria-invalid.'],
  ['size', "'sm' | 'md' | 'lg'", "'md'", 'Control height and type size.'],
  ['block', 'boolean', 'true', 'Full width; set false for inline layouts.'],
  ['…rest', 'native input attributes', '—', 'value, onChange, required, disabled, placeholder, …'],
];

const PLANS = [
  { label: 'Solo — 1 seat', value: 'solo' },
  { label: 'Team — up to 20 seats', value: 'team' },
  { label: 'Enterprise — unlimited', value: 'enterprise' },
  { label: 'Legacy (unavailable)', value: 'legacy', disabled: true },
];

export function FormsSection() {
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [terms, setTerms] = useState(false);
  const [volume, setVolume] = useState(35);
  const [date, setDate] = useState<Date | null>(null);
  const emailError = email.length > 0 && !email.includes('@') ? 'Enter a valid email address.' : undefined;

  return (
    <Section
      id="forms"
      title="Forms"
      description="Every control is a native input under the hood, wrapped in one shared field layout so labels, help text, error messages and aria relationships behave identically everywhere."
    >
      <ComponentDoc
        id="text-field"
        name="TextField"
        tags={['native input']}
        purpose="Single-line text entry with optional leading icon and trailing adornment. Label, description and error are wired to the input automatically, so screen readers announce the full picture."
        usage={`<TextField
  label="Work email"
  type="email"
  placeholder="you@company.com"
  description="We only use this for receipts."
  error={error}
  startIcon={<Icon name="user" />}
  value={email}
  onChange={(event) => setEmail(event.currentTarget.value)}
/>`}
        api={FIELD_API}
      >
        <Example title="States" layout="grid">
          <TextField label="Full name" placeholder="Ada Lovelace" />
          <TextField
            label="Work email"
            type="email"
            placeholder="you@company.com"
            description="We only use this for receipts."
            value={email}
            error={emailError}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />
          <TextField label="Disabled" placeholder="Read only" disabled />
          <TextField
            label="With adornments"
            defaultValue="mors"
            startIcon={<Icon name="search" />}
            endAdornment={<span>.dev</span>}
          />
        </Example>

        <Example title="Sizes" layout="grid">
          <TextField label="Small" size="sm" placeholder="32px control" />
          <TextField label="Medium" size="md" placeholder="44px control" />
          <TextField label="Large" size="lg" placeholder="48px control" />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="textarea"
        name="Textarea"
        purpose="Multi-line text with the same field shell as TextField. Resizing is vertical-only by default so a textarea can never break the surrounding layout horizontally."
        usage={`<Textarea
  label="Release notes"
  rows={4}
  resize="vertical"
  description="Markdown is supported."
/>`}
        api={[
          ['rows', 'number', '4', 'Initial visible line count.'],
          ['resize', "'none' | 'vertical'", "'vertical'", 'Resize affordance.'],
          ['…', 'see TextField', '—', 'Same label / description / error / size props.'],
        ]}
      >
        <Example title="Default and locked" layout="grid">
          <Textarea label="Release notes" description="Markdown is supported." rows={4} />
          <Textarea label="Fixed height" resize="none" rows={4} defaultValue="This one cannot be resized." />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="select"
        name="Select"
        tags={['native select']}
        purpose="A native select styled to match the rest of the library. Using the platform control means correct behaviour on touch devices, with no listbox to re-implement."
        usage={`<Select
  label="Plan"
  placeholder="Choose a plan"
  options={[
    { label: 'Solo', value: 'solo' },
    { label: 'Team', value: 'team' },
    { label: 'Legacy', value: 'legacy', disabled: true },
  ]}
/>`}
        api={[
          ['options', 'readonly SelectOption[]', '—', '{ label, value, disabled? } entries.'],
          ['placeholder', 'string', '—', 'Disabled first option shown when nothing is selected.'],
          ['…', 'see TextField', '—', 'Same field props.'],
        ]}
      >
        <Example title="Options and states" layout="grid">
          <Select label="Plan" options={PLANS} defaultValue="team" />
          <Select label="Region" options={PLANS} placeholder="Choose a region" defaultValue="" />
          <Select label="Disabled" options={PLANS} defaultValue="solo" disabled />
          <Select label="Small" size="sm" options={PLANS} defaultValue="solo" />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="search-field"
        name="SearchField"
        purpose="A TextField preset for search: leading magnifier, a clear button that appears once there is text, Enter to submit and Escape to clear."
        usage={`<SearchField
  label="Search invoices"
  value={query}
  onChange={(event) => setQuery(event.currentTarget.value)}
  onClear={() => setQuery('')}
  onSearch={(value) => runSearch(value)}
/>`}
        api={[
          ['onClear', '() => void', '—', 'Called by the clear button and by Escape.'],
          ['onSearch', '(value: string) => void', '—', 'Fires on Enter.'],
          ['clearLabel', 'string', "'Clear search'", 'Accessible name of the clear button.'],
        ]}
      >
        <Example title="Interactive" layout="stack">
          <SearchField
            label="Search invoices"
            placeholder="Try “March”"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            onClear={() => setSearch('')}
          />
          <span className="demo-example-note">
            {search ? `Filtering by “${search}” — press Escape to clear.` : 'Type to reveal the clear button.'}
          </span>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="number-field"
        name="NumberField"
        purpose="Numeric entry with plus/minus steppers. The control is a native number input, so mobile keyboards and form posts stay platform-native, and values are clamped to min/max."
        usage={`<NumberField
  label="Quantity"
  min={1}
  max={99}
  value={qty}
  onValueChange={setQty}
/>`}
        api={[
          ['value / defaultValue', 'number | null', 'null', 'Controlled or uncontrolled.'],
          ['onValueChange', '(value: number | null) => void', '—', 'Fires on type and on stepper press.'],
          ['min / max / step', 'number', '— / — / 1', 'Bounds and increment.'],
          ['hideSteppers', 'boolean', 'false', 'Keeps a plain numeric input.'],
        ]}
      >
        <Example title="Steppers and bounds" layout="grid">
          <NumberField label="Quantity" defaultValue={2} min={0} max={12} />
          <NumberField label="Without steppers" hideSteppers defaultValue={42} />
          <NumberField label="Small" size="sm" defaultValue={1} min={1} max={5} />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="file-field"
        name="FileField"
        purpose="A drop zone around a native file input. Click or drop to choose files; the real input stays in the tree so forms and screen readers keep working."
        usage={`<FileField
  label="Receipt"
  accept="image/*,.pdf"
  description="PNG, JPG or PDF up to 10 MB."
  onFilesChange={(files) => setFiles(files)}
/>`}
        api={[
          ['prompt', 'ReactNode', "'Drop files here or browse'", 'Copy shown before a file is chosen.'],
          ['onFilesChange', '(files: File[]) => void', '—', 'Called after pick or drop.'],
          ['multiple / accept', 'native file attributes', '—', 'Passed through to the input.'],
        ]}
      >
        <Example title="Drop zone" layout="grid">
          <FileField
            label="Receipt"
            accept="image/*,.pdf"
            description="PNG, JPG or PDF."
          />
          <FileField label="Disabled" disabled prompt="Uploading is turned off" />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="checkbox-radio"
        name="Checkbox · Radio · RadioGroup"
        tags={['native input']}
        purpose="Binary and single-choice controls. The visible box is decorative; the real input stays in the accessibility tree, so keyboard and screen-reader behaviour is the platform's. Descriptions sit outside the label so they never pollute the accessible name."
        usage={`<Checkbox
  label="Email me product updates"
  description="About one message a month."
  checked={value}
  onChange={(event) => setValue(event.currentTarget.checked)}
/>

<RadioGroup name="tier" legend="Support tier">
  <Radio value="standard" label="Standard" defaultChecked />
  <Radio value="priority" label="Priority" description="One hour response" />
</RadioGroup>`}
        api={[
          ['label / description / error', 'ReactNode', '—', 'Same shape as the text fields.'],
          ['indeterminate', 'boolean', 'false', 'Checkbox only — renders the mixed state.'],
          ['labelPosition', "'end' | 'start'", "'end'", 'Put the control after the label for settings rows.'],
          ['size', "'sm' | 'md'", "'md'", 'Control and text scale.'],
        ]}
      >
        <Example title="Checkbox" layout="stack">
          <Checkbox label="Default" />
          <Checkbox label="Checked" defaultChecked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="With description" description="Roughly one message a month." />
          <Checkbox label="Disabled" disabled />
          <Checkbox
            label="I accept the terms"
            error={!terms ? 'You must accept to continue.' : undefined}
            checked={terms}
            onChange={(event) => setTerms(event.currentTarget.checked)}
          />
        </Example>

        <Example title="RadioGroup" layout="grid">
          <RadioGroup name="tier" legend="Support tier">
            <Radio value="standard" label="Standard" defaultChecked />
            <Radio value="priority" label="Priority" description="One hour response, 24/7." />
            <Radio value="none" label="None" disabled />
          </RadioGroup>
          <RadioGroup name="billing" legend="Billing period" orientation="horizontal">
            <Radio value="monthly" label="Monthly" defaultChecked />
            <Radio value="yearly" label="Yearly" />
          </RadioGroup>
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="switch"
        name="Switch"
        purpose="An immediate on/off control for settings — use it when the change applies straight away, and a Checkbox when the value is submitted with a form."
        usage={`<Switch
  label="Reduced motion"
  description="Limits non-essential animation."
  labelPosition="start"
  checked={value}
  onChange={(event) => setValue(event.currentTarget.checked)}
/>`}
        api={[
          ['labelPosition', "'end' | 'start'", "'end'", "'start' produces the usual settings-row layout."],
          ['size', "'sm' | 'md'", "'md'", 'Track and thumb scale.'],
          ['…rest', 'checkbox input attributes', '—', 'checked, defaultChecked, disabled, onChange, …'],
        ]}
      >
        <Example title="Layouts and states" layout="stack">
          <Switch label="Notifications" defaultChecked />
          <Switch label="Small" size="sm" />
          <Switch
            label="Reduced motion"
            description="Limits non-essential animation."
            labelPosition="start"
          />
          <Switch label="Disabled" disabled />
          <Switch label="Disabled + on" disabled defaultChecked />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="slider"
        name="Slider"
        tags={['native range']}
        purpose="A range input for values where the approximate position matters more than the exact number. The fill is drawn from a CSS custom property, so the whole control stays a native range for keyboard and touch."
        usage={`<Slider
  label="Volume"
  min={0}
  max={100}
  step={5}
  value={volume}
  onValueChange={setVolume}
  formatValue={(value) => \`\${value}%\`}
/>`}
        api={[
          ['value / defaultValue', 'number', 'min', 'Controlled or uncontrolled.'],
          ['onValueChange', '(value: number) => void', '—', 'Receives the parsed number.'],
          ['min / max / step', 'number', '0 / 100 / 1', 'Standard range bounds.'],
          ['showValue', 'boolean', 'false', 'Prints the value beside the label.'],
          ['formatValue', '(value: number) => string', '—', 'Also used for aria-valuetext.'],
        ]}
      >
        <Example title="Interactive" layout="stack">
          <Slider
            label="Volume"
            value={volume}
            onValueChange={setVolume}
            formatValue={(value) => `${value}%`}
          />
          <Slider label="Steps of 10" defaultValue={40} step={10} showValue />
          <Slider label="Small" size="sm" defaultValue={70} showValue />
          <Slider label="Disabled" defaultValue={20} disabled showValue />
        </Example>
      </ComponentDoc>

      <ComponentDoc
        id="date-picker"
        name="DatePicker"
        purpose="A button-triggered date field: the trigger shows the formatted value, the popover holds a keyboard-navigable Calendar, and because there is no free-text input the value is always a valid date."
        usage={`<DatePicker
  label="Start date"
  value={date}
  onChange={setDate}
  min={new Date()}
  clearable
/>`}
        api={[
          ['value / defaultValue', 'Date | null', 'null', 'Controlled or uncontrolled.'],
          ['onChange', '(date: Date | null) => void', '—', 'Fires on selection and on clear.'],
          ['min / max', 'Date', '—', 'Outside dates are disabled in the grid.'],
          ['formatOptions', 'Intl.DateTimeFormatOptions', "{ dateStyle: 'medium' }", 'Trigger label formatting.'],
          ['clearable', 'boolean', 'false', 'Adds a clear action inside the popover.'],
        ]}
      >
        <Example title="Interactive" layout="grid">
          <DatePicker label="Start date" value={date} onChange={setDate} clearable />
          <DatePicker
            label="Delivery (future dates only)"
            min={new Date()}
            description="Weekends included."
          />
          <DatePicker label="Disabled" disabled />
        </Example>
        <Example title="Selected value">
          <span className="demo-example-note">
            {date ? date.toDateString() : 'Nothing selected yet.'}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setDate(new Date())}>
            Set to today
          </Button>
        </Example>
      </ComponentDoc>
    </Section>
  );
}
