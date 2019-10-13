/*
 * File: QuarterAction.js
 * Description: Contains functions to edit quarter objects and
 * create new ones, calls the quarter and schedule DAO classes
 * Author: Matt, Phuc, Arman
 */

const QuarterDao = require("../../model/QuarterDao");
const ScheduleDao = require("../../model/ScheduleDao");
const UserDao = require("../../model/UserDao");
const ActionUtil = require("./ActionUtil");
const CourseDao = require("../../model/CourseDao");
const CourseAction = require("../Action/CourseAction")
const UserAction = require('../Action/UserAction')

const QuarterAction = {

    /*
     * Function: addQuarter
     * Parameters: quarterobj in format:
     * { _id : mongoId
     *   season: String,
     *   year: #,
     *   courses: [ courseIds ]
     *   schedule : schedulId }
     *  Description: Adds a quarter obj under the given id
     *  if the id is -1, then make a new quarter
     *  Returns: id of a newly created schedule, otherwise, the updated quarter
     */
    updateQuarter : async function(obj){
        if ( obj._id  === "-1" ){
            //create it in the quarter path
            const quarter = await QuarterDao.createQuarter(obj);
            //add it to the schedule since it is new
            await QuarterAction.addQuarterToSchedule(obj.schedule, quarter._id);
            return quarter._id;
        }
        //update existing quarter
        var courseIds = [];
        //add course Ids of the course objects passed in
        for(let i in obj.courses){
            courseIds.push(obj.courses[i].id);
        }
        obj.courses = courseIds;
        //update the quarter
        return await QuarterDao.updateQuarter(obj);
    },

    /*
     * Created by Phuc
     * Function: setQuarterNew
     * Param : quarterId :mongo Id of quarter to edit
     *  obj: obj containing new quarter fields 
     * Description : updates an existing quarter object in the array with a new object
     * Note : This will override the existing field with a new field
     */
    setQuarterNew : async function(quarterId, obj){
        return await QuarterDao.setQuarterNew(quarterId, obj);
    },

    /* 
     * Function: createQuarter
     * Param: obj : obj with quarter fields
     * Description: creates a new quarter in the db
     * Returns: mongoId of the quarter created
     */
    createQuarter : async function (obj){
        const quarter = await QuarterDao.createQuarter(obj);
        return quarter._id;
    },


    /*
     * Function: getQuarterByArrId
     * Param : quarterIdArr : array of quarterIds 
     * Description: Takes an list of quarter id's and returns a list of associated quarter objects
     * Returns: list of quarter objects from the db
     */
    getQuarterByArrId : async function(quarterIdArr){
        const objArr = [];
        for(var i = 0; i < quarterIdArr.length; i++){
            const quarterObject = await QuarterDao.getQuarter(quarterIdArr[i]);
            objArr.push(quarterObject);
        }
        return objArr;
    },
    /*
     * Description : Looks for a schedule by its scheduile id, and add a
     * quarter to it
     */
    addQuarterToSchedule : async function(scheduleId, quarterId){
        return await QuarterDao.addQuarterToSchedule(scheduleId, quarterId)
    },

    /* NOT USED
     * removeCourse
     * Param: courseId to remove
     *        quarterId: quarter to remove from
     * Desc: removes course from a specified quarter
     */
    removeCourse : async function(courseId, quarterId){
        var quarter = await QuarterDao.getQuarter(quarterId);
        console.log(quarter);
        for(var i = 0; i < quarter.courses.length; i++){
            if(quarter.courses[i] === courseId){
                quarter.courses.splice(i,1);
            }
        }
        await QuarterAction.updateQuarter(quarter);
        return await QuarterDao.getQuarter(quarterId);
    },

    /*
     * Function: deleteQuarter
     * Parameters: quarterId of quarter to delete
     * Description: goes into the schedule and removes id from quarter array,
     * and then deletes the quarter obj from the database
     * Returns: Nothing
     */
    deleteQuarter : async function (scheduleId, quarterId) {
        const quarter = await QuarterDao.getQuarter(quarterId);
        var schedule = await ScheduleDao.getSchedule(scheduleId);
        
        //removes quarterId in the array 
        for(var i = 0; i < schedule.quarters.length; i++){
            if(schedule.quarters[i] == quarterId){
                schedule.quarters.splice(i,1);
                break;
            }
        }


        //saves schedule with removed class
        await ScheduleDao.removeQuarterFromSchedule(schedule);
        //remove the quarter from the db
        return await QuarterDao.removeQuarter(quarterId);
    },


    /*
     * Description : Adapter class to parse the season of the incoming quarter to match
     * the field in the database.
     * incoming : summer-1 converted : s1
     * parameter : The season to be converted
     */
    parseSeason : function(season){
        console.log("inside the parse season", season)
        switch(season){
            case "Fall":
                return "FA";
                break;
            case "Winter":
                return "WI";
                break;
            case "Spring":
                return "SP";
                break;
            case "Summer-1":
                return "S1"
                break;
            case "Summer-2":
                return "S2"
                break;
            default:
                return null;
        }
    },

    /*
     * Function: reccomendQuarter
     * Parameters: user id and quarter to reccomend
     * Description: loops up to quarter to be planned storing all planned/taken courses
     * and crossreference with
     */
    reccomendQuarter: async function (userId, obj) {
        var schedule = await ScheduleDao.getSchedule(obj.schedule);
        var plannedCourses = user.taken_courses.concat(user.ip_courses); //user completed/in progress courses
        var i = 0;
        var possibleCourses = [];

        //loop through quarters til current quarter
        for(i = 0; i < schedule.quarter.length; i++){
            if(schedule.quarter[i] === obj._id){
                break;
            }
            var currQuarter = await QuarterDao.getQuarter(schedule.quarter[i]);
            //adds all planned/completed courses to planneCourses array
            for(var j = 0; j < currQuarter.courses.length; j++){
                plannedCourses.push(currQuarter.courses[j]);
            }
        }
        //loop through needed courses
        //1. check prereq, if not satisfied remove
        for(let courseId in user.needed_courses){
            var course = await CourseDao.getCourse(courseId);
            //course not in plannedCourses and prequisites satisfied
            var currNum = 0;
            if( !plannedCourses.includes(courseId)){
                //loop through array of prereq arrays
                for(let preReqArr in course.prereqs){
                    //loop through each prereq of current requirement
                    for(let preReq in preReqArr){
                        if(plannedCourses.includes(preReq.id)){
                            currNum++;
                            break;
                        }
                    }
                    if(preReqArr.length === currNum){
                        possibleCourses.push(courseId);
                    }
                }
            }

        }
        //loop through all courses possible precentages and if in
        //possible courses array include into reccomended courses for
        //the selected quarter break at 16 units
        console.log(possibleCourses);
    },

    /*
     * Function : reccommendQuarterBetter
     * Param: userId : current user's unique id
     *  quarterId: quarter to suggest classes
     * Description: takes in the userid and quarterId
     */
    recommendQuarterBetter : async function(userId, quarterId ){
        
        //Get list of quarters from the schedule


        //Get a list of all courses
        var quarter = await QuarterDao.getQuarter(quarterId); 
        var user = await UserDao.getAccount(userId);
        var taken_courses = user.taken_courses;
        var totalUnits = 0;

        //Returns an array of objects of the required courses
        var needed_courses = await CourseAction.getCourseByArrId(user.needed_courses);

        //Concatenate it with every quarter that is being added into the

        //Filter out the list so that it only shows courses that are cleared and have not been taken
        var filtered_courses = needed_courses.filter(curr => {
            let curr_prereqs = curr.prereqs;
            var b = CourseAction.clearedCourses(taken_courses, curr_prereqs) && !(taken_courses.includes(curr.id));
            return b;
        });

        var returnObj = { courses : []};

        filtered_courses.forEach(entry => {
            var newUnits = totalUnits + parseInt(entry.units[0]);
            if(newUnits < 16){
                totalUnits = newUnits;
                returnObj.courses.push(entry);
            }
        });
    
        //Update the database 
        returnObj.courses.forEach( courses => {
            taken_courses.push(courses.id)
        })

        //Update the database with the new account
        UserDao.updateAccount(userId, {taken_courses : taken_courses});
        return returnObj;
    },

    /*
     * Takes in the userId, the scheduleId, and the quarterId
     */
    recommendQuarterV2 : async function(userId, scheduleId, quarterId){
        
        var res = await Promise.all([UserDao.getAccount(userId), ScheduleDao.getSchedule(scheduleId), QuarterDao.getQuarter(quarterId)]);
        
        var user = res[0];
        var schedule = res[1];
        var Quarter = res[2];
        var taken_courses = user.taken_courses;
        var totalUnits = 0;     
        var courseArr = [];
        var season = this.parseSeason(Quarter.season); //This parses the season string to match the database field
        var department = user.needed_courses[0].split(' ')[0];

        //Get a list of all the courses in the quarters of the schedules
        for(var i = 0; i < schedule.quarters.length; i++){
            var Quarter = await QuarterDao.getQuarter(schedule.quarters[i]);
            const curr_course = Quarter.courses
            courseArr = courseArr.concat(curr_course);
        }
        
        //Concatenate the taken courses with the the courses in the quarters to create a list of taken courses, 
        //and turn that into a list of objects instead of ids 
        taken_courses = taken_courses.concat(courseArr).concat(user.ip_courses);
        var needed_courses = await CourseAction.getCourseByArrId(user.needed_courses);

        console.log("*************The taken courses are *****************")
        taken_courses.forEach(res => console.log(res))
        console.log("*************The taken courses are *****************")

        //Filter the list of courses based on requirements
         var filtered_courses = needed_courses.filter(curr => {
            let curr_prereqs = curr.prereqs;
            return CourseAction.clearedCourses(taken_courses, curr_prereqs) && !(taken_courses.includes(curr.id));     
        });

        console.log("*************The filtered courses are *****************")
        filtered_courses.forEach(res => console.log(res.id))
        console.log("*************The filtered courses are *****************")

        console.log("******* THe season is **(****+**********")
        console.log(season);
        filtered_courses.sort((a,b) => { 
            //return b.quarter_offered[season].percent_offer - a.quarter_offered[season].percent_offer 
            if(a.quarter_offered[season].percent_offer > b.quarter_offered[season].percent_offer){
                return -1
            }
            else if(a.quarter_offered[season].percent_offer < b.quarter_offered[season].percent_offer){
                return 1;
            }
            else{
                //If both the courses are cse then sort by alphabetical
                if(a.department === department && b.department == department){
                    if(a.id > b.id){
                        return -1;
                    }
                    else{
                        return 1;
                    }    
                }
                else if(a.department === department && b.department !== department){
                    return -1;
                }
                else{
                    return 1;
                }
        }})

        const returnArr = [];
        
        // if(filtered_courses.length >= 4){
        //     returnArr[0] = filtered_courses[0];
        //     returnArr[1] = filtered_courses[1];
        //     returnArr[2] = filtered_courses[2];

        //     var found = false;
        //     //Find the next non cse course and add it to the course
        //     for(var i = 0; i < filtered_courses.length; i++){
        //         if(filtered_courses[i].id.split(' ')[0] !== department){
        //             returnArr[3] = filtered_courses[i];
        //             found = true;
        //             break;
        //         }
        //     }

        //     //If we cant find another non cse course then just add the last one
        //     if(found === false){
        //         returnArr[3] = filtered_courses[3]
        //     }
        // }
        // else{
        //     //If the filtered_course has less length than four then just add all of them 
        //     filtered_courses.forEach(res => returnArr.push(res));
        // }
        var counter = 0;
        for(var i = 0; i < filtered_courses.length; i++){
            if(counter > 3){
                break;
            }
            returnArr.push(filtered_courses[i]);
            counter++;
        }

        console.log("*************************final return array*********************")
        returnArr.forEach(res => console.log(res.id));
        console.log("*************************final return array*********************")
        //Create an array of id's to be able to update the database
        const idArr = []

        returnArr.forEach(req => { idArr.push(req.id)}); //Create a list of id's
        console.log("********Setting the new data***********");
        const newQuarters = await QuarterDao.setQuarterNew(quarterId, idArr) //updating the quarter collection in the database

        const returnObj = {
            data : returnArr
        }

        return returnObj;
    }
}

module.exports = QuarterAction;
