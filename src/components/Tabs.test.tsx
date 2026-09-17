import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import { Accordion, AccordionItem } from './Accordion';

function TabsHarness() {
  return (
    <Tabs defaultValue="overview">
      <TabList label="Project sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings" disabled>
          Settings
        </Tab>
      </TabList>
      <TabPanel value="overview">Overview panel</TabPanel>
      <TabPanel value="activity">Activity panel</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('selects with a click and wires aria relationships', async () => {
    render(<TabsHarness />);
    expect(screen.getByText('Overview panel')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Activity' }));

    const activity = screen.getByRole('tab', { name: 'Activity' });
    expect(activity).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', activity.id);
    expect(screen.queryByText('Overview panel')).not.toBeInTheDocument();
  });

  it('moves selection with arrow keys, skipping disabled tabs', async () => {
    render(<TabsHarness />);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });
});

describe('Accordion', () => {
  it('opens one item at a time in single mode', async () => {
    render(
      <Accordion type="single" defaultValue={['billing']}>
        <AccordionItem value="billing" title="Billing">
          Billing content
        </AccordionItem>
        <AccordionItem value="security" title="Security">
          Security content
        </AccordionItem>
      </Accordion>,
    );

    const billing = screen.getByRole('button', { name: 'Billing' });
    const security = screen.getByRole('button', { name: 'Security' });
    expect(billing).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(security);
    expect(security).toHaveAttribute('aria-expanded', 'true');
    expect(billing).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(security);
    expect(security).toHaveAttribute('aria-expanded', 'false');
  });
});
