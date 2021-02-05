import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import RelationsContainer from "./RelationsContainer";
import { connect } from "react-redux";
import idRelations from "../assets/id_relation.json";

class ResultsContainer extends Component {
    render() {
        console.log(this.props.relation);
        return (
            <div className="secondresultscontainer resultscontainer">
                <SearchContainer filter />
                <RelationsContainer
                    direction="out"
                    res={this.props.relation ? this.props.relation.out : []}
                />
                <RelationsContainer
                    direction="in"
                    res={this.props.relation ? this.props.relation.in : []}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ searchWord }) => {
    return {
        relation: searchWord.relations[idRelations[searchWord.currentType].key],
    };
};

export default connect(mapStateToProps, null)(ResultsContainer);
