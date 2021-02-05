import { combineReducers } from "redux";
import {
    CHANGE_SEARCHING,
    CHANGE_TYPE,
    CHANGE_WORD_RES,
    CHANGE_PAGE,
} from "../actions/types";
import idRelations from "../../assets/id_relation.json";

const INITIAL_STATE = {
    currentWord: "",
    raffinements: [],
    defs: [],
    relations: {},
    isSearching: false,
    currentType: 0,
    pageIn: 0,
    pageOut: 0,
};

const searchWord = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CHANGE_WORD_RES:
            return {
                ...state,
                currentWord: action.payload.word,
                defs: action.payload.defs,
                raffinements: action.payload.raffs,
                relations: {
                    ...state.relations,
                    [idRelations[state.currentType].key]:
                        action.payload.relation,
                },
            };
        case CHANGE_SEARCHING:
            return {
                ...state,
                isSearching: action.payload,
            };
        case CHANGE_TYPE:
            return {
                ...state,
                currentType: action.payload,
            };
        case CHANGE_PAGE: {
            return {
                ...state,
                [action.payload.type]: action.payload.page,
            };
        }
        default:
            return state;
    }
};

const reducers = combineReducers({
    searchWord,
});

export default reducers;
