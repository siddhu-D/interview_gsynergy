import * as React from 'react';

const allstates = {
    movieslist :[],
    searchname: "",
    selectedmovie: "",
    callmovielist: "",
    backtohome: false,
}

export default function Store(state = allstates, actions) {
    switch (actions.type) {
        case "sendsearchname":
            return { ...state, searchname: actions.searchname }
        case "sendmovielist":
            return {...state, movieslist: actions.movieslist}
        case "callmovielist":
            return {...state, callmovielist: actions.getmovielist}
        default:
            return state
    }
}