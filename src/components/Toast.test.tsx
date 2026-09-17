import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast } from './Toast';
import { Button } from './Button';

function Publisher() {
  const { toast } = useToast();
  return (
    <Button
      onClick={() =>
        toast({ title: 'Project saved', description: 'All changes are live.', duration: 0 })
      }
    >
      Save
    </Button>
  );
}

describe('ToastProvider', () => {
  it('publishes a toast and dismisses it from the close button', async () => {
    render(
      <ToastProvider>
        <Publisher />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(await screen.findByText('Project saved')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('All changes are live.');

    await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    await waitFor(() => expect(screen.queryByText('Project saved')).not.toBeInTheDocument());
  });

  it('auto-dismisses after the given duration', async () => {
    function Timed() {
      const { toast } = useToast();
      return <Button onClick={() => toast({ title: 'Copied', duration: 50 })}>Copy</Button>;
    }

    render(
      <ToastProvider>
        <Timed />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(await screen.findByText('Copied')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('Copied')).not.toBeInTheDocument());
  });
});
