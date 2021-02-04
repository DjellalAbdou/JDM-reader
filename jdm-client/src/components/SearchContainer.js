import React, { Component } from "react";
import { Search, ChevronDown } from "react-feather";
import Colors from "../constants/Colors";
import idRelations from "../assets/id_relation.json";
import AutoCompleteElem from "./AutoCompleteElem";
import { dataRetriver } from "../api";

export default class SearchContainer extends Component {
    state = {
        relation: 0,
        autoCompleteTerms: [],
        searchTerm: "",
        isOpened: false,
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
    };

    render() {
        let AutoTerms = this.state.autoCompleteTerms.map((term) => (
            <AutoCompleteElem
                key={term.eid}
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
                        <form onSubmit={this.searchWord}>
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
                    <div className="rightSideSearch">
                        <p>{idRelations[this.state.relation].name}</p>
                        <div className="dropdownSearch">
                            <ChevronDown
                                size={15}
                                color={Colors.$textBlack}
                                strokeWidth="4"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
