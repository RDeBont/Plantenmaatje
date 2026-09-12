import AsyncStorage from '@react-native-async-storage/async-storage';

const sleutel = 'plantenmaatje-plant';

export async function bewaarPlant(naam: string, dagen: number) {
  await AsyncStorage.setItem(sleutel, JSON.stringify({ naam, dagen }));
  console.log('Plant bewaard in opslag:', naam);
}

export async function laadPlant() {
  const waarde = await AsyncStorage.getItem(sleutel);
  if (waarde === null) {
    return null;
  }
  return JSON.parse(waarde) as { naam: string; dagen: number };
}

export async function wisPlant() {
  await AsyncStorage.removeItem(sleutel);
  console.log('Plant gewist uit opslag');
}