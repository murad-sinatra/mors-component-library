import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchField, TextField } from './TextField';
import { Select } from './Select';
import { Checkbox, RadioGroup, Radio, Switch } from './Toggles';
import { Slider } from './Slider';
import { Menu, MenuItem } from './Menu';
import { Button } from './Button';

describe('TextField', () => {
  it('links label, description and error to the input', () => {
    render(
      <TextField label="Work email" description="We only use this for receipts." error="Required" />,
    );

    const input = screen.getByLabelText('Work email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(/We only use this for receipts\.\s*Required/);
  });

  it('shows FieldError instead of the native required tooltip', () => {
    render(<TextField label="Title" required />);
    const input = screen.getByRole('textbox', { name: /title/i });
    fireEvent.invalid(input);
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('SearchField', () => {
  it('reveals a clear button once text is entered and clears on Escape', async () => {
    function Harness() {
      const [value, setValue] = useState('');
      return (
        <SearchField
          label="Search"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onClear={() => setValue('')}
        />
      );
    }
    render(<Harness />);

    const input = screen.getByLabelText('Search');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    await userEvent.type(input, 'invoice');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });
});

describe('Select', () => {
  it('reports the chosen option', async () => {
    const onChange = vi.fn();
    render(
      <Select
        label="Plan"
        defaultValue="team"
        onChange={onChange}
        options={[
          { label: 'Solo', value: 'solo' },
          { label: 'Team', value: 'team' },
        ]}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Plan' }));
    await userEvent.click(await screen.findByRole('option', { name: 'Solo' }));
    expect(onChange).toHaveBeenCalledWith('solo');
    expect(screen.getByRole('button', { name: 'Plan' })).toHaveTextContent('Solo');
  });
});

describe('Checkbox and Switch', () => {
  it('toggles by clicking the label text', async () => {
    render(<Checkbox label="Email me updates" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Email me updates' });

    await userEvent.click(screen.getByText('Email me updates'));
    expect(checkbox).toBeChecked();
  });

  it('exposes the switch role and its description', async () => {
    render(<Switch label="Reduced motion" description="Limits animation" />);
    const control = screen.getByRole('switch', { name: 'Reduced motion' });

    expect(control).toHaveAccessibleDescription('Limits animation');
    await userEvent.click(control);
    expect(control).toBeChecked();
  });
});

describe('RadioGroup', () => {
  it('shares one name across its radios', async () => {
    render(
      <RadioGroup name="tier" legend="Support tier">
        <Radio label="Standard" value="standard" />
        <Radio label="Priority" value="priority" />
      </RadioGroup>,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'Priority' }));
    expect(screen.getByRole('radio', { name: 'Priority' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Standard' })).not.toBeChecked();
  });
});

describe('Slider', () => {
  it('reports value changes and renders the formatted value', () => {
    const onValueChange = vi.fn();
    render(
      <Slider
        label="Volume"
        defaultValue={40}
        onValueChange={onValueChange}
        formatValue={(value) => `${value}%`}
      />,
    );

    const slider = screen.getByRole('slider', { name: /Volume/ });
    expect(screen.getByText('40%')).toBeInTheDocument();

    fireEvent.change(slider, { target: { value: '75' } });

    expect(onValueChange).toHaveBeenCalledWith(75);
    expect(slider).toHaveValue('75');
    expect(slider).toHaveAttribute('aria-valuetext', '75%');
  });
});

describe('Menu', () => {
  it('opens from the keyboard, selects an item and closes', async () => {
    const onSelect = vi.fn();
    render(
      <Menu trigger={<Button>Actions</Button>} ariaLabel="Row actions">
        <MenuItem onSelect={onSelect}>Duplicate</MenuItem>
        <MenuItem disabled>Archive</MenuItem>
      </Menu>,
    );

    const trigger = screen.getByRole('button', { name: 'Actions' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');

    const duplicate = await screen.findByRole('menuitem', { name: 'Duplicate' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(duplicate);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
