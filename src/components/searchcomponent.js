import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../redux/actions";
import axios from "axios";
import { searchurl, token } from "../config/config";
import { Home } from "@mui/icons-material";
import { useLocation, useNavigate } from 'react-router-dom';

let timeoutId;
const headers = {
  accept: "application/json",
  Authorization: `Bearer ${token}`,
};

const SearchComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //get values from store
  const Movieslist = useSelector((state) => state.movieslist);
  var callmovielist = useSelector((state) => state.callmovielist);
  var searchdata = useSelector((state) => state.searchname);

  //sate declarations
  const [getapi, setgetapi] = useState(false);
  const [page, setpage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setsearch] = useState("");
  const [searched, updateSearched] = useState("");

  //debouning
  function debounce(func, value, delay = 500) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      func(value);
    }, delay);
  }

  const gotoHome = () => {
    navigate("/");
  };

  const handleScroll = (e) => {
    console.log("scroll event: ", e);
    const scrolledHeight = window.scrollY + window.innerHeight;
    console.log(
      "scrolled Height: ",
      scrolledHeight,
      "inner height: ",
      document.body.offsetHeight
    );
    const isBottom = scrolledHeight + 10 >= document.body.offsetHeight;
    console.log("true conditions: ", isBottom, !isLoading);
    if (isBottom && !isLoading) {
      // alert("Ma1")
      sendsearchdata(searched);
    }
  };

  //scroll handler
  useEffect(() => {
    window.addEventListener("scroll", (e) => handleScroll(e));
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  //send the data to the store after user stops typing to reduce the number of api calls triggered in the other component
  const sendsearchdata = (val) => {
    console.log("serarchcomponent", val)
    if (val?.length <= 0) {
    //   dispatch(Actions.sendmovielist([]));
      return
    }
    setIsLoading(true);

    //send data to the store
    axios
      .get(`${searchurl}?language=en-US&query=${val}&page=${page}`, { headers })
      .then((res) => {
        setpage((prevPage) => prevPage + 1);
        let result = [...Movieslist, ...res.data.results];
        dispatch(Actions.sendmovielist(result));
      })
      .finally(() => {
        dispatch(Actions.sendsearchname(val));
        setIsLoading(false);
      });
  };

  const updatesearch = (e) => {
    const searchValue = e.target.value;
    updateSearched(searchValue);
    debounce(sendsearchdata, searchValue);
    dispatch(Actions.callmovielist(searchValue));
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        boxShadow: "0px 0px 5px grey",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between", // Align left
        alignItems: "center", // Center vertically
        padding: "10px", // Adjust padding
        boxSizing: "border-box", // Include padding in width
      }}
    >
      <TextField
        sx={{
          width: "700px",
          borderRadius: "8px", // Adjust radius as needed
        }}
        variant="outlined"
        size="small"
        placeholder="Search..."
        InputProps={{
          startAdornment: <SearchIcon style={{ color: "grey" }} />,
        }}
        value={searched}
        onChange={updatesearch}
      />
      <Home sx={{ cursor: "pointer" }} onClick={gotoHome} />
    </div>
  );
};

export default SearchComponent;
