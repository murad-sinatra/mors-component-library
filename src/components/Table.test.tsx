import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Table, type TableColumn } from './Table';

interface Row {
  id: string;
  name: string;
  seats: number;
}

const rows: Row[] = [
  { id: '1', name: 'Northwind', seats: 12 },
  { id: '2', name: 'Aperture', seats: 48 },
  { id: '3', name: 'Cyberdyne', seats: 3 },
];

const columns: TableColumn<Row>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name, sortValue: (row) => row.name },
  { id: 'seats', header: 'Seats', cell: (row) => row.seats, sortValue: (row) => row.seats },
];

function names() {
  return screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => row.querySelectorAll('td')[0]?.textContent);
}

describe('Table', () => {
  it('cycles a column through ascending, descending and unsorted', async () => {
    render(<Table columns={columns} rows={rows} rowKey={(row) => row.id} caption="Accounts" />);
    expect(names()).toEqual(['Northwind', 'Aperture', 'Cyberdyne']);

    const seats = screen.getByRole('button', { name: /Seats/ });

    await userEvent.click(seats);
    expect(names()).toEqual(['Cyberdyne', 'Northwind', 'Aperture']);
    expect(screen.getByRole('columnheader', { name: /Seats/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );

    await userEvent.click(seats);
    expect(names()).toEqual(['Aperture', 'Northwind', 'Cyberdyne']);
    expect(screen.getByRole('columnheader', { name: /Seats/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    );

    await userEvent.click(seats);
    expect(names()).toEqual(['Northwind', 'Aperture', 'Cyberdyne']);
    expect(screen.getByRole('columnheader', { name: /Seats/ })).not.toHaveAttribute('aria-sort');
  });

  it('renders the empty state when there are no rows', () => {
    render(
      <Table
        columns={columns}
        rows={[]}
        rowKey={(row) => row.id}
        caption="Accounts"
        emptyState="Nothing here yet"
      />,
    );
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });
});
