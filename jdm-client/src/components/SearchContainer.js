import React, { Component } from "react";
import { Search, ChevronDown } from "react-feather";
import Colors from "../constants/Colors";
import idRelations from "../assets/id_relation.json";
import AutoCompleteElem from "./AutoCompleteElem";
import { dataRetriver } from "../api";
import RelationTypesContainer from "./RelationTypesContainer";
import { connect } from "react-redux";
import { changeType, changeWordRes } from "../store/actions";

const filter = ["Alpha", "poids"];

class SearchContainer extends Component {
    state = {
        relation: 0,
        autoCompleteTerms: [],
        searchTerm: "",
        isOpened: false,
        relationsModalVisible: false,
        filter: "Alpha",
    };

    onChange = (e) => {
        let text = e.target.value;
        this.setState({ searchTerm: text });
        dataRetriver.getAutoComplete(text, (res) => {
            this.setState({ autoCompleteTerms: res });
        });
    };

    changeValue = (value) => {
        //console.log(value);
        this.setState({ searchTerm: value });
        this.changeAutoCompVisibility(false);
    };

    changeAutoCompVisibility = (bool) => {
        this.setState({ isOpened: bool });
    };

    searchWord = (e) => {
        e.preventDefault();
        console.log(this.state.searchTerm);
        dataRetriver.getTerm(
            this.state.searchTerm,
            this.state.relation,
            this.handleSearchWordRes
        );
    };

    handleSearchWordRes = (res) => {
        let obj = {
            word: res.word,
            defs: res.def,
            raffs: res.r_raff_sem.out
                .filter((raf) => raf.word.includes(">"))
                .sort((a, b) => parseInt(b.w) - parseInt(a.w)),
            relation: res[idRelations[this.state.relation].key],
        };
        console.log(obj);
        this.props.handleSearchTerm(obj);
    };

    changeRelation = (id) => {
        this.setState({ relation: id });
        this.props.handleChangeType(id);
        //console.log(id);
    };

    changeRelationModalVisibility = (bool) => {
        this.setState({ relationsModalVisible: bool });
    };

    changeFilter = (filter) => {
        this.setState({ filter: filter });
    };

    render() {
        let AutoTerms = this.state.autoCompleteTerms.map((term, index) => (
            <AutoCompleteElem
                key={term.eid + index}
                term={term}
                changeValue={this.changeValue}
            />
        ));
        return (
            <div className="searchcontainer">
                <div className="searchInputWithDrop">
                    <div className="leftSideSearch">
                        <Search
                            color={Colors.$iconsGray}
                            size={18}
                            strokeWidth="3"
                            style={{ cursor: "pointer" }}
                        />
                        <form
                            style={{ width: "100%" }}
                            onSubmit={this.searchWord}
                        >
                            <input
                                placeholder="Chercher..."
                                className="searchinput"
                                value={this.state.searchTerm}
                                onChange={this.onChange}
                                onBlur={() =>
                                    this.changeAutoCompVisibility(false)
                                }
                                onFocus={() =>
                                    this.changeAutoCompVisibility(true)
                                }
                            />
                        </form>

                        <div
                            className="autocompleteContainer"
                            style={{
                                display: this.state.isOpened ? "block" : "none",
                            }}
                        >
                            {AutoTerms}
                        </div>
                    </div>
                    <div className="vertical-divider" />
                    <div
                        className="rightSideSearch"
                        onClick={() =>
                            this.setState({
                                relationsModalVisible: !this.state
                                    .relationsModalVisible,
                            })
                        }
                    >
                        <p>
                            {this.props.filter
                                ? "filtre " + this.state.filter
                                : idRelations[this.state.relation].name}
                        </p>
                        <div
                            className={
                                "dropdownSearch" +
                                (this.state.relationsModalVisible
                                    ? " dropdownSearchClose"
                                    : "")
                            }
                        >
                            <ChevronDown
                                size={15}
                                color={Colors.$textBlack}
                                strokeWidth="4"
                            />
                        </div>
                        <RelationTypesContainer
                            filter={this.props.filter}
                            selected={
                                this.props.filter
                                    ? this.state.filter
                                    : this.state.relation
                            }
                            changeValue={
                                this.props.filter
                                    ? this.changeFilter
                                    : this.changeRelation
                            }
                            isOpened={this.state.relationsModalVisible}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ searchWord }) => {
    return {
        currentWord: searchWord.currentWord,
        raffinements: searchWord.raffinements,
        defs: searchWord.defs,
        relations: searchWord.relations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleSearchTerm: (termdata) => dispatch(changeWordRes(termdata)),
        handleChangeType: (typeid) => dispatch(changeType(typeid)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
