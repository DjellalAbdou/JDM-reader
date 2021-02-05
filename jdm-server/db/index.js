//const debug = require("debug")("db");
const keys = require("../config/keys");
const mongoose = require("mongoose");
var db;

require("../models/Term");
require("../models/Words");

db = mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection
    .once("open", () => {
        //debug("connection opened");
        db = mongoose.connection.db;
    })
    .on("error", (err) => {
        //debug("mongo connection error");
        console.log(err);
    });

module.exports = {
    getSimilaireTerms: async function (_term, _cb) {
        //debug("Getting similare terms for " + _term);
        let exactArray = null;
        await db.collection("terms").findOne({ term: _term }, (err, res) => {
            console.log(res);
            if (res != null) exactArray = [res];
            db.collection("terms")
                .find({ term: { $regex: ".*" + _term + ".*" } })
                .limit(res != null ? 4 : 5)
                .toArray((err, documents) => {
                    if (exactArray != null)
                        documents = exactArray.concat(documents);
                    console.log(exactArray);
                    _cb(documents);
                });
        });
    },

    save: function (termData) {
        //debug("saving term : " + termData.word + " to database");
        db.collection("words").save(termData);
    },

    getWord: function (_word, _cb) {
        //debug("getting word " + _word + " from database");
        db.collection("words").findOne({ word: _word }, (err, res) => {
            _cb(res);
        });
    },

    updateWord: async function (_word, _attr, _value, _cb) {
        //debug("updating element");
        let update = { $set: {} };
        update.$set[_attr] = _value;
        let result = await db
            .collection("words")
            .updateOne({ word: _word }, update);
        _cb(_value);
    },

    /*getWordRelation: function (_word, _relation, _cb) {
        debug("getting word " + _word + " relation from database");
        db.collection("words").findOne(
            { word: _word, relations: { $elemMatch: { rtid: _relation } } },
            (err, res) => {
                _cb(res);
            }
        );
    },*/
};
