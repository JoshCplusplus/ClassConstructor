/*
 * File: ScheduleAction.js
 * Author: Matthew
 * Description: Action class called from ScheduleRoutes
 */

 const ScheduleDao = require("../../model/ScheduleDao");
 const UserDao = require("../../model/UserDao");
 const ActionUtil = require("./ActionUtil");
 const QuarterAction = require("./QuarterAction");

 const ScheduleAction = {

    /*
    * Function: createSchedule
    * Param: req: req obj from routes containing user info
    *        newName : name of new Schedule
    * Description: creates a new schedule obj with the given name, with empty quarters
    * Returns: new schedule Obj containing the id
    */
   createSchedule : async function (req, newName) {
        //call the createSchedule from DAO
        const newSchedule = await ScheduleDao.createSchedule( { name: newName, quarters: [] } );
        //getAccount from req Obj id (from util)
        const id = await ActionUtil.getUserId(req);
        //add new schedule into the account's schedule arrays through DAO
        await ScheduleDao.addSchedule(id, newSchedule._id);
        return newSchedule;
   },

   /*
    * Function: createSchedule(name)
    * Param: req: req obj from routes
    *        name: string obj
    * Desc: creates a new schedule obj with the given name, with empty quarters
    * Returns: Nothing
    */
    deleteSchedule : async function (req, scheduleId) {
        const id = await ActionUtil.getUserId(req);
        var user = await UserDao.getAccount(id);
        //call scheduleDao.delete
        await ScheduleDao.deleteSchedule(id, scheduleId);
        user = await UserDao.getAccount(id);
        return user.schedules;
    },

   /*
    * Function: save
    * Parameters: scheduleObj: {
    *      _id : mongoId
    *      name : String
    *      quarters : quarterObjs }
    * Description: Sets the users schedule from param id to the new array 
    *  of quarter objects 
    * Return: the new schedule object
    */
    save : async function (scheduleObj) {
        //pass the name and quarters in a new obj -> scheduleDao
        await ScheduleDao.saveSchedule({
            "_id": scheduleObj.id,
            "name": scheduleObj.name
        });
        var scheduleId = scheduleObj.id;
        for(var i = 0; i < scheduleObj.quarters.length; i++){
            await QuarterAction.updateQuarter(scheduleObj.quarters[i], scheduleId);
        }
        //return the new scheduleObj
        const v =  await ScheduleDao.getSchedule(scheduleObj.id);
        return v;
    },

    /*
     * Function: 
     * Parameters: 
     * Description: 
     * Return: 
     */
    saveName : async function (scheduleId, newName) {
        console.log("saveName" , scheduleId, newName);
        await ScheduleDao.saveSchedule({
            "_id": scheduleId,
            "name": newName
        });
    },

    /*
     * Function : getScheduleByArrId
     * Param : scheduleArr : array of user's scheduleids
     * Description: Get a list of schedule objects by their array
     * Return: array of schedule objects filled with quarterIds and names
     */
    getScheduleByArrId : async function(scheduleArr){
        const objArr = [];
        for(var i = 0; i < scheduleArr.length; i++){
            const scheduleObject = await ScheduleDao.getSchedule(scheduleArr[i]);
            objArr.push(scheduleObject);
        }
        return objArr;
    },

}

 module.exports = ScheduleAction;
