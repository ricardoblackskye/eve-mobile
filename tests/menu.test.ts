import { getMenuItems } from '../src/app/menu';

describe('getMenuItems', () => {
  it('exposes a Home link and a Dark Factory link (the menu available on all pages)', () => {
    const items = getMenuItems();
    const labels = items.map((i) => i.label);
    expect(labels).toContain('Home');
    expect(labels).toContain('Dark Factory');
  });

  it('returns items with label + href', () => {
    const items = getMenuItems();
    for (const item of items) {
      expect(typeof item.label).toBe('string');
      expect(typeof item.href).toBe('string');
    }
  });
});
