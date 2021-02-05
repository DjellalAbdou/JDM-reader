import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import DefAndRaffContainer from "./DefAndRaffContainer";

class ResultsContainer extends Component {
    render() {
        return (
            <div className="resultscontainer">
                <SearchContainer />
                <DefAndRaffContainer />
            </div>
        );
    }
}

export default ResultsContainer;
