import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import DefAndRaffContainer from "./DefAndRaffContainer";
import { connect } from "react-redux";

class ResultsContainer extends Component {
    render() {
        return (
            <div className="resultscontainer">
                <SearchContainer />
                <DefAndRaffContainer {...this.props} />
            </div>
        );
    }
}

const mapStateToProps = ({ searchWord }) => {
    return {
        word: searchWord.currentWord,
        raffinements: searchWord.raffinements,
        definitions: searchWord.defs,
    };
};

export default connect(mapStateToProps, null)(ResultsContainer);
