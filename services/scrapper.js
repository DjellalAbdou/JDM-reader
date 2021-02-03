const charset = require("charset");
const jschardet = require("jschardet");
const Iconv = require("iconv").Iconv;
const keys = require("../config/keys");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../db");
const relationId = require("../assets/id_relation.json");

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
                r_raff_sem: [],
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
            if (wordObject.r_raff_sem.length == 0)
                await this.scrapRelationType(word, wordObject, 1, false);

            await this.scrapRelationType(word, wordObject, 0, false);

            db.save(wordObject);

            _cb(wordObject);
        } catch (err) {
            console.log(err);
            _cb({ error: true, obj: err });
        }
    };

    this.scrapRelationType = function (word, wordObject, type, updateDB, _cb) {
        return new Promise(async (resolve, reject) => {
            let urlToScrap =
                keys.JDMServerPref +
                word +
                keys.JDMServerSufx +
                word +
                "&rel=" +
                type;

            try {
                let rawData = await axios.get(urlToScrap, {
                    responseEncoding: "binary",
                });
                let data = rawData.data;
                let $ = cheerio.load(data);
                let code = $("CODE").text();
                data = this.convertToUtf8(rawData);

                let codeArr = code.match(/(e;[0-9]+;.*)/gm);

                if (codeArr != null) {
                    codeArr.map((raf) => {
                        //console.log(raf);
                        let rafData = raf.split(";");
                        let rafObj = {
                            w: rafData[4],
                            word: rafData[5] ? rafData[5] : rafData[2],
                        };
                        if (wordObject[relationId[type]] === undefined)
                            wordObject[relationId[type]] = [];
                        wordObject[relationId[type]].push(rafObj);
                    });
                }
                if (updateDB) {
                    db.updateWord(
                        word,
                        relationId[type],
                        wordObject[relationId[type]],
                        _cb
                    );
                }
                resolve();
            } catch (err) {
                console.log(err);
                reject();
            }
        });
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
        let relationTypes = code.match(regex);
        relationTypes.map((relation) => {
            let relationArr = relation.split(";");
            wordObject.relations.push({
                rt: relationArr[0],
                rtid: relationArr[1],
                rtname: relationArr[2],
                rtgpname: relationArr[3],
                rthelp: relationArr.length === 5 ? relationArr[4] : "",
            });
            //this.createRelationTypeMapping(code,relationArr[2],wordObject);
        });
    };

    /*this.createRelationTypeMapping = function(code, rtname,wordObject){
        const eRegex = /(e;[0-9]+;.*)/gm;
        const rRegex = new RegExp("r;[0-9]+;" + wordObject.eid + ".*", "gm");
    }*/

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
                        if (relation.rtid == "1") {
                            wordObject.nodes.map((node) => {
                                for (let i = 0; i < node.entries.length; i++) {
                                    if (relationArr[3] == node.entries[i].eid) {
                                        let rafName =
                                            node.entries[i].formatted_name;
                                        if (rafName.includes(">")) {
                                            wordObject.r_raff_sem.push(
                                                rafName.replaceAll("'", "")
                                            );
                                        }
                                        break;
                                    }
                                }
                            });
                        }
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
