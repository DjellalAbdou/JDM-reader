import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import RelationsContainer from "./RelationsContainer";
import { connect } from "react-redux";
import idRelations from "../assets/id_relation.json";
import openBook from "../assets/open-book.png";
import Loader from "react-loader-spinner";
import Colors from "../constants/Colors";

class ResultsContainer extends Component {
    render() {
        console.log(this.props.isSearching + " rerender");
        return (
            <div className="secondresultscontainer resultscontainer">
                <SearchContainer filter />
                {this.props.init ? (
                    <div>
                        <div className="emptyContainer">
                            <img
                                width={120}
                                src={openBook}
                                alt="empty opened book"
                            />
                            <div>
                                Puis, après avoir choisi votre mot, vous pouvez
                                visualiser tous les autres termes qui lui sont
                                liés soit en relation entrante en relation
                                sortante, vous pouvez également trier les
                                résultats par alphabet ou par poids et vous
                                pouvez filtrer les résultats par texte !
                            </div>
                        </div>
                    </div>
                ) : this.props.isSearching ? (
                    <div className="loaderContainer">
                        <Loader
                            style={{ paddingBottom: "30px" }}
                            type="BallTriangle"
                            color={Colors.$roze}
                            height={50}
                            width={50}
                        />
                    </div>
                ) : (
                    <>
                        <RelationsContainer
                            direction="out"
                            res={this.props.outToShow}
                            //res={this.props.relation ? this.props.relation.out : []}
                        />
                        <RelationsContainer
                            direction="in"
                            res={this.props.inToShow}
                            //res={this.props.relation ? this.props.relation.in : []}
                        />
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({ searchWord }) => {
    return {
        inToShow: searchWord.inToShow,
        outToShow: searchWord.outToShow,
        init: searchWord.init,
        isSearching: searchWord.isSearching,
        //relation: searchWord.relations[idRelations[searchWord.currentType].key],
    };
};

export default connect(mapStateToProps, null)(ResultsContainer);
