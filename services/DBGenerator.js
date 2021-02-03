const fs = require("fs");
const mongoose = require("mongoose");
const Terms = mongoose.model("terms");

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
};

exports.DBGenerator = DBGenerator;
