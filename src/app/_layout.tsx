import { Drawer } from "expo-router/drawer";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Orbitron_500Medium,
  Orbitron_700Bold,
  useFonts,
} from "@expo-google-fonts/orbitron";
import { useEffect } from "react";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { glowText } from "../theme/glow";

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const [fontsLoaded, fontError] = useFonts({ Orbitron_500Medium, Orbitron_700Bold });
  const ready = fontsLoaded || !!fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="light" />
      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.bgTop },
          headerShadowVisible: false,
          headerTintColor: colors.accent,
          headerTitleStyle: {
            fontFamily: fonts.title,
            fontSize: 20,
            color: colors.accent,
            ...glowText(colors.accent, 8),
          },
          sceneStyle: { backgroundColor: colors.bgBottom },
          drawerStyle: {
            backgroundColor: colors.bgTop,
            borderRightWidth: 1,
            borderRightColor: colors.border,
          },
          drawerActiveTintColor: colors.accent,
          drawerActiveBackgroundColor: "rgba(56, 232, 255, 0.12)",
          drawerInactiveTintColor: colors.textMuted,
          drawerLabelStyle: { fontFamily: fonts.titleMedium, fontSize: 14 },
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Home" }} />
        <Drawer.Screen name="dark-factory/index" options={{ title: "Dark Factory" }} />
        <Drawer.Screen name="dark-factory/[id]" options={{ drawerItemStyle: { display: "none" }, title: "Run Detail" }} />
      </Drawer>
    </>
  );
}
