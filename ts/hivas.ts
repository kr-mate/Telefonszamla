export class Hivas {

   osszIdo: number[] = [];
   telefonszam: string = "39";

   constructor(ido: string, szam: string) {

      this.telefonszam = szam;

      const spliteltIdo: string[] = ido.split(" ");

      for (let i: number = 0; i < 6; i++) this.osszIdo[i] = parseInt(spliteltIdo[i]);

   }

   Mobilszam(): boolean {

      if (this.telefonszam.substring(0, 2) === "39" ||
         this.telefonszam.substring(0, 2) === "41" ||
         this.telefonszam.substring(0, 2) === "71") return true;
      else  return false;
   }

   HosszMPercben(): number {
      return  (this.osszIdo[3] - this.osszIdo[0]) * 3600 + (this.osszIdo[4] - this.osszIdo[1]) * 60 + this.osszIdo[5] - this.osszIdo[2];
   }

   KiszamlazottPercek(): number {
      let retrunErtek: number = parseInt((this.HosszMPercben() / 60) + "");
      if (this.HosszMPercben() % 60 !== 0) retrunErtek = retrunErtek + 1;
      return retrunErtek;
   }

   CsucsIdo(): boolean {
      if (this.osszIdo[0] >= 7 && this.osszIdo[0] <= 18) return true;
      else return false;
   }
}