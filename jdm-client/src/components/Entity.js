import React from "react";
import { dataRetriver } from "../api";
import { connect } from "react-redux";
import idRelations from "../assets/id_relation.json";
import { changeSearchTerm, changeWordRes } from "../store/actions";

function Entity({ entity, currentType, handleSearchTerm, changeSearchTerm }) {
    let word = entity.word.replaceAll("'", "");

    let searchNewTerm = () => {
        dataRetriver.getTerm(word, currentType, (data) => {
            handleSearchWordRes(data, word);
        });
    };

    let handleSearchWordRes = (res, trm) => {
        let obj;
        console.log(res);
        if (!res.error) {
            obj = {
                word: res.word,
                defs: res.def,
                raffs: res.r_raff_sem.out
                    .filter((raf) => raf.word.includes(">"))
                    .sort((a, b) => parseInt(b.w) - parseInt(a.w)),
                relation: res[idRelations[currentType].key],
            };
        } else {
            obj = {
                word: trm,
                defs: [],
                raffs: [],
                relation: { in: [], out: [] },
            };
        }

        //console.log(obj);
        changeSearchTerm("");
        handleSearchTerm(obj);
        //this.changeAutoCompVisibility(false);
    };
    return (
        <div className="entity" onClick={searchNewTerm}>
            {word}
        </div>
    );
}

const mapStateToProps = ({ searchWord }) => {
    return {
        currentType: searchWord.currentType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleSearchTerm: (termdata) => dispatch(changeWordRes(termdata)),
        changeSearchTerm: (value) => dispatch(changeSearchTerm(value)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
