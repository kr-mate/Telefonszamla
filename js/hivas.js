"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Hivas {
    constructor(ctrido, szam) {
        let idok = ctrido.split(" ");
        for (let i = 0; i < 6; i++) {
            this.ido[i] = parseInt(idok[i]);
            this.telefonszam = szam;
        }
    }
    MobilszamE() {
        if (this.telefonszam.substring(0, 2) === "39" ||
            this.telefonszam.substring(0, 2) === "41" ||
            this.telefonszam.substring(0, 2) === "71") {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Hivas = Hivas;
//# sourceMappingURL=hivas.js.map