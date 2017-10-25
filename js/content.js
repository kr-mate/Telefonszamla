"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url = require("url"); // űrlapokhoz, input kiolvasás
class Content {
    Content(req, res) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.write('<body bgcolor="grey"');
        res.write("<h1>Telefonszámla.</h1>");
        res.write("<p>1. feladat: kérem írjon be egy telefonszámot!</p>"); //1. feladat
        res.write('<form type="post" name="input">');
        res.write('<input type="number" name="telefonszamInput">');
        //res.write('<input type="submit" value="Elküld">');
        //res.write("</form>");
        const userInput = url.parse(req.url, true).query;
        const telefonszamInput = userInput.telefonszamInput === undefined ? "123" : userInput.telefonszamInput;
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
        const kezdetiIdoInput = userInput.kezdetiIdoInput === undefined ? "1 2 3" : userInput.kezdetiIdoInput;
        const vegeIdoInput = userInput.vegeIdoInput === undefined ? "1 2 3" : userInput.vegeIdoInput;
        if (!(kezdetiIdoInput === "") && !(vegeIdoInput === "")) {
            let kezdetiSeged = kezdetiIdoInput.split(" ");
            let kezdetiIntSeged = [0, 0, 0];
            let vegeSeged = vegeIdoInput.split(" ");
            let vegeIntSeged = [0, 0, 0];
            for (let i = 0; i < kezdetiSeged.length; i++) {
                kezdetiIntSeged[i] = parseInt(kezdetiSeged[i]);
                vegeIntSeged[i] = parseInt(vegeSeged[i]);
            }
            let perc = (vegeIntSeged[0] * 3600 + vegeIntSeged[1] + vegeIntSeged[2] / 60) - (kezdetiIntSeged[0] * 3600 + kezdetiIntSeged[1] + kezdetiIntSeged[2] / 60);
            let ar;
            //csúcsidő 7 és 18 óra közt van
            //vezetékes számnál a díjazás:
            if (kezdetiIntSeged[0] >= 7 && kezdetiIntSeged[0] <= 18) {
                //csúcsidős a hívás
                ar = perc * 30;
            }
            else {
                //csúcsidőn kívüli
                ar = perc * 15;
            }
            res.write('' + ar);
        }
        res.write("</body>");
        res.end();
    }
}
exports.Content = Content;
//# sourceMappingURL=content.js.map