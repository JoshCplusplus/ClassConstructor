const courseDao = require('../../model/CourseDao');
const userDao = require('../../model/UserDao');
const schedule = require('node-schedule');
const UPPER_DIV_MIN_COURSENUM = 100;

const courseAction = {
	//get all courses in database
	getAllCourses : async function (){
		const courses = courseList;
		return courses;
	},

	getCourseList : async function (){
		return await courseDao.getCourses();
	},

	//get array of courses based on filter
	filterCourses : async function(filter){
		let courses = await courseDao.getCourses();
		console.log("Got full course list from database");
		if((filter.isReq !== undefined) && (filter.isReq == "true")){
			const user = await userDao.getAccount(filter.userID);
			const neededCourses = user.needed_courses;
			courses = courses.filter(c => {
				//console.log(c.toJSON().course_id);
				return (neededCourses.some(id => id == parseInt(c.toJSON().course_id)));
			})

		}else{
			for(let course of courses){
				course = course.toJSON();
			}
		}

		let filterCourses = courses.filter(course => {
			//if all of the booleans below are true then the course should be added to the output list
			const courseName = (course.id).toUpperCase();
			let searchClean;
			if(filter.searchStr !== undefined){
				searchClean = (filter.searchStr.replace(/\s/g, "")).toUpperCase();
			}
			//console.log(courseName);

			//console.log("search clean " + searchClean);

			const upperDiv = (filter.upperDiv === undefined) ||
								((filter.upperDiv == "true") && (parseInt(course.course_number) >= UPPER_DIV_MIN_COURSENUM));
			const lowerDiv = (filter.lowerDiv === undefined) ||
								((filter.lowerDiv == "true") && (parseInt(course.course_number) < UPPER_DIV_MIN_COURSENUM));
			const rangeLow = (filter.rangeLow === undefined) ||
								(filter.rangeLow <= parseInt(course.course_number));
			const rangeHigh = (filter.rangeHigh === undefined) ||
								(filter.rangeHigh >= parseInt(course.course_number));
			const searchMatch = (filter.searchStr === undefined) ||
									(courseName.includes(searchClean)) || (searchClean.includes(courseName));
			return (upperDiv && lowerDiv && rangeLow && rangeHigh && searchMatch);
		});
		console.log("finished filtering courses");
		return filterCourses;
	},

	//get course by course id
	getCourseById : async function(id){
		return courseDao.getCourse(id);
	},

	getUserCompletionObject : async function(courseCompletion){
		var courseCompletionObjects = {};
		// courseCompletionObjects.completed = courseAction.getCourseByArrId(courseCompletion.completed);
		// courseCompletionObjects.ip = courseAction.getCourseByArrId(courseCompletion.ip);
		// courseCompletionObjects.missing = courseAction.getCourseByArrId(courseCompletion.missing);
		 var result = await Promise.all([courseAction.getCourseByArrId(courseCompletion.completed),
						courseAction.getCourseByArrId(courseCompletion.ip),
						courseAction.getCourseByArrId(courseCompletion.missing)]);
		courseCompletionObjects.completed = result[0];
		courseCompletionObjects.ip = result[1];
		courseCompletionObjects.missing = result [2];
		return courseCompletionObjects;
	},

	//Get a list of course objects from the list of course id
	getCourseByArrId : async function(arr){

		const objArr = [];
		//Loop through the arr of course id
		for(var i = 0; i < arr.length; i++){
			const course = await courseDao.getCourse(arr[i]); //Get the course with the course id	s
			if(course !== null){
				objArr.push(course.toJSON()) //Convert each object to a json before pushing
			}
		}	
		return objArr;
	},

	/*
	 * Description : Checks if the user has cleared all the prereqs for the course
	 * Params : taken - array of taken course id from the course schema,
	 * 			prereqs - array of prereqs from the course schema that contains arrays of prereqs
	 */
	clearedCourses : function(taken, prereq){
		for(var i = 0; i < prereq.length; i++){
			var exists = false;

			for(var j = 0; j < prereq[i].length; j++){
				if(taken.includes(prereq[i][j])){
					exists = true;
					break;
				}
			}
			if(exists == false){
				return false
			}
		}
		return true;
	},

	hasTaken : function(taken, course){
		return taken.includes(course.id);
	}
};


var courseList = courseAction.getCourseList();

var courseListRefreshJob = schedule.scheduleJob('* * 0 * * *', function(){
	courseList = courseAction.getCourseList();
  });

module.exports = courseAction;
