const UserAction = require('./UserAction')
/*
 * File: ActionUtil.js
 * Description: Various utility functions to help out with development
 */

 const ActionUtil = {
    
    /*
     * Function: getUserId
     * Description: returns the googleId of the person thats logged in
     * param: req - the request object in the route
     * return: A string containing the google id
     */
    getUserId : (req) => {
        return req.session.googleId;
    },
    
    /*
     * Function: getSessionToken
     * Description: Get the token corresponding to the session.
     * param: req - the request object in the routes
     * return: A string containing the session token
     */ 
    getSessionToken : (req) =>{
        console.log(req.session);
        return req.session.token;
    },

    /*
     * Function: getSessionName
     * Description: Get the name of the person that is currently logged into the session
     * param: req - the request object in the routes
     * return: session object
     */ 
    getSessionName : (req) => {
        return req.session.name;
    },

    /*
     * name: storeUserCookie
     * Description: parses the user object in the req body 
     */
    parseUserObj : (req) => {
        const user = {
            token : req.body.accessToken,
            firstName : req.body.profileObj.givenName,
            lastName : req.body.profileObj.familyName,
            email : req.body.profileObj.email,
            googleId : req.body.profileObj.googleId
        }
        return user;
    },

    /*
     * Description : Creates demo duser, demo schedules, and demo quarters with the passed in value
     */ 
    createDemoData : async function(googleId){

        
    }

 }
 module.exports = ActionUtil;