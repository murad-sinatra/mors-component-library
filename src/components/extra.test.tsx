import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NumberField } from './NumberField';
import { FileField } from './FileField';
import { List, ListItem } from './List';
import { Link } from './Link';
import { Navbar, NavbarLink } from './Navbar';
import { SwatchGroup } from './Swatch';

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

describe('Navbar', () => {
  it('closes the disclosure panel after a link is activated', async () => {
    render(
      <Navbar brand="mors">
        <NavbarLink href="#/components">Components</NavbarLink>
      </Navbar>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');

    const links = screen.getAllByRole('link', { name: 'Components' });
    await userEvent.click(links[links.length - 1]!);

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('SwatchGroup', () => {
  it('reports the chosen tone', async () => {
    const onChange = vi.fn();
    render(<SwatchGroup label="Colour" value="accent" onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Accent' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Success' }));
    expect(onChange).toHaveBeenCalledWith('success');
  });
});
