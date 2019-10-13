/* 
 * File: QuarterRoutes.js
 * Description: Recieves fetch requests from front end in order to call action classes
 * Author: Matthew, Phuc, ...
 */

const router = require('express').Router();
const QuarterAction = require('../Action/QuarterAction');
const ActionUtil = require('../Action/ActionUtil');
const UserAction = require('../Action/UserAction')


router.get('/', (req, res) => {
    res.send("quarters!");
})

/*
 * Route: /quarter/update
 * Description: creates a new empty quarter object with given fields
 * res.body.quarterObj :
 *  {   _id : -1
 *      courses: []
 *      season : String
 *      year: String 
 *      schedule : mongoId of schedule it is in 
 *  }
 * return payload: quarterId of new quarter
 */
router.post('/update', (req, res) => {
    QuarterAction.updateQuarter(req.body.quarterObj, req.body.quarterObj.schedule).then( quarter => res.send(quarter));
})

/*
 * Route: /quarter/delete
 * Description : deletes the last quarter in the schedule
 * Return: status code 200 if succeed
 * parameter : Schedule Id
 */
router.post('/delete', (req,res) => {

    console.log(req.body);
    QuarterAction.deleteQuarter(req.body.scheduleId, req.body.quarterId)
        .then(res.sendStatus(200));
})

/*
 * Route: /quarter/reccomend
 * Description: Fills in the quarter with reccomended classes based on users progress
 * Payload to recieve: {scheduleId : "5cf1a0975397463369553d2a", quarterId : 5cf1a0975397463369553d2e" } 
 * return payload : { courses : Arr of courses }
 */
router.post('/recommend', (req, res) => {
    const googleId = ActionUtil.getUserId(req);
    const scheduleId = req.body.scheduleId;
    const quarterId = req.body.quarterId;
    
    //Added error checking
    UserAction.getAccount(googleId)
        .then(user => {
            if(user.needed_courses.length == 0 ){
                res.sendStatus(420)
            }
            else{
                return QuarterAction.recommendQuarterV2(googleId, scheduleId, quarterId);
            }
        })
        .then(data => {
            res.json(data);
        })

    // QuarterAction.recommendQuarterV2(googleId, scheduleId, quarterId)
    //     .then(data => {
    //         res.json(data); 
    //     })
    //     .catch(err => {

    //     });
})

module.exports = router;