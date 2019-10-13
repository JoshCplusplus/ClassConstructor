/*
 * file: UserAction.js
 * author: Matt + Phuc
 * desc: User Action Classes
 */
const UserDao = require("../../model/UserDao");
const ActionUtil = require("./ActionUtil");
const CourseAction = require('./CourseAction');
const ScheduleAction = require('./ScheduleAction');
const QuarterAction = require('./QuarterAction');
const ScheduleDao = require('../../model/ScheduleDao');

const UserAction = {
    /*
     * Function: getAccount
     * Parameters: userID - users unique id that you can get from req.session.passport.user.googleId
     * Description: Parses collection and return a userData object
     * Return: Null if the account does not exist
     */
    getAccount : async function (userID){
        const user = await UserDao.getAccount(userID);
        return user;
    },
    /*
     * Function: createAccount
     * Parameter : takes in the profile object returned from google oauth
     */
    createAccount: async function(profile){
        //Creates the account
        const User = await UserDao.createAccount(profile);
        return User;
    },

    /*
     * Takes a user collection returned from the database and formats
     * it for the front end
     * param: user -- The user collection returned from the backend
     */
    formatBatchRequest : async function(user){
        const takenObjArr = await CourseAction.getCourseByArrId(user.taken_courses);
        const neededObjArr = await CourseAction.getCourseByArrId(user.needed_courses);
        const ipObjArr = await CourseAction.getCourseByArrId(user.ip_courses);
        const courseArr = await CourseAction.getAllCourses();

        //Array of schedule objects
        const scheduleArr = await ScheduleAction.getScheduleByArrId(user.schedules);

        //For loop that iterates through every schedule item and replaces the quarter list with a list of objects
        for(var i = 0; i < scheduleArr.length; i++){
            const QuarterList = await QuarterAction.getQuarterByArrId(scheduleArr[i].quarters); //Gets the list of quarter objects for each schedule
            scheduleArr[i].quarters = QuarterList;
            //Loop through each quarter object and convert the list of ids to list of courses
            for(var j = 0; j < scheduleArr[i].quarters.length; j++){
                scheduleArr[i].quarters[j].courses = await CourseAction.getCourseByArrId(scheduleArr[i].quarters[j].courses)
            }
        }

        const newUser = {};
        user.schedules = scheduleArr;
        user.taken_courses = takenObjArr;
        user.needed_courses = neededObjArr;
        user.ip_courses = ipObjArr;
        newUser.user = user;
        newUser.courseList = courseArr;

        return newUser;
    },

    /*
     * Creates the account if it exists
     * paramter : googlId - googleid of the user logged in
     *            profile - profile object that will be parsed
     * return : Collection object containing the user information
     */
    createAccountIfExist : async function(googleId, profile){
        const User = await UserDao.getAccount(googleId);

        if(User === null){
            //If if is garys account then create the demo account instead
            if(googleId === "112598672885466766088"){
                return await this.createDemoAccount(profile)
            }

            return await UserDao.createAccount(profile);
        }
        else{
            console.log("Account already exists")
            return User;
        }
    },

    /*
     * Update the user table in the database the object in the response header
     * parameter : req - The req object in the routes
     */
    updateAccount : async function(req){
        const googleId = ActionUtil.getUserId(req);
        await UserDao.updateAccount(googleId, req.body);
        return await UserDao.getAccount(googleId); //Returns the newly updated account
    },



    
    /*
     * Description : Create demo account from the default user object
     */
    createDemoAccount : async function(user){
        user.degreeAudit = true;
        user.ip_courses = [
            "CSE 103",
            "CSE 101",
            "CSE 105",
            "CSE 110",
            "CSE 132A",
            "CSE 151",
            "CSE 190",
            "MGT 103"
            ];
        
        user.needed_courses = [
            "CSE 140",
            "CSE 141",
            "CSE 140L",
            "CSE 141L",
            "CSE 120",
            "CSE 123",
            "CSE 124",
            "CSE 107",
            "CSE 127",
            "CSE 194",
            "CSE 197",
            "CSE 198",
            "CSE 199",
            "COGS 121",
            "COGS 187A",
            "COGS 188",
            "MGT 110",
            "MGT 121A",
            "MGT 164",
            "MGT 166",
            "MGT 172",
            "MGT 174",
            "MGT 181",
            "COGS 101A",
            "COGS 101C",
            "COGS 102A",
            "COGS 102C",
            "COGS 107A",
            "COGS 107C",
            "COGS 108A",
            "COGS 108C",
            "COGS 108D",
            "COGS 108E",
            "COGS 108F",
            "COGS 109",
            "COGS 118A",
            "COGS 118B",
            "COGS 130",
            "COGS 131",
            "COGS 132",
            "COGS 150",
            "COGS 153",
            "COGS 170",
            "COGS 180",
            "COGS 182",
            "COGS 185",
            "COGS 187B",
            "ECE 100",
            "ECE 194",
            "ECON 100A",
            "ECON 100B",
            "ECON 110A",
            "ECON 110B",
            "ECON 113",
            "ECON 120B",
            "ECON 120C",
            "ECON 170A",
            "ECON 170B",
            "ECON 171",
            "ECON 172A",
            "ECON 172C",
            "ECON 178",
            "LIGN 110",
            "LIGN 111",
            "LIGN 115",
            "LIGN 125",
            "LIGN 160",
            "LIGN 163",
            "LIGN 165",
            "LIGN 175",
            "MAE 100",
            "MAE 194",
            "MATH 100",
            "MATH 194",
            "MUS 171",
            "MUS 173",
            "PSYC 161",
            "COMM 105G",
            "COCU 177",
            "ECON 120A",
            "PHYS 105",
            "WCWP 100"
            ]

        user.taken_courses = [
        "CSE 11",
        "CSE 5A",
        "CSE 12",
        "CSE 15L",
        "CSE 20",
        "CSE 21",
        "CSE 30",
        "MATH 20A",
        "MATH 20B",
        "MATH 20C",
        "MATH 18",
        "PHYS 2A",
        "PHYS 2B",
        "CSE 100",
        "LIHL 114W",
        "USP 151",
        "HILD 7C",
        "CSE 95",
        "PHIL 102A",
        "COMM 103",
        "POLI 101",
        "ARTF 111",
        "ENGL 105",
        "GEOG 102",
        "MATH 141",
        "CHEM 4",
        "ENGL 205",
        "HUMN 201",
        "BIOL 210A",
        "LISP 1A",
        "LISP 1AX",
        "PHYS 2BL",
        "PHYS 2CL",
        "PHYS 2DL",
        "PSYC 1",
        "SOCI 1",
        "PHYS 2C",
        "PHYS 2D",
        "MATH 11",
        "MATH 20D",
        "IGET 0"
        ]

        //Create an empty schedule
        var schedule = await ScheduleDao.createSchedule({name : "test-schedule-one", quarters : []})
        var scheduleTwo = await ScheduleDao.createSchedule({name : "test-schedule-two", quarters : []})

        //Quarter objects
        

        var res = await Promise.all([
                           QuarterAction.createQuarter({courses : ["AIP 197P", "CSE 112", "CSE 132A"], season : "FA", year : 2018, schedule : schedule._id}), 
                           QuarterAction.createQuarter({courses : ["CSE 105","MATH 154", "LTLA 105"], season : "WI", year : 2019, schedule : schedule._id}), 
                           QuarterAction.createQuarter({courses : ["LTWR 295","CSE 101","MATH 154"], season : "SP", year : 2019, schedule : schedule._id}), 
                           QuarterAction.createQuarter({courses : ["CSE 101","AAS 198", "AAS 87"], season : "FA", year : 2018, schedule : scheduleTwo._id}),
                           QuarterAction.createQuarter({courses : ["AIP 197P", "CSE 112", "CSE 132A"], season : "WI", year : 2019, schedule : scheduleTwo._id}), 
                           QuarterAction.createQuarter({courses : [], season:"FA", year : "2019", schedule : schedule._id})
                        ])

         var firstQuarter =  res[0];
         var secondQuarter = res[1];
         var thirdQuarter = res[2];
         var fourthQuarter = res[3];
         var fifthQuarter =  res[4];
         var sixthQuarter =  res[5]; 


        var res = await Promise.all([QuarterAction.addQuarterToSchedule(schedule._id, firstQuarter._id), 
                           QuarterAction.addQuarterToSchedule(schedule._id, secondQuarter._id), 
                           QuarterAction.addQuarterToSchedule(schedule._id, thirdQuarter._id), 
                           QuarterAction.addQuarterToSchedule(scheduleTwo._id, fourthQuarter._id), 
                           QuarterAction.addQuarterToSchedule(scheduleTwo._id, fifthQuarter._id), 
                           QuarterAction.addQuarterToSchedule(schedule._id, sixthQuarter._id)]);

         var added = res[0];
         var second =  res[1];
         var third =  res[2] ;
         var fourth =  res[3];
         var fiftrh = res[4];
         var sixth =  res[5];

        console.log("added is ", added);

        user.schedules = [schedule._id, scheduleTwo._id];
        //Bind them to the correct User Object
        var userUpdated = await UserDao.createAccount(user);
        return userUpdated;
    }
}

module.exports = UserAction;
