const keys = require("../config/keys");
const debug = require("debug")("dataRecovery");
const db = require("../db");
const relationId = require("../assets/id_relation.json");

module.exports = (app, scrapper, linker) => {
    app.get(`${keys.API}find`, async (req, res) => {
        let word = req.query.word;

        //if (!/.*>.*:/.test(word)) word = word.toLowerCase();
        let type = req.query.type;

        debug("current word is : " + word);
        db.getWord(word, async (result) => {
            if (result != null) {
                res.send(await deleteUnnecessaryKeys(result, type));
            } else {
                scrapper.executeScrapper(word, type, async (result) => {
                    if (result.error) {
                        res.send(result);
                    } else res.send(await deleteUnnecessaryKeys(result, type));
                });
            }
        });
    });

    app.get(`${keys.API}autocomplete`, async (req, res) => {
        let word = req.query.word.toLowerCase();
        db.getSimilaireTerms(word, (result) => {
            res.send(result);
        });
    });

    app.get(`${keys.API}termRelation`, async (req, res) => {
        let word = req.query.word.toLowerCase();
        let typeRelation = req.query.type;

        db.getWord(word, (result) => {
            // word 100% in the database !
            if (result != null) {
                if (result[relationId[typeRelation]] != undefined) {
                    res.send(result[relationId[typeRelation]]);
                } else {
                    // call parser
                    scrapper.scrapRelationType(
                        word,
                        result,
                        typeRelation,
                        true,
                        true,
                        (ret) => {
                            //console.log("out relations hahhahahahah");
                            scrapper.scrapRelationType(
                                word,
                                result,
                                typeRelation,
                                true,
                                false,
                                (rt) => {
                                    // console.log("in relations hahhahahahah");
                                    res.send(rt);
                                }
                            );
                        }
                    );
                    console.log("call scrapper");
                }
                //res.send(relations);
            } else {
                console.log("doesnt existe or something");
            }
        });
        // check database
        // if not parse !
    });
};

function deleteUnnecessaryKeys(result, type) {
    return new Promise((resolve, reject) => {
        let newObj = {};
        for (let key in result) {
            if (
                key != relationId[type] &&
                key != "def" &&
                key != "word" &&
                key != "eid" &&
                key != "r_raff_sem"
            ) {
                continue;
            }
            newObj[key] = result[key];
        }
        resolve(newObj);
    });
}
