import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';
import { Button } from './Button';

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Delete project" footer={<Button>Confirm</Button>}>
        This cannot be undone.
      </Modal>
    </>
  );
}

describe('Modal', () => {
  it('traps focus, closes on Escape and restores focus to the trigger', async () => {
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });

    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Delete project' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('labels the dialog from its title and renders its footer', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(await screen.findByRole('heading', { name: 'Delete project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
