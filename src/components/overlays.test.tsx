import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';
import { Popover } from './Popover';
import { DatePicker } from './DatePicker';

const ANCHOR = {
  x: 200,
  y: 120,
  top: 120,
  left: 200,
  bottom: 164,
  right: 320,
  width: 120,
  height: 44,
  toJSON() {},
} as DOMRect;

describe('anchored overlays', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (
      this: HTMLElement,
    ) {
      if (this.classList.contains('mors-floating-anchor')) return ANCHOR;
      return {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        bottom: 180,
        right: 280,
        width: 280,
        height: 180,
        toJSON() {},
      } as DOMRect;
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList.contains('mors-floating-anchor') ? 120 : 280;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        return (this as HTMLElement).classList.contains('mors-floating-anchor') ? 44 : 180;
      },
    });
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1280);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('places a popover under its trigger instead of the viewport origin', async () => {
    render(
      <Popover trigger={<Button>Share</Button>} ariaLabel="Share options">
        Copied link
      </Popover>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Share' }));
    const panel = await screen.findByRole('dialog', { name: 'Share options' });

    expect(panel.style.position).toBe('fixed');
    expect(Number.parseFloat(panel.style.top)).toBe(172);
    expect(Number.parseFloat(panel.style.left)).toBeGreaterThan(8);
    expect(panel.style.left).not.toBe('0px');
  });

  it('places the date picker calendar against the field', async () => {
    render(<DatePicker label="Start date" />);

    await userEvent.click(screen.getByRole('button', { name: 'Start date' }));
    const panel = await screen.findByRole('dialog', { name: 'Start date' });

    expect(Number.parseFloat(panel.style.top)).toBe(172);
    expect(Number.parseFloat(panel.style.left)).toBe(200);
  });
});
