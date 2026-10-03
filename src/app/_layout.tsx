import { Drawer } from "expo-router/drawer";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Drawer screenOptions={{ headerShown: true }}>
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="dark-factory/index" options={{ title: "Dark Factory" }} />
      <Drawer.Screen name="dark-factory/[id]" options={{ drawerItemStyle: { display: "none" }, title: "Run Detail" }} />
    </Drawer>
  );
}


