export function sendselectedmovie(selectedmovie){
    return{
        type:'sendselectedmovie',
        selectedmovie
    }
}

export function sendsearchname(searchname){
    return {
        type:'sendsearchname',
        searchname
    }
}

export function sendmovielist(movieslist){
    return{
        type: 'sendmovielist',
        movieslist
    }
}

export function callmovielist(getmovielist){
    return{
        type:"callmovielist",
        getmovielist
    }
}