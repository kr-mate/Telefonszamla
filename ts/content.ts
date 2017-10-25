import * as http from "http";
import * as url from "url"; // űrlapokhoz, input kiolvasás
import * as fs from "fs"; // file-kezelés
import { Hivas } from "./hivas";

export class Content {

    Content(req: http.ServerRequest, res: http.ServerResponse): void {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write('<body bgcolor="grey"');
        res.write("<h1>Telefonszámla.</h1>");

        res.write("<p>1. feladat: kérem írjon be egy telefonszámot!</p>"); //1. feladat
        res.write('<form type="post" name="input">');
        res.write('<input type="number" name="telefonszamInput">');
        //res.write('<input type="submit" value="Elküld">');
        //res.write("</form>");

        const userInput: any = url.parse(req.url, true).query;
        const telefonszamInput: string = userInput.telefonszamInput === undefined ? "123" : userInput.telefonszamInput;

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

        res.write("<p>2. feladat: kérem adjon meg egy kezdeti, és egy hívás vége időpontot!</p>"); //2. feladat

        //res.write('<form type="post" name="idoInput">');
        res.write("<table>");
        res.write('<tr><td>Kezdeti időpont: </td><td><input type="text" name="kezdetiIdoInput" placeholder="Óra Perc Mp" value="0 0 0"></td></tr>');
        res.write('<tr><td>Végső időpont vagy hogy mondjam: </td><td><input type="text" name="vegeIdoInput" placeholder="Óra Perc Mp" value="0 0 0"></tr></td>');
        res.write('<tr><td></td><td><input type="submit" value="Elküld"></td></tr>');
        res.write("</table></form>");

        const kezdetiIdoInput: string = userInput.kezdetiIdoInput === undefined ? "1 2 3" : userInput.kezdetiIdoInput;
        const vegeIdoInput: string = userInput.vegeIdoInput === undefined ? "1 2 3" : userInput.vegeIdoInput;

        if (!(kezdetiIdoInput === "") && !(vegeIdoInput === "")) {

            let ar: number;
            //csúcsidő 7 és 18 óra közt van
            //vezetékes számnál a díjazás:

            let mostaniHivas: Hivas = new Hivas(kezdetiIdoInput, vegeIdoInput, telefonszamInput);

            if (mostaniHivas.Mobilszam() == true) {
                if (parseInt(kezdetiIdoInput.substring(0, 1)) >= 7 && parseInt(kezdetiIdoInput.substring(0, 1)) <= 18)
                    ar = mostaniHivas.HosszPercben() * 69.175;  //csúcsidős a hívás
                else ar = mostaniHivas.HosszPercben() * 46.675; //csúcsidőn kívüli
            }
            else {//Ha vezetékes
                if (parseInt(kezdetiIdoInput.substring(0, 1)) >= 7 && parseInt(kezdetiIdoInput.substring(0, 1)) <= 18)
                    ar = mostaniHivas.HosszPercben() * 30;  //csúcsidős a hívás
                else ar = mostaniHivas.HosszPercben() * 15; //csúcsidőn kívüli
            }
            res.write("A hívás ára: " + ar);
        }

        res.write("<p>3. feladat:</p>");

        const sorok: string[] = fs.readFileSync("hivasok.txt").toString().split("\r\n");

        const ws: fs.WriteStream = fs.createWriteStream("percek.txt");

        let kiirando: string;

        let Hivasok: Hivas[];

        for (let i: number = 0; i < sorok.length; i++){
            let aktHivas: Hivas = new Hivas(sorok[i].substring(0, 4), sorok[i].substring(5, 9), sorok[i + 1]); //ez it lehet hogy kiindexel i+1-nél! //substringeknél baj lehet, mert nem biztos hogy úgy számol!
            Hivasok.push(aktHivas);

            kiirando = '' + Hivasok[i].KiszamlazottPercek + ' ' + Hivasok[i].telefonszam;
        }

        for (let i: number; i < Hivasok.length; i++) ws.write(kiirando);
        
        res.write("<p>3. feladat kész!</p>");

        res.write("<p>4. feladat:</p>");

        let dbCsucsido: number = 0;
        let dbNemCsucsido: number = 0;

        for (let i: number = 0; i < sorok.length; i++) {
            let seged: string[] = sorok[i].split(" ");
            if (parseInt(seged[0]) >= 7 && parseInt(seged[0]) <= 18) dbCsucsido++;
            else dbNemCsucsido++;
            i++;
        }

        res.write("<p>Csúcsidőbeli hívások száma: " + dbCsucsido + "</p>");
        res.write("<p>Nem csúcsidőbeli hívások száma: " + dbNemCsucsido + "</p>");

        res.write("<p>5. feladat:</p>");

        let osszMobilszamPerc: number = 0;
        let osszVezetkesesPerc: number = 0;

        for (let i: number = 0; i < sorok.length; i++) {
            let aktualisHivas: Hivas = new Hivas("0 0 0", "0 0 0", sorok[i + 1]);
            if (aktualisHivas.Mobilszam() == true)
                osszMobilszamPerc = osszMobilszamPerc + aktualisHivas.HosszPercben();
            else osszVezetkesesPerc = osszVezetkesesPerc + aktualisHivas.HosszPercben();
        }

        res.write("<p>Mobilszámmon beszélgetett percek: " + osszMobilszamPerc + "</p>");
        res.write("<p>Vezetékes számon beszélgetett percek: " + osszVezetkesesPerc + "</p>");

        res.write("</body>");
        res.end();
    }
}
