import { combineReducers } from "redux";
import {
    CHANGE_SEARCHING,
    CHANGE_TYPE,
    CHANGE_WORD_RES,
    CHANGE_PAGE,
    CHANGE_FILTER,
    CHANGE_TERM_FILTER,
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
    filter: "Alpha",
    termFilter: "",
    inEntities: [],
    outEntities: [],
    inToShow: [],
    outToShow: [],
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
                inEntities: [...action.payload.relation.in],
                outEntities: [...action.payload.relation.out],
                inToShow: sortEntities(
                    [...action.payload.relation.in].slice(0, 100),
                    "Alpha"
                ),
                outToShow: sortEntities(
                    [...action.payload.relation.out].slice(0, 100),
                    "Alpha"
                ),
                termFilter: "",
                pageIn: 0,
                pageOut: 0,
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
        case CHANGE_PAGE:
            let newarrEntity;
            if (action.payload.type === "pageIn") {
                newarrEntity = sortEntities(
                    [...state.inEntities].slice(
                        0,
                        100 + action.payload.page * 100
                    ),
                    state.filter
                );
            } else {
                newarrEntity = sortEntities(
                    [...state.outEntities].slice(
                        0,
                        100 + action.payload.page * 100
                    ),
                    state.filter
                );
            }
            return {
                ...state,
                [action.payload.type]: action.payload.page,
                [action.payload.type === "pageIn"
                    ? "inToShow"
                    : "outToShow"]: newarrEntity,
            };

        case CHANGE_FILTER:
            return {
                ...state,
                filter: action.payload,
                inToShow: sortEntities([...state.inToShow], action.payload),
                outToShow: sortEntities([...state.outToShow], action.payload),
            };
        case CHANGE_TERM_FILTER:
            return {
                ...state,
                termFilter: action.payload,
                inToShow: filterByTerm(
                    sortEntities(
                        state.inEntities.slice(0, 100 + state.pageIn * 100),
                        state.filter
                    ),
                    action.payload
                ),
                outToShow: filterByTerm(
                    sortEntities(
                        state.outEntities.slice(0, 100 + state.pageOut * 100),
                        state.filter
                    ),
                    action.payload
                ),
            };
        default:
            return state;
    }
};

const filterByTerm = (entities, term) => {
    return entities.filter((ent) => {
        //return ent.word.includes(term);
        return ent.word
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(
                term
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
            );
    });
};

const sortEntities = (entities, type) => {
    let filtersortFnc =
        type === "Alpha"
            ? (a, b) =>
                  a.word
                      .replaceAll("'", "")
                      .toLowerCase()
                      .localeCompare(b.word.replaceAll("'", "").toLowerCase())
            : (a, b) => parseInt(b.w) - parseInt(a.w);
    return entities.sort(filtersortFnc);
};

const reducers = combineReducers({
    searchWord,
});

export default reducers;
