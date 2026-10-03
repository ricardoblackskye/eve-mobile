export interface MenuItem {
  label: string;
  href: string;
}

// Source of truth for the global Menu (drawer) that is available on every page.
// To add another Run-overview page later: append an item here AND add the
// matching route file under src/app/ (e.g. src/app/runs/[id].tsx).
export function getMenuItems(): MenuItem[] {
  return [
    { label: 'Home', href: '/' },
    { label: 'Dark Factory', href: '/dark-factory' },
  ];
}
