const axios = require("axios");
const keys = require("../config/keys");
const cheerio = require("cheerio");
const debug = require("debug")("dataRecovery");

module.exports = (app, scrapper) => {
    app.get(`${keys.API}find`, async (req, res) => {
        let word = req.query.word.toLowerCase();
        debug("current word is : " + word);

        let urlToScrap =
            keys.JDMServerPref + word + keys.JDMServerSufx + word + "&rel=";
        try {
            let rawData = await axios.get(urlToScrap, {
                responseEncoding: "binary",
            });

            let data = rawData.data;

            let $ = cheerio.load(data);
            let $code = $("CODE");
            let $def = $("def");

            let code = $code.text();
            data = scrapper.convertToUtf8(rawData);
            console.log($def.text());

            let wordObject = {
                word: word,
                eid: Number(code.split("(eid=")[1].split(")")[0]),
                def: [],
                nodes: [],
                relations: [],
            };

            let defArray = $def.text().split(/\n[0-9]+. /);
            defArray.map((elem) => {
                if (!/^\n*$/.test(elem)) {
                    wordObject.def.push(elem.trim());
                }
            });

            scrapper.scrapAllInfo(code, wordObject);
            //console.log(pageResult);
            res.send(wordObject);
        } catch (err) {
            console.log(err);
            res.send({ error: true, obj: err });
        }
    });
};
