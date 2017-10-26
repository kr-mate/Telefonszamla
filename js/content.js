"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url"); // űrlapokhoz, input kiolvasás
const fs = require("fs"); // file-kezelés
const hivas_1 = require("./hivas");
class Content {
    Content(req, res) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<head><title>szamla</title></head>");
        res.write("<body><pre style='font- family: Courier; font-size: 18px; " + "background: LightGray'>");
        res.write("<h2>Telefonszámla (szamla):</h2>");
        // 1. feladat:
        res.write("<p>1. feladat:</p>");
        res.write('<form type="post" name="input">');
        res.write('<p>Kérem, adjon meg egy telefonszámot: <input type="number" name="telefonszamInput" placeholder="Pl. 392712621"></p>');
        const userInput = url.parse(req.url, true).query;
        const telefonszamInput = userInput.telefonszamInput === undefined ? "" : userInput.telefonszamInput;
        if (!(telefonszamInput === "")) {
            if (telefonszamInput.substring(0, 2) === "39" ||
                telefonszamInput.substring(0, 2) === "41" ||
                telefonszamInput.substring(0, 2) === "71") {
                res.write("<p>A beírt telefonszám mobilszám.</p>");
            }
            else {
                res.write("<p>A beírt telefonszám vezetékes készülékhez tartozik.</p>");
            }
        }
        // 2. feladat:
        res.write("<p>2. feladat: kérem adjon meg egy kezdeti, és egy hívás vége időpontot!</p>");
        res.write("<table>");
        res.write('<tr><td>Hívás kezdete: </td><td><input type="text" name="kezdetiIdoInput" placeholder="Óra Perc Mp"></td></tr>');
        res.write('<tr><td>Hívás vége: </td><td><input type="text" name="vegeIdoInput" placeholder="Óra Perc Mp"></tr></td>');
        res.write('<tr><td></td><td><input type="submit" value="Elküld"></td></tr>');
        res.write("</table></form>");
        const kezdetiIdoInput = userInput.kezdetiIdoInput === undefined ? "1 2 3" : userInput.kezdetiIdoInput;
        const vegeIdoInput = userInput.vegeIdoInput === undefined ? "1 2 3" : userInput.vegeIdoInput;
        if (!(kezdetiIdoInput === "") && !(vegeIdoInput === "")) {
            const mostaniHivas = new hivas_1.Hivas(kezdetiIdoInput + " " + vegeIdoInput, telefonszamInput);
            res.write("<p>A hívás hossza: " + mostaniHivas.KiszamlazottPercek() + " perc.</p>");
        }
        // 3. feladat:
        const sorok = fs.readFileSync("hivasok.txt").toString().split("\r\n");
        const ws = fs.createWriteStream("percek.txt");
        let kiirando = "";
        const Hivasok = [];
        for (let i = 0; i < sorok.length; i++) {
            const aktHivas = new hivas_1.Hivas(sorok[i], sorok[i + 1]);
            Hivasok.push(aktHivas);
        }
        for (let i = 0; i < Hivasok.length; i++) {
            kiirando = "" + Hivasok[i].KiszamlazottPercek() + " " + Hivasok[i].telefonszam;
            i++;
            ws.write(kiirando + "\r\n");
        }
        // 4. feladat:
        res.write("<p>4. feladat:</p>");
        let dbCsucsido = 0;
        let dbNemCsucsido = 0;
        for (let i = 0; i < sorok.length; i++) {
            const seged = sorok[i].split(" ");
            if (parseInt(seged[0]) >= 7 && parseInt(seged[0]) <= 18)
                dbCsucsido++;
            else
                dbNemCsucsido++;
            i++;
            // if (Hivasok[i].CsucsIdo() == true) dbCsucsido++;
            // else dbNemCsucsido++;
        }
        res.write("<p>Csúcsidőbeli hívások száma: " + dbCsucsido + "</p>");
        res.write("<p>Nem csúcsidőbeli hívások száma: " + dbNemCsucsido + "</p>");
        // 5. feladat:
        res.write("<p>5. feladat:</p>");
        let osszMobilszamPerc = 0;
        let osszVezetkesesPerc = 0;
        for (let i = 0; i < sorok.length; i = i + 2) {
            const aktualisHivas = new hivas_1.Hivas(sorok[i], sorok[i + 1]);
            if (aktualisHivas.Mobilszam() === true) {
                osszMobilszamPerc = osszMobilszamPerc + aktualisHivas.HosszMPercben();
            }
            else
                osszVezetkesesPerc = osszVezetkesesPerc + aktualisHivas.HosszMPercben();
        }
        res.write("<p>Mobilszámon beszélgetett percek: " + osszMobilszamPerc + "</p>");
        res.write("<p>Vezetékes számon beszélgetett percek: " + osszVezetkesesPerc + "</p>");
        // 6. feladat:
        res.write("<p>6. feladat:</p>");
        let csucsdijasOsszeg = 0;
        for (let i = 0; i < Hivasok.length; i++) {
            /*let stringSeged: string[] = sorok[i].split(" ");

            if (parseInt(stringSeged[0]) >= 7 && parseInt(stringSeged[0]) <= 18) { //Amennyiben csúcsdíjas

                let aktualisHivas: Hivas = new Hivas(sorok[i], sorok[i + 1]); //lehetséges hogy ki fog indexelni

                if (aktualisHivas.Mobilszam() == true)
                    csucsdijasOsszeg = csucsdijasOsszeg + aktualisHivas.KiszamlazottPercek() * 69.175;
                else csucsdijasOsszeg = csucsdijasOsszeg + aktualisHivas.KiszamlazottPercek() * 30;
            } */
            if (Hivasok[i].CsucsIdo() === true) {
                if (Hivasok[i].Mobilszam() === true)
                    csucsdijasOsszeg = csucsdijasOsszeg + Hivasok[i].KiszamlazottPercek() * 69.175;
                else
                    csucsdijasOsszeg = csucsdijasOsszeg + Hivasok[i].KiszamlazottPercek() * 30;
            }
        }
        res.write("<p>A csúcsidőben beszélt percek díja: " + Math.round(csucsdijasOsszeg) + " Ft.</p>");
        res.write("</pre></body>");
        res.end();
    }
}
exports.Content = Content;
//# sourceMappingURL=content.js.map