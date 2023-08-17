// general imports
//material ui imports
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchComponent from "../components/searchcomponent";
import { movielisturl, token } from "../config/config";
// import "./App.css";

const MovieDetails = () => {
  const Movieslist = useSelector((state) => state.movieslist);
  const searchname = useSelector((state) => state.searchname);
  const callmovielist = useSelector((state) => state.callmovielist);

  //state declarations
  const [movielist, updatemovielist] = useState([]);
  const [getapi, setgetapi] = useState(false);
  const [page, setpage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const headers = {
    accept: "application/js`on",
    Authorization: `Bearer ${token}`,
  };

  //infinite scrolling
  const handleScroll = () => {
    const isBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;
    if (isBottom && !isLoading && callmovielist.length <= 0) {
      setgetapi(true);
    }
  };

  //scroll handler
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // updatemovielist([])
    if (searchname?.length > 0) {
      if (Movieslist.length <= 0) {
        toast.error("No results found");
        updatemovielist([]);
      } else {
        updatemovielist(Movieslist);
      }
    }
  }, [searchname]);

  useEffect(() => {
    updatemovielist(Movieslist);
  }, [Movieslist]);

  //get the movies list
  useEffect(() => {
    if (callmovielist.length == 0) {
      setIsLoading(true);
      axios
        .get(`${movielisturl}?language=en-US&page=${page}`, { headers })
        .then((res) => {
          Movieslist.length === 0 &&
            updatemovielist((prevItems) => [...prevItems, ...res.data.results]);
          setpage((prevPage) => prevPage + 1);
        })
        .catch((err) => {
          setError("something went wrong, try again");
        })
        .finally(() => {
          setIsLoading(false);
          setgetapi(false); // Reset getapi after the data is loaded
        });
    }
  }, [callmovielist, getapi]);

  const openDetails = (movie) => {
    navigate(`/moviedetails?${movie.id}`);
  };

  return (
    <>
      <SearchComponent />
      <Grid
        container
        spacing={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          p: { sm: 2, md: 0, lg: 0, xl: 0 },
          my: 7,
        }}
      >
        {movielist ? (
          movielist
            // sort the array as per the new data
            .sort((a, b) => new Date(a.release_date) - new Date(b.release_date))
            .map((ele, index) => (
              <Grid
                item
                xs={11}
                sm={3}
                md={3}
                lg={2.3}
                xl={2.1}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    minHeight: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    width: "100%",
                    boxShadow: 1,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                  onClick={() => openDetails(ele)}
                >
                  <div>
                    <img
                      className="image"
                      style={{ width: "100%" }}
                      src={`https://image.tmdb.org/t/p/w500${ele.poster_path}`}
                      alt="poster_image"
                    />
                  </div>
                  <Box sx={{ background: "white", minHeight: "70px", p: 2 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          textAlign: "left",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {ele.original_title}
                      </span>
                      <span style={{ fontSize: "10.5px" }}>
                        {ele.vote_average} IDMB
                      </span>
                    </div>
                    <div
                      style={{
                        minHeight: "30px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textAlign: "left",
                        fontSize: "13px",
                        paddingTop: "5px",
                      }}
                    >
                      {ele.overview}
                    </div>
                    <div></div>
                  </Box>
                </Box>
              </Grid>
            ))
        ) : (
          <CircularProgress />
        )}
      </Grid>
    </>
  );
};
export default MovieDetails;
