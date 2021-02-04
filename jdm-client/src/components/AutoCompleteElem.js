import React from "react";

export default function AutoCompleteElem({ term, changeValue }) {
    return (
        <div
            className="autocompleteElem"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
                changeValue(term.term);
            }}
        >
            <p> {term.term}</p>
        </div>
    );
}
