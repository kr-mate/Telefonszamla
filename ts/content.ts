﻿import * as http from "http";
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

        res.write("<p>2. feladat: kérem adjon meg egy kezdeti, és egy hívás vége időpontot!</p>");

        res.write("<table>");
        res.write('<tr><td>Hívás kezdete: </td><td><input type="text" name="kezdetiIdoInput" placeholder="Óra Perc Mp"></td></tr>');
        res.write('<tr><td>Hívás vége: </td><td><input type="text" name="vegeIdoInput" placeholder="Óra Perc Mp"></tr></td>');
        res.write('<tr><td></td><td><input type="submit" value="Elküld"></td></tr>');
        res.write("</table></form>");

        const kezdetiIdoInput: string = userInput.kezdetiIdoInput === undefined ? "1 2 3" : userInput.kezdetiIdoInput;
        const vegeIdoInput: string = userInput.vegeIdoInput === undefined ? "1 2 3" : userInput.vegeIdoInput;

        if (!(kezdetiIdoInput === "") && !(vegeIdoInput === "")) {

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

        for (let i: number = 0; i < sorok.length; i++) {
            Ido = Ido + sorok[i] + ".";
            i++;
        }
        for (let i: number = 1; i < sorok.length; i++) {
            Szam = Szam + sorok[i] + ".";
            i++;
        }
        let Idok: string[] = Ido.split(".");
        let Szamok: string[] = Szam.split(".");


        for (let i: number = 0; i < sorok.length; i++) {
            const aktHivas: Hivas = new Hivas(sorok[i], sorok[i + 1]);
            Hivasok.push(aktHivas);
        }

        for (let i: number = 0; i < Hivasok.length; i++) {
            kiirando = "" + Hivasok[i].KiszamlazottPercek() + " " + Hivasok[i].telefonszam;
            i++;
            ws.write(kiirando + "\r\n");
        }

        // 4. feladat:

        res.write("<p>4. feladat:</p>");

        let dbCsucsido: number = 0;
        let dbNemCsucsido: number = 0;

        for (let i: number = 0; i < sorok.length; i++) {

            const seged: string[] = sorok[i].split(" ");

            if (parseInt(seged[0]) >= 7 && parseInt(seged[0]) <= 18) dbCsucsido++;
            else dbNemCsucsido++;
            i++;

            // if (Hivasok[i].CsucsIdo() == true) dbCsucsido++;
            // else dbNemCsucsido++;
        }

        res.write("<p>Csúcsidőbeli hívások száma: " + dbCsucsido + "</p>");
        res.write("<p>Nem csúcsidőbeli hívások száma: " + dbNemCsucsido + "</p>");

        // 5. feladat:

        res.write("<p>5. feladat:</p>");

        let osszMobilszamPerc: number = 0;
        let osszVezetkesesPerc: number = 0;

        for (let i: number = 0; i < sorok.length; i = i + 2) {

            const aktualisHivas: Hivas = new Hivas(sorok[i], sorok[i + 1]);

            if (aktualisHivas.Mobilszam() === true) {
                osszMobilszamPerc = osszMobilszamPerc + aktualisHivas.HosszMPercben();
            }
            else osszVezetkesesPerc = osszVezetkesesPerc + aktualisHivas.HosszMPercben();

        }

        res.write("<p>Mobilszámon beszélgetett percek: " + osszMobilszamPerc + "</p>");
        res.write("<p>Vezetékes számon beszélgetett percek: " + osszVezetkesesPerc + "</p>");

        // 6. feladat:

        res.write("<p>6. feladat:</p>");

        let csucsdijasOsszeg: number = 0;

        for (let i: number = 0; i < Hivasok.length; i++) {

            /*let stringSeged: string[] = sorok[i].split(" ");

            if (parseInt(stringSeged[0]) >= 7 && parseInt(stringSeged[0]) <= 18) { //Amennyiben csúcsdíjas

                let aktualisHivas: Hivas = new Hivas(sorok[i], sorok[i + 1]); //lehetséges hogy ki fog indexelni

                if (aktualisHivas.Mobilszam() == true)
                    csucsdijasOsszeg = csucsdijasOsszeg + aktualisHivas.KiszamlazottPercek() * 69.175;
                else csucsdijasOsszeg = csucsdijasOsszeg + aktualisHivas.KiszamlazottPercek() * 30;
            } */

            if (Hivasok[i].CsucsIdo() === true) {
                if (Hivasok[i].Mobilszam() === true) csucsdijasOsszeg = csucsdijasOsszeg + Hivasok[i].KiszamlazottPercek() * 69.175;
                else csucsdijasOsszeg = csucsdijasOsszeg + Hivasok[i].KiszamlazottPercek() * 30;
            }
        }

        res.write("<p>A csúcsidőben beszélt percek díja: " + Math.round(csucsdijasOsszeg) + " Ft.</p>");

        res.write("</pre></body>");
        res.end();
    }
}
