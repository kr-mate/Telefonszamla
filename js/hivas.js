"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hivas {
    constructor(ido, szam) {
        this.osszIdo = [];
        this.telefonszam = "39";
        this.telefonszam = szam;
        const spliteltIdo = ido.split(" ");
        for (let i = 0; i < 6; i++)
            this.osszIdo[i] = parseInt(spliteltIdo[i]);
    }
    Mobilszam() {
        if (this.telefonszam.substring(0, 2) === "39" ||
            this.telefonszam.substring(0, 2) === "41" ||
            this.telefonszam.substring(0, 2) === "71")
            return true;
        else
            return false;
    }
    HosszMPercben() {
        return (this.osszIdo[3] - this.osszIdo[0]) * 3600 + (this.osszIdo[4] - this.osszIdo[1]) * 60 + this.osszIdo[5] - this.osszIdo[2];
    }
    KiszamlazottPercek() {
        let retrunErtek = parseInt((this.HosszMPercben() / 60) + "");
        if (this.HosszMPercben() % 60 !== 0)
            retrunErtek = retrunErtek + 1;
        return retrunErtek;
    }
    CsucsIdo() {
        if (this.osszIdo[0] >= 7 && this.osszIdo[0] < 18)
            return true;
        else
            return false;
    }
}
exports.Hivas = Hivas;
//# sourceMappingURL=hivas.js.map