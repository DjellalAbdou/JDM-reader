const fs = require("fs");
const mongoose = require("mongoose");
const Terms = mongoose.model("terms");
const jsn = require("../assets/id_relation.json");

DBGenerator = function () {
    this.addFullTerms = async function () {
        console.log(process.cwd());
        fs.readFile("./assets/termsList.txt", "utf8", (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
            let regex = /([0-9]+;[a-zA-ZÀ-ÿ-. ]+;)/gm;
            let terms = data.match(regex);
            let bulk = Terms.collection.initializeOrderedBulkOp();
            let counter = 0;

            terms.map((term) => {
                //console.log(term);
                let termDetails = term.split(";");
                bulk.insert({
                    eid: termDetails[0],
                    term: termDetails[1],
                });
                counter++;

                if (counter % 1000 == 0) {
                    bulk.execute(function (err, result) {
                        bulk = Terms.collection.initializeOrderedBulkOp();
                    });
                }
            });

            if (counter % 1000 != 0) {
                bulk.execute(function (err, result) {
                    console.log("finished loading data");
                });
            }
        });
    };

    this.isEmpty = function (obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
        }
        return true;
    };

    this.createIdRelations = async function () {
        if (this.isEmpty(jsn))
            fs.readFile("./assets/relations.txt", "utf8", (err, data) => {
                if (err) {
                    console.log(err);
                    return;
                }

                let regex = /([0-9]+;.*;)/gm;
                let jsonObj = {};
                relations = data.match(regex);

                relations.map((relationRaw) => {
                    let relationArr = relationRaw.split(";");
                    jsonObj[relationArr[0]] = relationArr[1];
                });

                fs.writeFile(
                    "./assets/id_relation.json",
                    JSON.stringify(jsonObj),
                    (err, res) => {
                        console.log("saved !");
                    }
                );
            });
    };
};

exports.DBGenerator = DBGenerator;
