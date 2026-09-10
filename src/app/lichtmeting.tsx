import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/colors';
import { LightSensor } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { texts } from '../constants/texts';
import { Plant } from '../models/Plant';


export default function LichtmetingScreen() {
    const params = useLocalSearchParams();
    const plant = new Plant(String(params.naam), Number(params.dagen));

    const [lux, setLux] = useState(0);
    const [heeftLichtsensor, setHeeftLichtsensor] = useState(true);

    // Leest elke seconde de lichtsensor uit (werkt alleen op Android).
    useEffect(() => {
        async function checkSensor() {
            const beschikbaar = await LightSensor.isAvailableAsync();
            setHeeftLichtsensor(beschikbaar);
            console.log('Lichtsensor beschikbaar:', beschikbaar);
        }

        checkSensor();
        LightSensor.setUpdateInterval(1000);

        const abonnement = LightSensor.addListener((meting) => {
            setLux(Math.round(meting.illuminance));
        });

        return () => abonnement.remove();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.inhoud} style={styles.scherm}>
            <Text style={styles.titel}>{plant.naam}</Text>

            <Text style={styles.klein}>{texts.gemetenLicht}</Text>
            <Text style={styles.cijfer}>
                {lux} <Text style={styles.eenheid}>{texts.lux}</Text>
            </Text>

            {heeftLichtsensor ? (
                <>
                    <Text style={styles.advies}>{plant.advies(lux)}</Text>
                    <Text style={styles.klein}>{texts.adviesUitleg}</Text>
                </>
            ) : (
                <Text style={styles.fout}>{texts.geenLichtsensor}</Text>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scherm: { backgroundColor: colors.achtergrond },
    inhoud: { padding: 24, gap: 8 },
    titel: { color: colors.tekst, fontSize: 28, fontWeight: '700', marginBottom: 8 },
    klein: { color: colors.tekstZacht, fontSize: 13 },
    cijfer: { color: colors.tekst, fontSize: 48, fontWeight: '700' },
    eenheid: { color: colors.tekstZacht, fontSize: 16, fontWeight: '400' },
    advies: { color: colors.accent, fontSize: 20, fontWeight: '700' },
    fout: { color: colors.fout, fontSize: 14 },
});