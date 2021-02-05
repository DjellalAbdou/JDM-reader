import { CHANGE_WORD_RES, CHANGE_TYPE, CHANGE_PAGE } from "./types";

export const changeWordRes = (state) => ({
    type: CHANGE_WORD_RES,
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
