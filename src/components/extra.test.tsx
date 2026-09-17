import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from './NumberField';
import { FileField } from './FileField';
import { List, ListItem } from './List';
import { Link } from './Link';

describe('NumberField', () => {
  it('steps within min and max', async () => {
    render(<NumberField label="Quantity" defaultValue={1} min={0} max={3} />);
    const input = screen.getByLabelText('Quantity');
    expect(input).toHaveValue(1);

    await userEvent.click(screen.getByRole('button', { name: 'Increase' }));
    expect(input).toHaveValue(2);

    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    await userEvent.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(input).toHaveValue(0);
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });
});

describe('FileField', () => {
  it('names the drop zone from its label', () => {
    render(<FileField label="Receipt" />);
    expect(screen.getByLabelText('Receipt')).toBeInTheDocument();
  });
});

describe('List', () => {
  it('renders navigable rows as links', () => {
    render(
      <List>
        <ListItem title="Wi-Fi" href="#wifi" />
        <ListItem title="Storage" trailing="42 GB" />
      </List>,
    );
    expect(screen.getByRole('link', { name: /Wi-Fi/ })).toHaveAttribute('href', '#wifi');
    expect(screen.getByText('Storage')).toBeInTheDocument();
  });
});

describe('Link', () => {
  it('marks external destinations', () => {
    render(
      <Link href="https://www.apple.com" external>
        Learn more
      </Link>,
    );
    const link = screen.getByRole('link', { name: /Learn more/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
