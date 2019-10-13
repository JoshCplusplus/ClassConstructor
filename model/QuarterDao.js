/*
 * File: QuarterDao
 * Description: Accessses and modifies values relating to quarters in the database
 * Author: Matt , Phuc, Arman
 */

const Quarter = require('./QuarterSchema');
const Schedule = require('./ScheduleSchema');
const ScheduleDao = require('./ScheduleDao');

const QuarterDao = {

    /*
     * FunctionL getQuarater
     * Parameter: QuarterId
     * Description: Finds the collection with the quarter id
     * Return: Collection of the quarter or null if it doese not exist
     */
    getQuarter: async function(quarterId){
        if(quarterId){
            return await Quarter.findOne({_id : quarterId});
        }
        else{
            return await Quarter.find();
        }
    },

    /*
     * Create a new quarter by passing in a n object containing all the information
     * Param: obj : {
     *  courses : []
     *  season : of quarter in sechedule
     *  year: year of current quarter
     *  schedule: mongoId of the schedule it is in
     *  }
     * Return: quarter obj that was created
     */
    createQuarter : async function(obj){
        if(obj){
            return await Quarter.create({courses: obj.courses, season : obj.season, year: obj.year, schedule : obj.schedule});
        }
        else{
            return await Quarter.create({courses: [], season: '', year : '', schedule : '' });
        }
    },

    /* Function: addCourse
     * Description: adds either a single course to the quarter or an array of courses.
     * Paramater: Either the course id being added or an array of course id's
     * Description: adds a new course to the course Array in the quarter collection
     */
    addCourse : async function(quarterId, courseId){
        //If the courseId is a type array then add each element. Otherwise just add the single element
        if(courseId.constructor === Array){
            const res = await Quarter.findByIdAndUpdate(quarterId, {$push: {courses : {$each : courseId}}},  {$safe: true, $upsert : true});
            return res;
        }
        else{
            return await Quarter.findByIdAndUpdate(googleId, { $push:{ courses: courseId }}, {$safe: true, $upsert : true});
        }
    },

    /*
     * Function: removeQuarter
     * Desctiption : Removes quarter of quarterId 
     * Param: quarterId: of quarter to delete in db
     * Return: Nothing
     */
    removeQuarter : async function(quarterId){
        await Quarter.findOneAndRemove({ _id : quarterId });
        return;
    },

    /*
     * Function : removeCourse
     * Parameters: quarterId, CourseId
     * Description: Searches for the document of quarterId and removes all instances of courseId from the course array
     * Return: Document of the quarter being remvoed from
     */
    removeCourse : async function(quarterId, courseId){
        const res =  await Quarter.findByIdAndUpdate(quarterId, {$pull : {courses: courseId}});
        return res;
    },

    /*
     * Function: addQuarterToSchedule
     * Param: scheduleId: mongoId to add to
     *   quarterId: new quarterid to add
     * Descriptions : Add a quarter id to the end of a users schedules list
     * Return : old schedule obj, not used
     */
    addQuarterToSchedule : async function(scheduleId, quarterId){
        //Getting the schedule object
        if(!scheduleId){
            return;
        }
        var schedule = await Schedule.findById(scheduleId);
        schedule.quarters.push(quarterId);
        //Set the quarter to be the old quarter plus one more
        return await Schedule.findByIdAndUpdate(scheduleId, {$set : {quarters : schedule.quarters}}, {new: true})
    },

    /*
     * Created by phuc
     * Description : sets a schedule quarters array with a pregiven array
     */
    setQuarterToSchedule : async function(scheduleId, quarterIdArr){
        return await Schedule.findByIdAndUpdate(scheduleId, {$set : {quarters : quarterIdArr}}, {new : true})
    },

    /*
     * Function: updateQuarter
     * Param: obj : {
     *  year : year of quarter
     *  season: season of quarter
     *  courses: list of courseIds to add in qurter
     *  schedule: scheduleid that contsins this quarter
     *  }
     */
    updateQuarter : async function (obj){
        return await Quarter.findByIdAndUpdate(obj._id, {$set : {courses: obj.courses, season : obj.season,
            year : obj.year, schedule : obj.schedule}});
    },

    /*
     * Function: setQuarterNew
     * Param: quarterId: mongoId of quarter
     *    quarterArray : new courseIds to set to courses arr
     * Description: sets courses array to the passed in array
     * Return: new quarter obj
     */
    setQuarterNew : async function (quarterId, quarterArray){
        return await Quarter.update({_id : quarterId}, {$set : {courses : quarterArray}});
    }


}
module.exports = QuarterDao;
