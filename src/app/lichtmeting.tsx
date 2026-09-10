import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function LichtmetingScreen() {
  const { naam, dagen } = useLocalSearchParams();

  return (
    <View style={styles.scherm}>
      <Text style={styles.titel}>{naam}</Text>
      <Text style={styles.zacht}>Water om de {dagen} dagen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: colors.achtergrond, padding: 24, gap: 8 },
  titel: { color: colors.tekst, fontSize: 28, fontWeight: '700' },
  zacht: { color: colors.tekstZacht, fontSize: 16 },
});