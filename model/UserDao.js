/*
 * File: UserDao.js
 * Description: Data access for the User collections.
 */
const User = require('./UserSchema');

const UserDao = {
    /*
     * Function : getAccount
     * Parameters : userId -- The google id of the user
     * Description : Finds the user collection in the database
     * Return : A Promise with the entire user collection
     */
    getAccount : async function (userId){
        const user = await User.findOne({googleId : userId });
        return user;
    },
    /*
     * Functon getAccount
     * Parameters : None
     * Description : Gets an array of all the accounts in the database
     * Return : Array contianing all the collections
     */
    getAllAccounts : async function () {
        const collection = await User.find();
        return collection;
    },
    /*
     * Function : CreateAccount
     * Paramters : Profile object returned from google oauth
     * Description : Creates a new account using their unique profile id given by google, their email, and their first name
     * Return: A Promise with the new User collection
     */
    createAccount : async function(profile){
        var newUser = await User.create({
            googleId : profile.googleId ,
            email : profile.email,
            firstName : profile.firstName,
            lastName : profile.lastName,
            major : profile.major,
            schedules : profile.schedules,
            ip_courses : profile.ip_courses,
            needed_courses : profile.needed_courses,
            imageUrl : profile.imageUrl,
            standing : profile.standing,
            degreeAudit : profile.degreeAudit,
            taken_courses : profile.taken_courses,
            standing : profile.standing,
            college : profile.college
            });
        return newUser;
    },

    /*
     * Function   : removeAccount
     * Parameters : googleId of the account to be removed
     * Description: Removes the account of the user with the google id, and prints out the colleciton
     * Or it prints out null otherwise
     * Return : Nothing
     */
    removeAccount : async function(googleId){
        console.log("The google id is ", googleId);
        return await User.findOneAndRemove({"googleId": googleId})
    },

    /*
     * Description: Updates the account with the information from the object
     */
    updateAccount : async function(googleId, obj){
        const newUser = await User.findOneAndUpdate({googleId : googleId} , {$set : obj})
        return newUser
    },

    updateAcademicHistory: async function(googleId, taken, ip, needed){
        var neededId = [];
        var takenId = [];
        var ipId = [];

        //Parse the array of objects to return a list of ides
        needed.forEach(res => neededId.push(res.id));
        ip.forEach(res => ipId.push(res.id));
        taken.forEach(res => takenId.push(res.id));


        console.log("The needed being sent is ", neededId);
        console.log("The ip that is being send it ", ipId);
        console.log("The taken taht is being sent is ", takenId);

        return await User.findOneAndUpdate({"googleId" : googleId}, { $set : {needed_courses : neededId, taken_courses : takenId, ip_courses : ipId}})
    }

}

module.exports = UserDao;
