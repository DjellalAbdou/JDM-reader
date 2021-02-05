import React from "react";

export default function Entity({ entity }) {
    let word = entity.word.replaceAll("'", "");
    return <div className="entity">{word}</div>;
}
