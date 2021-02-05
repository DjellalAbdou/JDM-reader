import React, { useState, useRef } from "react";
import { ChevronUp, ChevronLeft, ChevronRight } from "react-feather";
import Colors from "../constants/Colors";
import Entity from "./Entity";
import { connect } from "react-redux";
import { changePage } from "../store/actions";

function RelationsContainer({ direction, res, pageIn, pageOut, changePage }) {
    const [defVisible, setDefVisible] = useState(false);
    const defRef = useRef(null);
    const [colorIcon, setColorIcon] = useState(Colors.$textBlack);
    const [colorIconR, setColorIconR] = useState(Colors.$textBlack);
    let styleVisibleDef = defVisible
        ? {
              maxHeight: defRef.current ? defRef.current.scrollHeight : 1000,
          }
        : { maxHeight: 0 };
    let toggleDefVisibility = () => {
        setDefVisible(!defVisible);
        //console.log(defRef.current.scrollHeight);
    };

    let addElements = () => {
        if (res.length !== entities.length) {
            changePage(
                direction === "in"
                    ? { type: "pageIn", page: pageIn + 1 }
                    : { type: "pageOut", page: pageOut + 1 }
            );
        }
    };

    let removeElements = () => {
        if (!(entities.length <= 100)) {
            changePage(
                direction === "in"
                    ? { type: "pageIn", page: pageIn - 1 }
                    : { type: "pageOut", page: pageOut - 1 }
            );
        }
    };

    let entities = res
        .slice(0, direction === "in" ? pageIn * 100 + 100 : pageOut * 100 + 100)
        .map((entity, index) => (
            <Entity key={entity.word + index} entity={entity} />
        ));

    return (
        <div className="realtionsContainer">
            <div className="defwrapper" onClick={() => toggleDefVisibility()}>
                <p>
                    {direction === "in"
                        ? "relations entrantes"
                        : "realtions sortantes"}
                </p>
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
                style={styleVisibleDef}
                className="relationsWrapper"
            >
                {entities}
            </div>
            <div
                className="pageHandlersContainer"
                style={{
                    display:
                        entities.length != 0 && styleVisibleDef.maxHeight != 0
                            ? "flex"
                            : "none",
                }}
            >
                <div
                    className="pageHandler"
                    onMouseOver={() => setColorIcon(Colors.$roze)}
                    onMouseOut={() => setColorIcon(Colors.$textBlack)}
                    onClick={removeElements}
                >
                    <div className="iconpageHandler">
                        <ChevronLeft
                            style={{ transition: "all 0.2s" }}
                            size={16}
                            color={
                                entities.length <= 100
                                    ? Colors.$iconsGray
                                    : colorIcon
                            }
                            strokeWidth="4"
                        />
                    </div>
                    <div
                        style={{
                            marginLeft: 10,
                            color:
                                entities.length <= 100
                                    ? Colors.$iconsGray
                                    : colorIcon,
                        }}
                    >
                        diminuer
                    </div>
                </div>

                <div
                    className="pageHandler"
                    onMouseOver={() => setColorIconR(Colors.$roze)}
                    onMouseOut={() => setColorIconR(Colors.$textBlack)}
                    onClick={addElements}
                >
                    <div
                        style={{
                            marginRight: 10,
                            color:
                                res.length !== entities.length
                                    ? colorIconR
                                    : Colors.$iconsGray,
                        }}
                    >
                        ajouter
                    </div>
                    <div className="iconpageHandler">
                        <ChevronRight
                            style={{ transition: "all 0.2s" }}
                            size={16}
                            color={
                                res.length !== entities.length
                                    ? colorIconR
                                    : Colors.$iconsGray
                            }
                            strokeWidth="4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = ({ searchWord }) => {
    return {
        pageIn: searchWord.pageIn,
        pageOut: searchWord.pageOut,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changePage: (page) => dispatch(changePage(page)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RelationsContainer);
