Linker = function () {
    this.linkRelationToEntity = function (_word, _RType) {
        let relationsArr = _word.relations.find((elem) => (elem.rtid = _RType));
        //console.log(relationsArr);
        let outRelations = [];
        let inRelations = [];
        if (relationsArr != null) {
            if (relationsArr.outRels != null) {
                relationsArr.outRels.map((outrel) => {
                    let entryCode = outrel.node2;
                    _word.nodes.map((node) => {
                        for (let i = 0; i < node.entries.length; i++) {
                            if (entryCode == node.entries[i].eid) {
                                outRelations.push(node.entries[i].name);
                                break;
                            }
                        }
                    });
                });
            }
            if (relationsArr.inRels != null) {
                relationsArr.inRels.map((inrel) => {
                    let entryCode = inrel.node2;
                    _word.nodes.map((node) => {
                        for (let i = 0; i < node.entries.length; i++) {
                            if (entryCode == node.entries[i].eid) {
                                inRelations.push(node.entries[i].name);
                                break;
                            }
                        }
                    });
                });
            }
        }
        return [outRelations, inRelations];
    };
};

exports.Linker = Linker;
