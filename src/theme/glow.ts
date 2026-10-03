import type { TextStyle, ViewStyle } from 'react-native';

// Neon glow helpers. textShadow / boxShadow are supported by the RN New Architecture.
export function glowText(color: string, radius = 10): TextStyle {
  return {
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: radius,
  };
}

export function glowBox(color: string, radius = 12): ViewStyle {
  return {
    borderColor: color,
    boxShadow: `0 0 ${radius}px ${color}`,
  };
}
