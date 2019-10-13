/*
 * File:
 * Description: 
 * Author: 
 */

const Schedule = require('./ScheduleSchema');
const User = require('./UserSchema');
const QuarterDao = require('./QuarterDao');

const ScheduleDao = {
    /*
     * Function: GetSchedule
     * Description: Gets a single schedule if a schedule id is specified, or gets every schedule
     * Parameters: scheduleId(optional)
     * Return: promise containing the schedule collectiion, null, or array of collections
     */
    getSchedule: async function(scheduleId){
        if(scheduleId){
            return await Schedule.findOne({_id: scheduleId})
        }
        else{
            return await Schedule.find();
        }
    },

    /*
     * Function: createSchedule
     * Description: Creates an empty schedule in the database.
     * Paramters: optional object in the format
     * {
     *  name : String,
     *  quarter : Array of quarter Id's
     * }
     * Return: New schedule collection object
     */
    createSchedule: async function(obj){
        if(obj){
            return await Schedule.create({name : obj.name, quarters : obj.quarter});
        }
        else{
            return await Schedule.create({name: '', quarters : []});
        }
    },

    /*
     * Function: addSchedule
     * Parameters: googleId of the account to be edited
     *             scheduleId of the schedule to be added to the array
     * Description: adds the scheduleId to the user's schedule array
     * Return: Nothing
     */
    addSchedule : async function(userId, scheduleId){
        var user = await User.findOne({ "googleId" : userId });
        //add schedule to the end of "schedule" array
        var newSchedules = user.schedules;
        newSchedules.push(scheduleId);
        //replace old user in the DB with new user obj
        return await User.findOneAndUpdate({ "googleId" : userId},
                {"schedules" : newSchedules}, (err, res) => {
        });
    },

    /*
     * Function: deleteSchedule
     * Parameters: googleId of the account to be edited
     *             scheduleId of the schedule to be removed from array
     * Description: deletes the scheduleId from the schedules array,
     *              deletes the schedule from the schedules database
     * Return: Nothing
     */
    deleteSchedule : async function (userId, scheduleId){
        console.log("in delete DAO");
        console.log("Usre is: " + userId);
        console.log("ScheduleId is : " + scheduleId);
        var user = await User.findOne({ "googleId" : userId });
        //remove schedule from "schedules" array
        var newSchedules = user.schedules;
        for(var i = 0; i < newSchedules.length; i++){
            if(newSchedules[i] == scheduleId){
                newSchedules.splice(i,1);
                break;
            }
        }
        //replace old user in the DB with new user obj
        await User.findOneAndUpdate({ "googleId" : userId},
                {"schedules" : newSchedules}, (err, res) => {});
        console.log(scheduleId);
        var sched = await ScheduleDao.getSchedule(scheduleId);
        for(i=0; i < sched.quarters.length; i++){
            console.log("Going to remove: " + sched.quarters[i]);
            await QuarterDao.removeQuarter(sched.quarters[i]);
        }
        console.log("Done with the for");
        //remove schedule from the schedule database now
        return await Schedule.findOneAndRemove({ _id : scheduleId}, (err, res) => { });
    },

    /*
     * Function: saveSchedule
     * Parameters: scheduleId of the account to be edited
     *             scheduleObj of the schedule to be replaced in array
     * Description: changes the schedule at the id in the schedules DB
     * Return: Nothing
     */
    saveSchedule : async function (obj) {
        console.log(obj);
        return await Schedule.findOneAndUpdate({ "_id" : obj._id},
                { $set : {"name": obj.name}}, (err, res) => { });
    },

    removeQuarterFromSchedule : async function(scheduleObj) {
        console.log("We are deleting the scheudle obj", scheduleObj);
        return await Schedule.findOneAndUpdate({"_id" : scheduleObj._id},{$set : { quarters : scheduleObj.quarters}})
    }

}

module.exports = ScheduleDao;
