
const Validator = {
    //This function will be used as middleware to validate the route
    authCheck : function (req, res, next) {
        console.log("The session user is " + req.user)
        if(!req.user){
            res.redirect('/');
        }
        else{
            next();
        }
    }
}

module.exports = Validator;