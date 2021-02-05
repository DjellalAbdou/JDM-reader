import React from "react";
import AutoCompleteElem from "./AutoCompleteElem";
import idRelations from "../assets/id_relation.json";

export default function RelationTypesContainer({
    changeValue,
    isOpened,
    selected,
    filter,
}) {
    let AutoTerms = [];
    let filters = ["Alpha", "poids"];
    if (filter) {
        AutoTerms = filters.map((fil, index) => (
            <AutoCompleteElem
                filter
                RType
                key={index}
                id={index}
                term={fil}
                changeValue={changeValue}
                selected={fil === selected.toString()}
            />
        ));
    } else {
        for (let key in idRelations) {
            AutoTerms.push(
                <AutoCompleteElem
                    RType
                    key={key}
                    id={key}
                    term={idRelations[key]}
                    changeValue={changeValue}
                    selected={key === selected.toString()}
                />
            );
        }
    }

    return (
        <div
            className="autocompleteContainer relationsSuggestor"
            style={{
                display: isOpened ? "block" : "none",
                overflowY: filter ? "auto" : "scroll",
            }}
        >
            {AutoTerms}
        </div>
    );
}
