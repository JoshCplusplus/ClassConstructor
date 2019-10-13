/*
 * File: ScheduleRoutes.js
 * Description: Recieves fetch requests regarding schedule creations, edits or removals
 * Author: Matthew, Phuc
 */

const router = require('express').Router();
const cookieSession = require('cookie-session');
const scheduleAction = require('../Action/ScheduleAction');
const ActionUtil = require('../Action/ActionUtil');

//Tester route
router.get('/', (req, res) => {
    res.send("hello");
})

/*
 * Route: /schedule/create
 * Description: creates a new empty schedule with given name from front end
 * Payload to recieve: { scheduleName: String }
 * Return payload : mongoId of the new schedule created
 */
router.post('/create', (req, res) => {
    scheduleAction.createSchedule(req, req.body.scheduleName ).then(result => res.json(result));
})

/*
 * Route: /schedule/delete
 * Description: deletes a schedule from the db, all quarters associated
 * with the schedule, and the scheule from users list of schedules
 * Payload to recieve: req : {user obj}
 *  { scheduleId : mongoId of the schedule to delete }
 * Return payload : new user array of schedule ids
 */
router.post('/delete', (req, res) => {
    scheduleAction.deleteSchedule(req, req.body.scheduleId).then( user => res.send(user));
})

/*
 * Route: /schedule/save
 * Description: saves edited quarter passed in from front end
 * Payload to recieve: 
 *      scheduleObj : {
 *      _id : mongoId
 *      name : String
 *      quarters : quarterObjs[] to save 
 * }
 * Return payload : new schedule Obj from db
 */
router.post('/save', (req, res) => {
    scheduleAction.save(req.body.schedule).then( c => res.send(c));
});

/*
 * Route: /schedule/saveName
 * Description: Saves new name to the schedule given
 * Payload to recieve: { 
 *      schdeuleId : mongoId of schedule to edit
 *      name: new name fo schedule }
 * Return payload : None
 */
router.post('/saveName', (req, res) => {
    scheduleAction.saveName(req.body.scheduleId, req.body.name);
});



module.exports = router;
