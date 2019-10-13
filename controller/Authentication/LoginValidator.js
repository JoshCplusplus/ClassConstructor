const cookieParser = require('cookie-parser')
const ActionUtil = require('../Action/ActionUtil')
/*
 * File: LoginValidator.js
 * Description: Classes that handle validation on the routes
 */
const LoginValidator = {

    /*
     * Function: isLoggedIn
     * Description: Used to validate if the user is logged in. Parses request token and session token and checks if they are the same
     * return: calls next function to allow through if validated otherwise send back a 401 status
     * Error: 401 status if not authenticated
     */
    isLoggedIn : function(req, res, next) {
        //Check if there is a cookie session
        if(req.session.token === undefined){
            console.log("not today");
            res.sendStatus(401);
        }
        else{
            next();
        }
    }
}

module.exports = LoginValidator;