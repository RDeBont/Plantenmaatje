import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../constants/colors';
import { texts } from '../constants/texts';
import { Plant } from '../models/Plant';
import { bewaarPlant, laadPlant, wisPlant } from '../opslag/opslag';

const foto = 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=800';

export default function HomeScreen() {
  const router = useRouter();

  const [naam, setNaam] = useState('');
  const [dagen, setDagen] = useState('');
  const [plant, setPlant] = useState<Plant | null>(null);
  const [fout, setFout] = useState('');

  // Haalt de bewaarde plant terug uit de opslag.
  async function herstelPlant() {
    const bewaard = await laadPlant();
    if (bewaard === null) {
      return;
    }
    setNaam(bewaard.naam);
    setDagen(String(bewaard.dagen));
    setPlant(new Plant(bewaard.naam, bewaard.dagen));
    console.log('Plant hersteld uit opslag:', bewaard.naam);
  }

  // Bij het openen van de app en bij terugkomst uit de achtergrond.
  useEffect(() => {
    herstelPlant();

    const abonnement = AppState.addEventListener('change', (status) => {
      console.log('App-status:', status);
      if (status === 'active') {
        herstelPlant();
      }
    });

    return () => abonnement.remove();
  }, []);

  function opslaan() {
    console.log('Knop opslaan ingedrukt:', naam, dagen);

    if (naam.trim() === '') {
      setFout(texts.foutNaam);
      return;
    }

    const aantal = Number(dagen);
    if (dagen.trim() === '' || Number.isNaN(aantal) || aantal <= 0) {
      setFout(texts.foutGetal);
      return;
    }

    setFout('');
    setPlant(new Plant(naam.trim(), aantal));
    bewaarPlant(naam.trim(), aantal);
  }

  function wissen() {
    console.log('Knop wissen ingedrukt');
    setNaam('');
    setDagen('');
    setPlant(null);
    setFout('');
    wisPlant();
  }

  function naarLichtmeting() {
    if (plant === null) {
      setFout(texts.foutGeenPlant);
      return;
    }
    router.push({ pathname: '/lichtmeting', params: { naam: plant.naam, dagen: plant.dagen } });
  }

  return (
    <View style={styles.scherm}>
      <ScrollView contentContainerStyle={styles.inhoud}>
        <Image source={{ uri: foto }} style={styles.foto} contentFit="cover" />

        <Text style={styles.titel}>{texts.titel}</Text>
        <Text style={styles.ondertitel}>{texts.ondertitel}</Text>

        <Text style={styles.label}>{texts.naamLabel}</Text>
        <TextInput
          style={styles.invoer}
          value={naam}
          onChangeText={setNaam}
          placeholder={texts.naamPlaceholder}
          placeholderTextColor={colors.tekstZacht}
        />

        <Text style={styles.label}>{texts.dagenLabel}</Text>
        <TextInput
          style={styles.invoer}
          value={dagen}
          onChangeText={setDagen}
          placeholder={texts.dagenPlaceholder}
          placeholderTextColor={colors.tekstZacht}
          keyboardType="numeric"
        />

        <Pressable style={styles.knopWis} onPress={wissen}>
          <Text style={styles.knopWisTekst}>{texts.wisKnop}</Text>
        </Pressable>

        {fout !== '' && <Text style={styles.fout}>{fout}</Text>}

        <Pressable style={styles.knop} onPress={opslaan}>
          <Text style={styles.knopTekst}>{texts.opslaanKnop}</Text>
        </Pressable>

        <View style={styles.vlak}>
          <Text style={styles.klein}>{texts.resultaatLabel}</Text>
          <Text style={styles.vet}>
            {plant === null ? texts.resultaatLeeg : plant.beschrijving()}
          </Text>
          <Text style={styles.klein}>{texts.resultaatHint}</Text>
        </View>
      </ScrollView>

      <View style={styles.voet}>
        <Pressable style={styles.knop2} onPress={naarLichtmeting}>
          <Text style={styles.knop2Tekst}>{texts.lichtmetingKnop}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scherm: { flex: 1, backgroundColor: colors.achtergrond },
  inhoud: { padding: 24, gap: 8 },
  foto: { width: '100%', height: 200, borderRadius: 12 },
  titel: { color: colors.tekst, fontSize: 28, fontWeight: '700', marginTop: 8 },
  ondertitel: { color: colors.tekstZacht, fontSize: 16, marginBottom: 8 },
  label: { color: colors.tekstZacht, fontSize: 14, marginTop: 8 },
  invoer: {
    backgroundColor: colors.kaart,
    borderColor: colors.rand,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    color: colors.tekst,
    fontSize: 16,
  },
  fout: { color: colors.fout, fontSize: 14 },
  knop: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  knopTekst: { color: colors.accentTekst, fontSize: 16, fontWeight: '700' },
  vlak: {
    backgroundColor: colors.kaart,
    borderColor: colors.rand,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 4,
    marginTop: 8,
  },
  klein: { color: colors.tekstZacht, fontSize: 13 },
  vet: { color: colors.tekst, fontSize: 16, fontWeight: '700' },
  voet: { padding: 24, borderTopColor: colors.rand, borderTopWidth: 1 },
  knop2: {
    backgroundColor: colors.kaart,
    borderColor: colors.rand,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  knop2Tekst: { color: colors.tekst, fontSize: 16, fontWeight: '700' },
  knopWis: {
    borderColor: colors.rand,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  knopWisTekst: { color: colors.tekstZacht, fontSize: 14 },
});