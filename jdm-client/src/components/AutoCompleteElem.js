import React from "react";

export default function AutoCompleteElem({
    term,
    changeValue,
    RType,
    id,
    selected,
    filter,
}) {
    return (
        <div
            className={
                (RType ? "RtypeElem" : "autocompleteElem") +
                (selected ? " RtypeElemSelected" : "")
            }
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
                changeValue(RType ? (filter ? term : id) : term.term);
            }}
        >
            <p> {RType ? (filter ? term : term.name) : term.term}</p>
        </div>
    );
}
