export class Hivas {

   osszIdo: number[];
   telefonszam: string;

   constructor(kezdetiIdo: string, vegeIdo: string, szam: string) {

      this.telefonszam = szam;
      this.osszIdo = [0, 0, 0, 0, 0, 0];

      let kIdo: string[] = kezdetiIdo.split(" ");
      let vIdo: string[] = vegeIdo.split(" ");

      for (let i: number = 0; i < 3; i++) this.osszIdo[i] = parseInt(kIdo[i]);
      for (let i: number = 3; i < 6; i++) this.osszIdo[i] = parseInt(vIdo[i]);
      
   }

   Mobilszam(): boolean {

      if (this.telefonszam.substring(0, 2) === "39" ||
         this.telefonszam.substring(0, 2) === "41" ||
         this.telefonszam.substring(0, 2) === "71") {
         return true;
      }
      else {
         return false;
      }

   }

   HosszPercben(): number {
      let perc: number = (this.osszIdo[3] * 3600 + this.osszIdo[4] + this.osszIdo[5] / 60) - (this.osszIdo[0] * 3600 + this.osszIdo[1] + this.osszIdo[2] / 60);
      return 11;
   }

   KiszamlazottPercek(): number {
      if (this.HosszPercben() < Math.round(this.HosszPercben())) return Math.round(this.HosszPercben());
      else return parseInt(this.HosszPercben().toFixed(0))+1;
   }

   /*Telefonszam(): string {
      return this.telefonszam;
   }*/
}