import React, { useState, useRef } from "react";
import { ChevronUp } from "react-feather";
import Colors from "../constants/Colors";

export default function DefAndRaffContainer({
    word,
    definitions,
    raffinements,
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

    return (
        <div>
            <div className="wordTitle">
                <h1>{word}</h1>
            </div>
            <div className="raffinementsContainer">
                <p>Raffinement lié : </p>
                <div className="raffinementElems">
                    {raffinements.map((raff) => (
                        <div key={raff.word} className="raffElem">
                            <p>{raff.word}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="defwrapper" onClick={() => toggleDefVisibility()}>
                <p>Definitions du mot :</p>
                <div
                    className={
                        "defArrow " + (defVisible ? "" : "defArrowclose")
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
        </div>
    );
}
