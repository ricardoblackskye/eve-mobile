import { Drawer } from "expo-router/drawer";

// Global Menu (drawer) available on every page. Child route files under
// src/app/ become drawer items automatically — their `options.title` sets the
// label. The menu's source of truth (and the canonical list used by tests) is
// src/app/menu.ts; add a new Run-overview page by adding a route file here AND
// an item in getMenuItems().
export default function AppLayout() {
  return <Drawer screenOptions={{ headerShown: true }} />;
}
