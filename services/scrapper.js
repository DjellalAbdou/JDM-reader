const charset = require("charset");
const jschardet = require("jschardet");
const Iconv = require("iconv").Iconv;
const keys = require("../config/keys");
const axios = require("axios");
const cheerio = require("cheerio");

Scrapper = function () {
    this.convertToUtf8 = function (rawData) {
        let body = rawData.data;
        let enc =
            charset(rawData.headers, rawData) ||
            jschardet.detect(body).encoding.toLowerCase();
        console.log(enc);

        if (enc !== "utf8") {
            let iconv = new Iconv(enc, "UTF-8//TRANSLIT//IGNORE");
            body = iconv.convert(new Buffer(body, "binary")).toString("utf8");
        }
        return body;
    };

    this.executeScrapper = async function (word, _cb) {
        let urlToScrap =
            keys.JDMServerPref + word + keys.JDMServerSufx + word + "&rel=";

        try {
            let rawData = await axios.get(urlToScrap, {
                responseEncoding: "binary",
            });
            let data = rawData.data;
            let $ = cheerio.load(data);
            let code = $("CODE").text();
            let def = $("def").text();

            data = this.convertToUtf8(rawData);

            let wordObject = {
                word: word,
                eid: Number(code.split("(eid=")[1].split(")")[0]),
                def: [],
                nodes: [],
                relations: [],
            };

            let defArray = def.split(/\n[0-9]+. /);
            defArray.map((elem) => {
                if (!/^\n*$/.test(elem)) {
                    wordObject.def.push(elem.trim());
                }
            });

            this.scrapAllInfo(code, wordObject);

            _cb(wordObject);
        } catch (err) {
            console.log(err);
            _cb({ error: true, obj: err });
        }
    };

    this.scrapAllInfo = function (code, wordObject) {
        this.scrapNodeTypes(code, wordObject);
        this.scrapWordEntries(code, wordObject);
        this.scrapRelationsType(code, wordObject);
        this.scrapOutgoingRelation(code, wordObject);
        this.scrapIncomingRelations(code, wordObject);
    };

    this.scrapNodeTypes = function (code, wordObject) {
        const nodeTypeRegx = /(nt;[0-9]+;.*)/gm;

        code.match(nodeTypeRegx).map((nodeType) => {
            let arrType = nodeType.split(";");
            wordObject.nodes.push({
                nt: arrType[0],
                ntid: arrType[1],
                ntname: arrType[2],
            });
        });
    };

    this.scrapWordEntries = function (code, wordObject) {
        const entryTypeRegx = /(e;[0-9]+;.*)/gm;
        code.match(entryTypeRegx).map((entry) => {
            let entryArr = entry.split(";");
            wordObject.nodes.map((node) => {
                if (node.ntid == entryArr[3]) {
                    if (node["entries"] === undefined) node["entries"] = [];
                    node.entries.push({
                        e: entryArr[0],
                        eid: entryArr[1],
                        name: entryArr[2],
                        type: entryArr[3],
                        w: entryArr[4],
                        formatted_name:
                            entryArr.length === 6 ? entryArr[5] : "",
                    });
                }
            });
        });
    };

    this.scrapRelationsType = function (code, wordObject) {
        const regex = /(rt;[0-9]+;.*)/gm;
        code.match(regex).map((relation) => {
            let relationArr = relation.split(";");
            wordObject.relations.push({
                rt: relationArr[0],
                rtid: relationArr[1],
                rtname: relationArr[2],
                rtgpname: relationArr[3],
                rthelp: relationArr.length === 5 ? relationArr[4] : "",
            });
        });
    };

    this.scrapOutgoingRelation = function (code, wordObject) {
        const regex = new RegExp("r;[0-9]+;" + wordObject.eid + ".*", "gm");
        let codeArr = code.match(regex);
        if (codeArr != null) {
            codeArr.map((elem) => {
                let relationArr = elem.split(";");
                wordObject.relations.map((relation) => {
                    if (relation.rtid == relationArr[4]) {
                        if (relation["outRels"] === undefined)
                            relation["outRels"] = [];
                        relation.outRels.push({
                            r: relationArr[0],
                            rid: relationArr[1],
                            node1: relationArr[2],
                            node2: relationArr[3],
                            type: relationArr[4],
                            w: relationArr[5],
                        });
                    }
                });
            });
        }
    };

    this.scrapIncomingRelations = function (code, wordObject) {
        let regex = new RegExp(
            "r;[0-9]+;[0-9]+;" + wordObject.eid + ".*",
            "gm"
        );
        let codeArr = code.match(regex);
        if (codeArr != null) {
            codeArr.map((elem) => {
                let elemArr = elem.split(";");
                wordObject.relations.map((relation) => {
                    if (relation.rtid == elemArr[4]) {
                        if (relation["inRels"] === undefined)
                            relation["inRels"] = [];
                        relation.inRels.push({
                            r: elemArr[0],
                            rid: elemArr[1],
                            node1: elemArr[2],
                            node2: elemArr[3],
                            type: elemArr[4],
                            w: elemArr[5],
                        });
                    }
                });
            });
        }
    };
};

exports.Scrapper = Scrapper;
