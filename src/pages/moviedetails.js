import { Box, Grid } from '@mui/material';
import { Home } from '@mui/icons-material';
import axios from 'axios';
import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { movieDetailUrl, token, credits, crew } from "../config/config";

const DetailsComp = (props) => {
    const navigate = useNavigate();
    var data = props.movieData;
    var credits = props.credits;

    const convertTime = (mins) => {
        var hrs = (mins / 60);
        var roundedHrs = Math.floor(hrs);
        var HH = roundedHrs.toString().length < 2 ? `0${roundedHrs}` : roundedHrs;
        var min = mins - (roundedHrs * 60);
        var MM = min.toString().length < 2 ? `0${min}` : min;
        return HH + ":" + MM;
    }
    const getDate = (dt) => {
        const date = new Date(dt);
        return date.getFullYear();
    }
    const getDirector = (crew) =>{
        var director = "";
        crew.filter((cr)=>{
            if(cr.department === "Directing" && cr.job === "Director") {
                director = cr.name;
            }
        })
        return director;
    }
    const getCast = (cast) => {
        var maxNeeded = 5;
        var sortedCast = cast.sort((a, b)=> {
            if(a.popularity - b.popularity > 0){
                return -1
            } else if(a.popularity - b.popularity < 0){
                return 1
            } else {
                return 0
            }
        });
        if(sortedCast.length - 1 < maxNeeded){
            maxNeeded = sortedCast.length - 1;
        }
        var top3 = sortedCast.slice(0, 5);
        return top3;
    }

    const gotoHome = () => {
        navigate("/");
    }

    return <Box sx={{ maxWidth: '100%', textAlign: 'left' }}>
        <Box
        sx={{ 
        p: 2,
        textAlign: 'left',
        boxShadow: '0px 0px 10px grey',
        fontWeight: '600',
        display: 'flex',
        justifyContent: 'space-between'
        }}>
            <span>Movie Details</span>
            <div>
                <Home sx={{ cursor: 'pointer' }} onClick={gotoHome}/>
            </div>
        </Box>
        <Grid container spacing={2} sx={{ padding: 2 }} sx={{display:'flex', flexDirection:{xs:'column', lg:'row', md:'row', xl:'row'  }}}>
            <Grid item xs={10} lg={2.3} md={2.3}>
                <img
                    src={`https://image.tmdb.org/t/p/original${data.poster_path}`}
                    alt="selected_poster_image"
                    style={{
                        width: '100%'
                    }}
                />
            </Grid>
            <Grid item xs={9.7} lg={9.7} md={9.7}>
                <Grid>
                    <Grid sx={{ m: 0.5 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                            <span style={{ fontSize: 'calc(0.8vw + 10px)', fontWeight: '600', lineHeight: '100%' }}>{data.original_title}</span>
                            <span style={{ fontSize: 'calc(0.25vw + 8px)', fontWeight: '500', color: '#6a6a6aa6' }}>{(data.vote_average).toFixed(2)}</span>
                        </Box>
                    </Grid>
                    <Grid sx={{ m: 0.5 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <span>{getDate(data.release_date)}</span> |
                            <span>{convertTime(data.runtime)}</span> |
                            <span>{getDirector(credits.crew)}</span>
                        </Box>
                    </Grid>
                    <Grid sx={{ m: 0.5 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <span>Cast: </span>
                            <span style={{ width: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{getCast(credits.cast).map((cast, i)=>{
                                return <span key={cast.id}>{cast.name}, </span>
                            })}</span>
                        </Box>
                    </Grid>
                    <Grid sx={{ m: 0.5 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <span>Description:{"  "}
                                {
                                    data.overview
                                }
                            </span>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Box>
}

const MovieDetails = () => {
    const location = useLocation();
    const movieId = location.search.split("?")[1];
    const [movieData, updateMovieData] = React.useState(null);
    const [credits, setcredits] = React.useState(null);

    const endpoints = [
        `${movieDetailUrl}${movieId}?language=en-US`,
        `${crew}${movieId}/credits?language=en-US`
        ]

    React.useEffect(() => {    
        const axiosInstance = axios.create({
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
          });
        
        axios.all(endpoints.map((endpoint) => axiosInstance.get(endpoint))).then(
            axios.spread((details, credits) => {
                updateMovieData(details.data);
                setcredits(credits.data)
              })
        ).catch((err)=>console.log(err))

    }, [movieId])

    return <Box sx={{ width: '100%' }}>
        {
            movieData ? (
                <>
                    <DetailsComp movieData={movieData} credits={credits} />
                </>
            ) : (
                <Box>Loading..</Box>
            )
        }
    </Box>
}

export default MovieDetails;