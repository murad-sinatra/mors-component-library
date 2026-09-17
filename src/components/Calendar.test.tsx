import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calendar } from './Calendar';

const june = new Date(2026, 5, 15);

describe('Calendar', () => {
  it('selects a day and marks it as selected', async () => {
    const onChange = vi.fn();
    render(<Calendar defaultMonth={june} onChange={onChange} locale="en-GB" />);

    await userEvent.click(screen.getByRole('button', { name: /15 June 2026/ }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]![0]).toBeInstanceOf(Date);
    expect(screen.getByRole('button', { name: /15 June 2026/ })).toHaveClass(
      'mors-calendar-day--selected',
    );
  });

  it('moves focus with arrow keys and pages months', async () => {
    render(<Calendar value={june} defaultMonth={june} locale="en-GB" />);

    const selected = screen.getByRole('button', { name: /15 June 2026/ });
    selected.focus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: /16 June 2026/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('button', { name: /23 June 2026/ })).toHaveFocus();

    await userEvent.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByText('July 2026')).toBeInTheDocument();
  });

  it('disables dates outside the allowed range', () => {
    render(<Calendar defaultMonth={june} min={new Date(2026, 5, 10)} locale="en-GB" />);
    expect(screen.getByRole('button', { name: /\b9 June 2026/ })).toBeDisabled();
    expect(screen.getByRole('button', { name: /\b10 June 2026/ })).toBeEnabled();
  });
});
