const debug = require("debug")("db");
const keys = require("../config/keys");
const mongoose = require("mongoose");
var db;

require("../models/Term");

db = mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection
    .once("open", () => {
        debug("connection opened");
        db = mongoose.connection.db;
    })
    .on("error", (err) => {
        debug("mongo connection error");
        console.log(err);
    });

module.exports = {
    getSimilaireTerms: async function (_term, _cb) {
        debug("Getting similare terms for " + _term);
        let exactArray = null;
        await db
            .collection("terms")
            .find({ term: _term })
            .toArray((err, result) => {
                if (result.length != 0) exactArray = result;
                db.collection("terms")
                    .find({ term: { $regex: ".*" + _term + ".*" } })
                    .limit(7)
                    .toArray((err, documents) => {
                        if (exactArray != null)
                            documents = exactArray.concat(documents);
                        console.log(exactArray);
                        _cb(documents);
                    });
            });
    },
};
