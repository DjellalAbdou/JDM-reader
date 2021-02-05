import React, { Component } from "react";
import SearchContainer from "./SearchContainer";
import DefAndRaffContainer from "./DefAndRaffContainer";
import { connect } from "react-redux";
import openBook from "../assets/open-book.png";
import Loader from "react-loader-spinner";
import Colors from "../constants/Colors";

class ResultsContainer extends Component {
    render() {
        return (
            <div className="resultscontainer">
                <SearchContainer />

                {this.props.isSearching ? (
                    <div className="loaderContainer">
                        <Loader
                            style={{ paddingBottom: "30px" }}
                            type="BallTriangle"
                            color={Colors.$roze}
                            height={50}
                            width={50}
                        />
                    </div>
                ) : this.props.init ? (
                    <div>
                        <div className="emptyContainer">
                            <img
                                width={60}
                                src={openBook}
                                alt="empty opened book"
                            />
                            <div>
                                Commencez par taper un mot dans la barre de
                                recherche et le panneau de saisie
                                semi-automatique va vous aider à choisir un mot,
                                puis lancez la recherche pour afficher les
                                raffinements sémantiques du mots choisi et ces
                                définitions ici !
                            </div>
                        </div>
                    </div>
                ) : (
                    <DefAndRaffContainer />
                )}
            </div>
        );
    }
}

const mapStateToProps = ({ searchWord }) => {
    return {
        init: searchWord.init,
        isSearching: searchWord.isSearching,
    };
};

export default connect(mapStateToProps)(ResultsContainer);
