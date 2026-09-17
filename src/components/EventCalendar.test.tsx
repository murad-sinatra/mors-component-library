import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCalendar } from './EventCalendar';

const june = new Date(2026, 5, 15);

describe('EventCalendar', () => {
  it('adds an event with a title and description', async () => {
    const onAdd = vi.fn();
    render(
      <EventCalendar
        defaultMonth={june}
        defaultSelectedDate={june}
        defaultEvents={[]}
        onEventAdd={onAdd}
      />,
    );

    expect(screen.getByLabelText('Time')).toHaveAttribute('type', 'time');
    expect(screen.getByRole('button', { name: 'Accent' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.type(screen.getByPlaceholderText('Event title'), 'Launch');
    await userEvent.type(screen.getByPlaceholderText('Optional note'), 'Ship notes');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0]![0]).toMatchObject({ title: 'Launch', description: 'Ship notes' });
    expect(screen.getByRole('button', { name: 'Edit Launch' })).toBeInTheDocument();
  });

  it('deletes an event from the edit form', async () => {
    const onRemove = vi.fn();
    render(
      <EventCalendar
        defaultMonth={june}
        defaultSelectedDate={june}
        defaultEvents={[{ id: '1', title: 'Stand-up', date: june, time: '09:00' }]}
        onEventRemove={onRemove}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Edit Stand-up' }));
    await userEvent.click(screen.getByRole('button', { name: 'Delete Stand-up' }));
    expect(onRemove).toHaveBeenCalledWith('1');
    expect(screen.queryByText('Stand-up')).not.toBeInTheDocument();
  });
});
