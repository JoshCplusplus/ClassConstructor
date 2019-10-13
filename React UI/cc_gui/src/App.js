import React from "react";
// import: styling
import './App.css';
// import: router and routes
import { BrowserRouter as Router} from "react-router-dom";
import Page from './Page';
// import: favicon support (icon in browser tab)
import Favicon from 'react-favicon';
import favicon from './Images/favicon.png';
// import: allow storing cookies on computer
require('dotenv').config()

/*
    We need to dynamically render the links for the created schedules here whenever we get a chance
*/

function AppRouter() {

    return (
        <div className="root-wrapper">
            <Favicon url={favicon}/>
            <Router>
                <Page/>
            </Router>
        </div>
    );
}

export default AppRouter;
