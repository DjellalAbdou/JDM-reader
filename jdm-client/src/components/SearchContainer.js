import React, { Component } from "react";
import { Search, ChevronDown, Filter } from "react-feather";
import Colors from "../constants/Colors";
import idRelations from "../assets/id_relation.json";
import AutoCompleteElem from "./AutoCompleteElem";
import { dataRetriver } from "../api";
import RelationTypesContainer from "./RelationTypesContainer";
import { connect } from "react-redux";
import {
    changeFilter,
    changeTermFilter,
    changeType,
    changeWordRes,
} from "../store/actions";

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
        if (!this.props.filter) {
            dataRetriver.getAutoComplete(text, (res) => {
                this.setState({ autoCompleteTerms: res });
            });
        } else {
            this.props.changeTermFilter(text);
        }
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
        if (!this.props.filter) {
            if (!Number.isInteger(e)) e.preventDefault();
            console.log(this.state.searchTerm);
            console.log(this.state.relation);
            if (this.state.searchTerm !== "") {
                dataRetriver.getTerm(
                    this.state.searchTerm,
                    Number.isInteger(e) ? e : this.state.relation,
                    this.handleSearchWordRes
                );
            }
        }
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
        this.changeAutoCompVisibility(false);
    };

    changeRelation = (id) => {
        this.setState({ relation: id });
        console.log(id);
        this.props.handleChangeType(id);
        this.searchWord(parseInt(id));
        //console.log(id);
    };

    changeRelationModalVisibility = (bool) => {
        this.setState({ relationsModalVisible: bool });
    };

    changeFilter = (filter) => {
        this.setState({ filter: filter });
        this.props.changeFilter(filter);
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
                        {this.props.filter ? (
                            <Filter
                                color={Colors.$iconsGray}
                                size={18}
                                strokeWidth="3"
                            />
                        ) : (
                            <Search
                                color={Colors.$iconsGray}
                                size={18}
                                strokeWidth="3"
                                style={{ cursor: "pointer" }}
                                onClick={this.searchWord}
                            />
                        )}

                        <form
                            style={{ width: "100%" }}
                            onSubmit={this.searchWord}
                        >
                            <input
                                placeholder="Chercher..."
                                className="searchinput"
                                value={
                                    !this.props.filter
                                        ? this.state.searchTerm
                                        : this.props.termFilter
                                }
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
        termFilter: searchWord.termFilter,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleSearchTerm: (termdata) => dispatch(changeWordRes(termdata)),
        handleChangeType: (typeid) => dispatch(changeType(typeid)),
        changeFilter: (filter) => dispatch(changeFilter(filter)),
        changeTermFilter: (term) => dispatch(changeTermFilter(term)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
