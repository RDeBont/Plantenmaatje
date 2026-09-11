import { Accelerometer, Barometer, Gyroscope, LightSensor, Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { texts } from '../constants/texts';

// De sensoren die we willen controleren.
const lijst = [
  { naam: 'Accelerometer', sensor: Accelerometer },
  { naam: 'Gyroscope', sensor: Gyroscope },
  { naam: 'Magnetometer', sensor: Magnetometer },
  { naam: 'Barometer', sensor: Barometer },
  { naam: 'Lichtsensor', sensor: LightSensor },
];

export default function SensorenScreen() {
  const [resultaten, setResultaten] = useState<{ naam: string; werkt: boolean }[]>([]);

  useEffect(() => {
    async function controleerSensoren() {
      const gevonden = [];

      // Loop over alle sensoren en vraag per stuk of hij beschikbaar is.
      for (const item of lijst) {
        const werkt = await item.sensor.isAvailableAsync();
        gevonden.push({ naam: item.naam, werkt: werkt });
        console.log('Sensor', item.naam, werkt ? 'beschikbaar' : 'niet beschikbaar');
      }

      setResultaten(gevonden);
    }

    controleerSensoren();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.inhoud} style={styles.scherm}>
      <Text style={styles.titel}>{texts.sensorenTitel}</Text>
      <Text style={styles.klein}>{texts.sensorenUitleg}</Text>

      {resultaten.map((item) => (
        <View key={item.naam} style={styles.vlak}>
          <Text style={styles.vet}>{item.naam}</Text>
          <Text style={item.werkt ? styles.werkt : styles.werktNiet}>
            {item.werkt ? texts.beschikbaar : texts.nietBeschikbaar}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scherm: { backgroundColor: colors.achtergrond },
  inhoud: { padding: 24, gap: 8 },
  titel: { color: colors.tekst, fontSize: 28, fontWeight: '700' },
  klein: { color: colors.tekstZacht, fontSize: 13, marginBottom: 8 },
  vlak: {
    backgroundColor: colors.kaart,
    borderColor: colors.rand,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vet: { color: colors.tekst, fontSize: 16, fontWeight: '700' },
  werkt: { color: colors.accent, fontSize: 14 },
  werktNiet: { color: colors.tekstZacht, fontSize: 14 },
});