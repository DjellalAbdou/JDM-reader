import React, { useState, useRef } from "react";
import { ChevronUp, AlertCircle } from "react-feather";
import Colors from "../constants/Colors";
import { connect } from "react-redux";
import { dataRetriver } from "../api";
import { changeRaffTerm } from "../store/actions";

function DefAndRaffContainer({
    word,
    definitions,
    raffinements,
    raffTerm,
    currentType,
    changeRaffTerm,
}) {
    const [defVisible, setDefVisible] = useState(false);
    const defRef = useRef(null);
    let styleVisibleDef = defVisible
        ? {
              maxHeight: defRef.current ? defRef.current.scrollHeight : 1000,
          }
        : { maxHeight: 0 };
    let toggleDefVisibility = () => {
        setDefVisible(!defVisible);
    };

    let searchRaffinement = (term) => {
        console.log(term);
        dataRetriver.getTerm(term.replaceAll("'", ""), currentType, (data) => {
            changeRaffTerm({ ...data, typeId: currentType });
        });
    };

    return (
        <div>
            <div className="wordTitle">
                <h1>{word + (raffTerm !== "" ? ` (${raffTerm})` : "")}</h1>
            </div>
            <div className="raffinementsContainer">
                <p>Raffinement lié : </p>
                <div className="raffinementElems">
                    {raffinements.map((raff) => (
                        <div
                            key={raff.word}
                            className="raffElem"
                            onClick={() => searchRaffinement(raff.word)}
                        >
                            <p>{raff.word}</p>
                        </div>
                    ))}
                </div>
            </div>
            {definitions.length > 0 ? (
                <>
                    <div
                        className="defwrapper"
                        onClick={() => toggleDefVisibility()}
                    >
                        <p>Definitions du mot :</p>
                        <div
                            className={
                                "defArrow " +
                                (defVisible ? "" : "defArrowclose")
                            }
                        >
                            <ChevronUp
                                size={16}
                                color={Colors.$subTitleGray}
                                strokeWidth="4"
                            />
                        </div>
                    </div>
                    <div
                        ref={defRef}
                        className="definitionsContainer"
                        style={styleVisibleDef}
                    >
                        {definitions.map((def, index) => (
                            <div key={index} className="definition">
                                {index + 1} - {def}
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="notExist">
                    <AlertCircle
                        size={25}
                        color={Colors.$textBlack}
                        strokeWidth="3"
                    />
                    <div>Définition de ce mot n'existe pas dans le jeu !</div>
                </div>
            )}
        </div>
    );
}

const mapStateToProps = ({ searchWord }) => {
    return {
        raffTerm: searchWord.raffTerm,
        word: searchWord.currentWord,
        raffinements: searchWord.raffinements,
        definitions: searchWord.defs,
        currentType: searchWord.currentType,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeRaffTerm: (term) => dispatch(changeRaffTerm(term)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DefAndRaffContainer);
