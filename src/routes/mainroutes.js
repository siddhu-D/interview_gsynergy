import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const MoviesList = React.lazy(() => import("../pages/movieslist"));
const MovieDetails = React.lazy(() => import("../pages/moviedetails"));

const MainRoutes = () => {
    return (<Router>
        <Suspense fallback={<div>loading ...</div>}>
            <Routes>
                <Route path="/" Component={MoviesList} />
                <Route path="/moviedetails" Component={MovieDetails} />
            </Routes>
        </Suspense>
    </Router>)
}

export default MainRoutes