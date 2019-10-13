const router = require('express').Router();
const cookieSession = require('cookie-session');
const userAction = require('../Action/UserAction');
const ActionUtil = require('../Action/ActionUtil');
const UserDao = require('../../model/UserDao');
const CourseAction = require('../Action/CourseAction');

/*
 * Route: /user
 * Description: Gets the account of the user that is currently logged in
 */
router.get("/", (req, res) => {
    const googleId = ActionUtil.getUserId(req);
    var userObject = {};
    userAction.getAccount(googleId)
        .then(user => {
            return userAction.formatBatchRequest(user);
        })
        .then( newUser => {
            //console.log(newUser);
            res.json(newUser);
        })
        .catch(err => console.log(err));
})

router.get("/test", (req, res) => {
    CourseAction.getCourseByArrId([1,2,3]).then( res => console.log(res));
})

router.post('/saveAcademicProgress', (req, res) => {
    
    academicProgressObj = {};
    academicProgressObj.googleId = ActionUtil.getUserId(req);
    academicProgressObj.taken_courses = req.body.taken_courses;
    academicProgressObj.ip_courses = req.body.ip_courses;
    academicProgressObj.needed_courses = req.body.needed_courses;
    userAction.saveAcademicProgress(academicProgressObj)
        .then(data => res.sendStatus(200));
}),

/*
 * Description : This deletes the accounts and clear the session
 */
router.get('/deleteAccount', (req, res)=>{
    const userId = ActionUtil.getUserId(req);
    userAction.deleteAccount(userId)
        .then(req.session = null)
        .then(res.sendStatus(200))
        .catch(err => console.log(err))
})

/* Route: /user/update
 * Description: update the user object with new information. Takes in the object with corresponding fields that it will update
 */
router.post('/update', (req, res) => {
    userAction.updateAccount(req)
        .then(user => res.json(user))
        .catch(err => console.log(err));
});

module.exports = router;
