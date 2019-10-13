/*
 * File: passportSetup
 * Description: Handles the serialization and deserialization of
 * the user information. Uses passport to bind user object to the req object
 * so we can access the information user req.user
 */
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserAction = require('./Action/UserAction')
require('dotenv').config();

//Serialize and deserialize the user on login
passport.serializeUser((user, done) => {
    console.log("Serializing the user");
    //Storing the google id of the user into the cookie 
    done(null, user);
});

/*
 * This will get the id of the last person logged in
 */ 
passport.deserializeUser((user, done) => {
    console.log("deserializing the user");
    UserAction.getAccount(user.googleId).then((user) => {
        done(null, user);
    }).catch(err => console.log(err));
})

//Set up object containing all keys needed for oauth
const keys = {
    clientID: '39000677312-ndi9av8u0n0i7kp48ochqe5mp23rrmbp.apps.googleusercontent.com',
    clientSecret: 'go7wIohlijok0SSEGktrAFUy',
    callbackURL: "/auth/google/redirect"
}

passport.use(new GoogleStrategy(keys, (accessToken, refreshToken, profile, done) => {
    /*
     * Binds the userData object to req.session.user
     */
    var userData = {
        email : profile.emails[0].value,
        name: profile.displayName,
        token: accessToken,
        googleId : profile.id
    }

    /* 
     * Check if an account exists already. If it does then serialize the user otherwise, create a new
     * account
     */
    UserAction.getAccount(profile.id).then((user) => {
        //If the user is null then account does not exist so create a new one
        if(user === null){
            UserAction.createAccount(profile)
            .then( res => console.log("New account created"))
            .catch(err => console.log(err));
        }
    }).catch(err => console.log(err) );

    done(null, userData)
}));
