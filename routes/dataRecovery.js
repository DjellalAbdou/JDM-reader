const keys = require("../config/keys");
const debug = require("debug")("dataRecovery");
const db = require("../db");

module.exports = (app, scrapper) => {
    app.get(`${keys.API}find`, async (req, res) => {
        let word = req.query.word.toLowerCase();
        debug("current word is : " + word);
        scrapper.executeScrapper(word, (result) => {
            res.send(result);
        });
    });

    app.get(`${keys.API}autocomplete`, async (req, res) => {
        let word = req.query.word.toLowerCase();
        db.getSimilaireTerms(word, (result) => {
            res.send(result);
        });
    });

    app.get(`${keys.API}raffinement`, async (req, res) => {
        let word = req.query.word.toLowerCase();
    });
};
