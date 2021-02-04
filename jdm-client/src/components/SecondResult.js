import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import RelationsContainer from "./RelationsContainer";

export default class ResultsContainer extends Component {
    state = {
        inRel: [{ w: 12, word: "test" }],
        outRel: [
            { w: 12, word: "test" },
            { w: 12, word: "test" },
            { w: 12, word: "test" },
            { w: 12, word: "test" },
            { w: 12, word: "test" },
            { w: 12, word: "test" },
            { w: 12, word: "test" },
            { w: 12, word: "dadazd  da" },
            { w: 12, word: "test" },
        ],
    };

    render() {
        return (
            <div className="secondresultscontainer resultscontainer">
                <SearchContainer />
                <RelationsContainer direction="out" res={this.state.outRel} />
                <RelationsContainer direction="in" res={this.state.inRel} />
            </div>
        );
    }
}
