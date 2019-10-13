const router = require('express').Router();
const passport = require('passport');
const ActionUtil = require('../Action/ActionUtil');
const UserAction = require('../Action/UserAction');


router.post('/client-login', (req, res) => {

    //returns user object with the fields token, name, email, and googleid populated from the request
    var user = {
        token : req.body.accessToken,
        firstName : req.body.profileObj.givenName,
        lastName : req.body.profileObj.familyName,
        email : req.body.profileObj.email,
        googleId : req.body.profileObj.googleId,   
        imageUrl : req.body.profileObj.imageUrl,
    }
    
    //Store the user object into the local session except their courses
    req.session = user;
    
    var defaultVal = {
        major : "undeclared",
        standing : 2,
        degreeAudit : false,
        ip_courses : [],
        needed_courses : [],
        taken_courses : [],
        schedules : [],
        standing : 1,
        college : 1
    }

    //Add default values to the object and removes token because it is not stored in the database
    user = Object.assign(user, defaultVal)
    delete user.token;
    
    //Create the account if it exists
    UserAction.createAccountIfExist(user.googleId, user)
        .then((newUser) => res.sendStatus(200))
        .catch(err => console.log(err));
})

//inital login route
router.get('/login', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt : "select_account"
}));

// Callback route that sends the user back to the front end
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    
    const token = req.user.token;
    res.redirect("http://localhost:3000/login?token=" + token);  
    
});

module.exports = router;