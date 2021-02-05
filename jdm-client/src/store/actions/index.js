import {
    CHANGE_WORD_RES,
    CHANGE_TYPE,
    CHANGE_PAGE,
    CHANGE_FILTER,
    CHANGE_TERM_FILTER,
    CHANGE_ENTITIES,
    CHANGE_RAFF_TERM,
    CHANGE_SEARCH_TERM,
    CHANGE_SEARCHING,
    CHANGE_INIT,
} from "./types";

export const changeWordRes = (state) => ({
    type: CHANGE_WORD_RES,
    payload: state,
});

export const changeSearching = (state) => ({
    type: CHANGE_SEARCHING,
    payload: state,
});

export const changeType = (state) => ({
    type: CHANGE_TYPE,
    payload: state,
});

export const changePage = (state) => ({
    type: CHANGE_PAGE,
    payload: state,
});

export const changeFilter = (state) => ({
    type: CHANGE_FILTER,
    payload: state,
});

export const changeTermFilter = (state) => ({
    type: CHANGE_TERM_FILTER,
    payload: state,
});

export const changeEntities = (state) => ({
    type: CHANGE_ENTITIES,
    payload: state,
});

export const changeRaffTerm = (state) => ({
    type: CHANGE_RAFF_TERM,
    payload: state,
});

export const changeSearchTerm = (state) => ({
    type: CHANGE_SEARCH_TERM,
    payload: state,
});

export const changeInit = (state) => ({
    type: CHANGE_INIT,
    payload: state,
});
