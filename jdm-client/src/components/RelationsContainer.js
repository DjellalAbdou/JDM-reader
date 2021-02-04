import React, { useState, useRef } from "react";
import { ChevronUp } from "react-feather";
import Colors from "../constants/Colors";
import Entity from "./Entity";

export default function RelationsContainer({ direction, res }) {
    const [defVisible, setDefVisible] = useState(true);
    const defRef = useRef(null);
    let styleVisibleDef = defVisible
        ? {
              maxHeight: defRef.current ? defRef.current.scrollHeight : "auto",
          }
        : { maxHeight: 0 };
    let toggleDefVisibility = () => {
        setDefVisible(!defVisible);
        console.log(defRef.current.scrollHeight);
    };
    return (
        <div className="realtionsContainer">
            <div className="defwrapper" onClick={() => toggleDefVisibility()}>
                <p>
                    {direction === "in"
                        ? "relations entrantes"
                        : "realtions sortantes"}
                </p>
                <ChevronUp
                    size={16}
                    color={Colors.$subTitleGray}
                    strokeWidth="4"
                />
            </div>
            <div
                ref={defRef}
                style={styleVisibleDef}
                className="relationsWrapper"
            >
                {res.map((entity) => (
                    <Entity entity={entity} />
                ))}
            </div>
        </div>
    );
}
