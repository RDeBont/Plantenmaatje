import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { Accelerometer, LightSensor } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { texts } from '../constants/texts';
import { Plant } from '../models/Plant';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

// Vaste marker: een tuincentrum in de buurt.
const tuincentrum = { latitude: 51.516219, longitude: 4.276987 };
const infoUrl = 'https://www.intratuinhalsteren.nl/';

export default function LichtmetingScreen() {
    const params = useLocalSearchParams();
    const plant = new Plant(String(params.naam), Number(params.dagen));

    const [lux, setLux] = useState(0);
    const [heeftLichtsensor, setHeeftLichtsensor] = useState(true);
    const [beweegt, setBeweegt] = useState(false);
    const [locatie, setLocatie] = useState<Location.LocationObjectCoords | null>(null);
    const [locatieFout, setLocatieFout] = useState('');

    // Leest elke seconde de lichtsensor uit (werkt alleen op Android).
    // Dit stuk is door ai gemaakt want ik liep er maar tegen aan dat als een telefoon geen ligt senor had dat je niet treug mog naar home screen ai heeft 
    // hele blok opnieuw geschreven en het werkt nu wel. Bij de oude comit kan je me oude code vinden 
    useEffect(() => {
        let abonnement: { remove: () => void } | undefined;

        async function startSensor() {
            const beschikbaar = await LightSensor.isAvailableAsync();
            setHeeftLichtsensor(beschikbaar);
            console.log('Lichtsensor beschikbaar:', beschikbaar);

            if (!beschikbaar) {
                return;
            }

            LightSensor.setUpdateInterval(1000);

            abonnement = LightSensor.addListener((meting) => {
                setLux(Math.round(meting.illuminance));
            });
        }

        startSensor();

        return () => {
            if (abonnement) {
                abonnement.remove();
            }
        };
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

    // Vraagt toestemming en haalt daarna de locatie op.
    useEffect(() => {
        async function haalLocatieOp() {
            const toestemming = await Location.requestForegroundPermissionsAsync();

            if (toestemming.status !== 'granted') {
                setLocatieFout(texts.geenToestemming);
                console.log('Locatie geweigerd door gebruiker');
                return;
            }

            const positie = await Location.getCurrentPositionAsync({});
            setLocatie(positie.coords);
            console.log('Locatie:', positie.coords.latitude, positie.coords.longitude);
        }

        haalLocatieOp();
    }, []);

    function openWebsite() {
        console.log('Website openen:', infoUrl);
        Linking.openURL(infoUrl);
    }

    const regio = {
        latitude: locatie ? locatie.latitude : tuincentrum.latitude,
        longitude: locatie ? locatie.longitude : tuincentrum.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    };

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
            <Text style={styles.klein}>{texts.locatieLabel}</Text>

            {locatieFout !== '' ? (
                <Text style={styles.fout}>{locatieFout}</Text>
            ) : (
                <MapView style={styles.kaart} region={regio} showsUserLocation={true}>
                    <Marker coordinate={tuincentrum} title="Tuincentrum" />
                </MapView>
            )}

            {locatie !== null && (
                <Text style={styles.klein}>
                    {locatie.latitude.toFixed(4)}, {locatie.longitude.toFixed(4)}
                </Text>
            )}
            <Pressable style={styles.knop} onPress={openWebsite}>
                <Text style={styles.knopTekst}>{texts.meerInfoKnop}</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    kaart: { width: '100%', height: 220, borderRadius: 12 },
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
    knop: {
        backgroundColor: colors.accent,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    knopTekst: { color: colors.accentTekst, fontSize: 16, fontWeight: '700' },
});