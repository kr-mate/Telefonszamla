import * as http from "http";
import * as url from "url"; // űrlapokhoz, input kiolvasás
import * as fs from "fs"; // file-kezelés
import { Hivas } from "./hivas";

export class Content {

    Content(req: http.ServerRequest, res: http.ServerResponse): void {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write("<head><title>szamla</title></head>");
        res.write("<body><pre style='font- family: Courier; font-size: 18px; " + "background: LightGray'>");
        res.write("<h2>Telefonszámla (szamla):</h2>");

        // 1. feladat:

        res.write("<p>1. feladat:</p>");
        res.write('<form type="post" name="input">');
        res.write('<p>Kérem, adjon meg egy telefonszámot: <input type="number" name="telefonszamInput" placeholder="Pl. 392712621"></p>');

        const userInput: any = url.parse(req.url, true).query;
        const telefonszamInput: string = userInput.telefonszamInput === undefined ? "" : userInput.telefonszamInput;

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

        res.write("<p>2. feladat:</p>");

        res.write('<table style="font-size: 18px">');
        res.write("<p>Kérem adja meg a hívás kezdetének, illetve befejezésének időpontját:</p>");
        res.write('<tr><td>Hívás kezdete: </td><td><input type="text" name="kezdetiIdoInput" placeholder="Óra Perc Mp"></td></tr>');
        res.write('<tr><td>Hívás vége: </td><td><input type="text" name="vegeIdoInput" placeholder="Óra Perc Mp"></tr></td>');
        res.write('<tr><td></td><td><input type="submit" value="Elküld"></td></tr>');
        res.write("</table></form>");

        const kezdetiIdoInput: string = userInput.kezdetiIdoInput === undefined ? "" : userInput.kezdetiIdoInput;
        const vegeIdoInput: string = userInput.vegeIdoInput === undefined ? "" : userInput.vegeIdoInput;

        if (kezdetiIdoInput !== "" && vegeIdoInput !== "") {

            const mostaniHivas: Hivas = new Hivas(kezdetiIdoInput + " " + vegeIdoInput, telefonszamInput);

            res.write("<p>A hívás hossza: " + mostaniHivas.KiszamlazottPercek() + " perc.</p>");
        }

        // 3. feladat:

        const sorok: string[] = fs.readFileSync("hivasok.txt").toString().split("\r\n");

        const ws: fs.WriteStream = fs.createWriteStream("percek.txt");

        let kiirando: string = "";

        const Hivasok: Hivas[] = [];

        let Ido: string = "";
        let Szam: string = "";

        for (let i: number = 0; i < sorok.length; i = i + 2) Ido = Ido + sorok[i] + ".";

        for (let i: number = 1; i < sorok.length; i = i + 2) Szam = Szam + sorok[i] + ".";

        const Idok: string[] = Ido.split(".");
        const Szamok: string[] = Szam.split(".");


        for (let i: number = 0; i < Idok.length - 1; i++) {
            const aktHivas: Hivas = new Hivas(Idok[i], Szamok[i]);
            Hivasok.push(aktHivas);
        }

        for (let i: number = 0; i < Hivasok.length; i++) {
            kiirando = "" + Hivasok[i].KiszamlazottPercek() + " " + Hivasok[i].telefonszam;
            ws.write(kiirando + "\r\n");
        }

        // 4. feladat:

        res.write("<p>4. feladat:</p>");

        let dbCsucsido: number = 0;
        let dbNemCsucsido: number = 0;

        for (let i: number = 0; i < Hivasok.length; i++) {
            if (Hivasok[i].CsucsIdo() === true) dbCsucsido++;
            else  dbNemCsucsido++;
        }

        res.write("<p>Csúcsidőben kezdett hívások száma: " + dbCsucsido + ".</p>");
        res.write("<p>Csúcsidőn kívül kezdett hívások száma: " + dbNemCsucsido + ".</p>");

        // 5. feladat:

        res.write("<p>5. feladat:</p>");

        let osszMobilszamPerc: number = 0;
        let osszVezetkesesPerc: number = 0;

        for (let i: number = 0; i < Hivasok.length; i++) {
            if (Hivasok[i].Mobilszam() === true) osszMobilszamPerc = osszMobilszamPerc + Hivasok[i].KiszamlazottPercek();
            else osszVezetkesesPerc = osszVezetkesesPerc + Hivasok[i].KiszamlazottPercek();
        }

        res.write("<p>Mobilszámon beszélgetett percek: " + osszMobilszamPerc + " perc.</p>");
        res.write("<p>Vezetékes számon beszélgetett percek: " + osszVezetkesesPerc + " perc.</p>");

        // 6. feladat:

        res.write("<p>6. feladat:</p>");

        let csucsdijasOsszeg: number = 0;

        for (let i: number = 0; i < Hivasok.length; i++) {
            if (Hivasok[i].CsucsIdo() === true) {
                if (Hivasok[i].Mobilszam() === true) csucsdijasOsszeg = csucsdijasOsszeg + Hivasok[i].KiszamlazottPercek() * 69.175;
                else csucsdijasOsszeg = csucsdijasOsszeg + Hivasok[i].KiszamlazottPercek() * 30;
            }
        }

        res.write("<p>A csúcsidőben történt hívások összdíja: " + Math.round(csucsdijasOsszeg) + " Ft.</p>");

        res.write("</pre></body>");
        res.end();
    }
}
