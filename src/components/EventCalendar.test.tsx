import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCalendar } from './EventCalendar';

const june = new Date(2026, 5, 15);

describe('EventCalendar', () => {
  it('adds an event to the selected day', async () => {
    const onAdd = vi.fn();
    render(
      <EventCalendar
        defaultMonth={june}
        defaultSelectedDate={june}
        defaultEvents={[]}
        onEventAdd={onAdd}
      />,
    );

    await userEvent.type(screen.getByPlaceholderText('Event title'), 'Launch');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0]![0]).toMatchObject({ title: 'Launch' });
    expect(screen.getByRole('button', { name: 'Remove Launch' })).toBeInTheDocument();
  });

  it('removes an event from the selected day', async () => {
    const onRemove = vi.fn();
    render(
      <EventCalendar
        defaultMonth={june}
        defaultSelectedDate={june}
        defaultEvents={[{ id: '1', title: 'Stand-up', date: june, time: '09:00' }]}
        onEventRemove={onRemove}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Remove Stand-up' }));
    expect(onRemove).toHaveBeenCalledWith('1');
    expect(screen.queryByRole('button', { name: /Stand-up/ })).not.toBeInTheDocument();
  });
});
