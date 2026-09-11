import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { Accelerometer, LightSensor } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { texts } from '../constants/texts';
import { Plant } from '../models/Plant';


export default function LichtmetingScreen() {
    const params = useLocalSearchParams();
    const plant = new Plant(String(params.naam), Number(params.dagen));

    const [lux, setLux] = useState(0);
    const [heeftLichtsensor, setHeeftLichtsensor] = useState(true);
    const [beweegt, setBeweegt] = useState(false);

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

    // Kijkt of de telefoon beweegt of stilligt.
    useEffect(() => {
        Accelerometer.setUpdateInterval(500);

        const abonnement = Accelerometer.addListener((meting) => {
            const kracht = Math.sqrt(meting.x * meting.x + meting.y * meting.y + meting.z * meting.z);
            setBeweegt(kracht > 1.2 || kracht < 0.8);
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

            <View style={styles.vlak}>
                <View>
                    <Text style={styles.klein}>{texts.sensorLabel}</Text>
                    <Text style={styles.vet}>{beweegt ? texts.sensorBeweegt : texts.sensorStil}</Text>
                </View>
                <View style={styles.bolletje} />
            </View>
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
    vlak: {
        backgroundColor: colors.kaart,
        borderColor: colors.rand,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    vet: { color: colors.tekst, fontSize: 16, fontWeight: '700' },
    bolletje: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.accent },
});