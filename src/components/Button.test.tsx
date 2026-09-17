import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, ButtonGroup, IconButton } from './Button';
import { Icon } from './Icon';

describe('Button', () => {
  it('calls onClick and applies variant and size classes', async () => {
    const onClick = vi.fn();
    render(
      <Button variant="secondary" size="lg" onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('mors-button--secondary', 'mors-button--lg', 'mors-button--pill');

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('blocks interaction and reports busy state while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('IconButton', () => {
  it('names an icon-only control with its label', () => {
    render(<IconButton label="Close panel" icon={<Icon name="close" />} />);
    expect(screen.getByRole('button', { name: 'Close panel' })).toBeInTheDocument();
  });
});

describe('ButtonGroup', () => {
  it('exposes a labelled group', () => {
    render(
      <ButtonGroup label="Text alignment">
        <Button>Left</Button>
        <Button>Right</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Text alignment' })).toBeInTheDocument();
  });
});
