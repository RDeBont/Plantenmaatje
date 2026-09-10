export class Plant {
  naam: string;
  dagen: number;
  minLux: number;
  maxLux: number;
  isBinnenplant: boolean;

  constructor(naam: string, dagen: number) {
    this.naam = naam;
    this.dagen = dagen;
    this.minLux = 200;
    this.maxLux = 10000;
    this.isBinnenplant = true;
  }

  heeftGenoegLicht(lux: number) {
    return lux >= this.minLux && !(lux > this.maxLux);
  }

  advies(lux: number) {
    if (lux < this.minLux && this.isBinnenplant) {
      return 'Te donker';
    } else if (lux > this.maxLux || !this.isBinnenplant) {
      return 'Te fel';
    } else {
      return 'Prima plek';
    }
  }

  beschrijving() {
    return this.naam + ' — water om de ' + this.dagen + ' dagen';
  }
}