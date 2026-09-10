import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import { texts } from '../constants/texts';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.achtergrond },
          headerTintColor: colors.tekst,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.achtergrond },
        }}>
        <Stack.Screen name="index" options={{ title: texts.appNaam }} />
        <Stack.Screen name="lichtmeting" options={{ title: texts.lichtmetingTitel }} />
      </Stack>
    </>
  );
}