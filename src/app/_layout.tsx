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
      <Drawer.Screen name="dark-factory" options={{ title: "Dark Factory" }} />
      <Drawer.Screen name="menu" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="ChatScreen" options={{ drawerItemStyle: { display: "none" } }} />
      <Drawer.Screen name="dark-factory/mockData" options={{ drawerItemStyle: { display: "none" } }} />
    </Drawer>
  );
}


