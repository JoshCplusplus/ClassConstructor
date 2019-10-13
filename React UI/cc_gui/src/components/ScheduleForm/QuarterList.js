import * as ScheduleConstants from './ScheduleConstants';
import _ from 'underscore';

const WARNING_CUTOFF = 0.4;

const idsMap = { "Fall":"FA", "Winter":"WI", "Spring":"SP", "Summer-1":"S1", "Summer-2":"S2"};



/*
    The status class is used to return information to caller about the success
    of an operation, as well as whether or not a message should be displayed.
*/
export class Status {
    constructor(success, message, displayMessage, color) {
        this.success = success;
        this.displayMessage = displayMessage;
        this.message = message;
        this.color = color;
    }
}

/*
    The CourseElement class wraps around the provided dictionary, providing
    further functionality.
*/
export class CourseElement {
    constructor(courseInformation) {
        this.courseInformation = courseInformation;
        this.hasPrereqs = true;
        this.completePrereqs = [];
    }

    // Returns the units that should be displayed for the current choice
    // Note: Displayed units are the first number encountered, of the first units listed
    getUnitsDisplay = () => {
        return parseInt(this.courseInformation.units[0]);
    }

    // Turns the class back into a dictionary
    dictify = () => {
        return this.courseInformation;
    }

    // Gets the actual unit array
    getUnits = () => {
        return this.courseInformation.units;
    }

    // Gets the id (display name) for the course
    getId = () => {
        return this.courseInformation.id;
    }

    setHasPrereqs = (hasPrereqs) => {
        this.hasPrereqs = hasPrereqs;
    }

    getPrereqs = () => {
        return this.courseInformation.prereqs;
    }


    addCompletePrereq = (name) => {
        this.completePrereqs.push(name);
    }

    // Gets the chance that this quarter is offered during a given quarter
    getChance = (quarterId) => {
        return this.courseInformation.quarter_offered[quarterId];
    }

    likelyToBeOffered = (quarterSeason) => {
        return this.courseInformation.quarter_offered[idsMap[quarterSeason]].percent_offer >= WARNING_CUTOFF;
    }

    getDescription = () => {
        return this.courseInformation.description;
    }

    getPrereqString = () => {
        return this.courseInformation.prereq_string;
    }

    mapPercentsOffered = (callback, extra) => {
        var arr = [];
        arr = Object.keys(this.courseInformation.quarter_offered).map(function(key, index) {
            return callback(this.courseInformation.quarter_offered[key], key, extra);
        }, this)
        return arr;
    }
}


/*
    The QuarterElement class wraps around the provided quarter dictionary, providing
    additional functions to aid in organization.
*/
class QuarterElement {
    constructor(season, year, schedule, courses, id) {
        this.courses = [];
        this.units = 0;
        this.size = 0;
        for (var i = 0; i < courses.length; i++) {
            if (courses[i] === null || courses[i] === undefined) {
                continue;
            }
            this.size++;
            var element = new CourseElement(courses[i]);
            this.courses.push(element);
            this.units += element.getUnitsDisplay();
        }
        this.season = season;
        this.schedule = schedule;
        this.year = year;
        this.id = id;
    }

    getId = () => {
        return this.id;
    }

    // Returns the total units of this quarter
    getUnits = () => {
        return this.units;
    }

    // Turns the QuarterElement back into a dictionary
    dictify = () => {
        var quarter = {};
        quarter._id = this.id;
        quarter.season = this.season;
        quarter.year = this.year;
        quarter.schedule = this.schedule;
        var courses = [];
        for (var i = 0; i < this.size; i++) {
            courses.push(this.courses[i].dictify());
        }
        quarter.courses = courses;
        return quarter;
    }

    // Returns the course at a given courseIndex, returning emptyCourse, when
    // outside the bounds of this quarter.
    getCourse = (courseIndex) => {
        if (courseIndex >= this.size) {
            return emptyCourse;
        }
        var course = this.courses[courseIndex];
        return course;
    }

    // Adds a course to the end of this quarter, if possible.
    addCourse = (course) => {
        if (this.size === ScheduleConstants.NUM_CLASSES || course === undefined) {
            return false;
        }
        this.courses[this.size] = course;
        this.size += 1;
        this.units += parseInt(course.getUnitsDisplay());
        return true;
    }

    /*
        Deletes a course from this quarter.
        @courseIndex = The index of the course to delete
        @return = true if the course was sucessfully deleted, false otherwise
    */
    deleteCourse = (courseIndex) => {
        if (courseIndex >= this.size) {
            return false;
        }
        this.units -= parseInt(this.courses[courseIndex].getUnitsDisplay());
        this.courses.splice(courseIndex, 1);
        this.size -= 1;
        return true;
    }

    getCourses = () => {
        return this.courses;
    }

    /*
        Returns true if the course is contained in the current quarter, and false otherwise
        @course = The course to check
    */
    containsCourse = (course) => {
        if (course === undefined) {
            return false;
        }
        for (var i = 0; i < this.courses.length; i++) {
            if (this.courses[i].getId() === course.getId()) {
                return true;
            }
        }
        return false;
    }

    /*
        Maps the courses for this quarter to another array, using a callback function
        @callback = the callback function
        @extra = an extra parameter to pass back to callback
    */
    mapCourses = (callback, extra) => {
        var arr = [];
        var i = 0;
        while ( i < this.courses.length) {
            arr.push(callback(this.courses[i], i, extra));
            i++;
        }
        while (arr.length < ScheduleConstants.NUM_CLASSES) {
            arr.push(callback(emptyCourse, i, extra));
            i++;
        }
        return arr;
    }

    /*
        Returns the title of this quarter
    */
    getTitle = () => {
        return this.season + "  " + this.year;
    }

    /*
        Returns the season of the quarter
    */
    getSeason = () => {
        return this.season;
    }

}

/*
    The QuarterList class wraps around a schedule object, and adds in useful
    features to track schedules
*/
export class QuarterList {
    constructor() {
        this.quarters = [];
        this.names = ["Fall", "Winter", "Spring", "Summer-1", "Summer-2"];
        this.year = 19;
        this.m = 0;
        this.id = "-1";
        this.name = "SCHEDULE";
    }

    getScheduleId = () => {
        return this.id;
    }

    getQuarterId = (quarterIndex) => {
        return this.quarters[quarterIndex].getId();
    }

    // Sets the name
    setName = (name) => {
        this.name = name;
    }

    // Gets the name
    getName = () => {
        return this.name;
    }

    // Populates the quarter list from the data provided
    populate = (scheduleInformation, academicInformation) => {
        // clears out current values
        this.quarters = [];
        this.m = 0;
        this.year = 2019;
        this.academicInformation = academicInformation;

        // set the id
        this.id = scheduleInformation._id;
        this.name = scheduleInformation.name;
        // populate the quarters
        for (var i = 0; i < scheduleInformation.quarters.length; i++) {
                this.genQuarter(scheduleInformation.quarters[i], scheduleInformation._id);
        }
    }

    /*
        Turns the QuarterList into a dictionary
    */
    dictify = () => {
        var value = {};
        value._id = this.id;
        value.name = this.name;
        var quarters = [];
        for (var i = 0; i < this.quarters.length; i++) {
            var q = this.quarters[i].dictify();
            quarters.push(q);
        }
        value.quarters = quarters;
        return value;
    }

    // Generates a quarter from the given information
    genQuarter = (quarterInformation, scheduleId) => {
        this.addQuarter(quarterInformation.courses, quarterInformation._id, quarterInformation.schedule);
    }

    // Returns the quarter at the given quarterIndex, and undefined otherwise
    getQuarter = (quarterIndex) => {
        if (quarterIndex < 0 || quarterIndex > this.quarters.length) {
            return undefined;
        }
        return this.quarters[quarterIndex];
    }

    // Returns the course at a given quarter and course index, and false otherwise
    getCourse = (quarterIndex, courseIndex) => {
        return this.getQuarter(quarterIndex).getCourse(courseIndex);
    }

    getCourseName = (quarterIndex, courseIndex) => {
        return this.getCourse(quarterIndex, courseIndex).getId();
    }

    getCourseUnits = (quarterIndex, courseIndex) => {
        return this.getCourse(quarterIndex, courseIndex).getUnitsDisplay();
    }

    isRealCourse = (quarterIndex, courseIndex) => {
        return (this.getCourse(quarterIndex, courseIndex).getId() !== "-");
    }

    addQuarter = (courses, id, scheduleId) => {
        if (this.m >= this.names.length) {
            this.m = 0;
        }
        if (this.m === 1) {
            this.year += 1;
        }

        var quarter = new QuarterElement(this.names[this.m], this.year, this.id, courses, id);
        this.quarters.push(quarter);
        this.m += 1;
        return quarter;
    }

    addCourse = (quarterIndex, course) => {
        if (!(course instanceof CourseElement)) {
            course = new CourseElement(course);
        }
        var status = this.canAddCourse(course, quarterIndex);
        if (status.success === true) {
            this.getQuarter(quarterIndex).addCourse(course);
        }
        this.populatePrerequisiteStatus();
        return status;
    }

    removeCourse = (quarterIndex, courseIndex) => {
        this.getQuarter(quarterIndex).deleteCourse(courseIndex);
        this.populatePrerequisiteStatus();
    }


    allPrereqsComplete = (completed, course) => {
        let returnValue = true;
        course.courseInformation.prereqs.forEach(index => {
            let hasOneValue = false;
            for (var i = 0; i < index.length; i++) {
                if(completed[index[i]] == true)
                {
                    hasOneValue = true;
                    course.addCompletePrereq(index);
                    continue;
                }
            }
            if (hasOneValue === false) {
                returnValue = false;
            }
        });
        return returnValue;
    }

    // Sets the pre-req status for all courses
    populatePrerequisiteStatus = () => {

        var completed = {};

        // Add all the completed courses to completed
        for (var i = 0; i < this.academicInformation.taken.length; i++) {
            var course = this.academicInformation.taken[i];
            completed[course.id] = true;
        }

        // Add all the in progress courses to completed
        for (var j = 0; j < this.academicInformation.inProgress.length; j++) {
            course = this.academicInformation.inProgress[j];
            completed[course.id] = true;
        }


        // Iterate through the quarters and check each course for completion
        for (var k = 0; k < this.quarters.length; k++) {
            var courses = this.quarters[k].getCourses();
            var toMerge = {};
            for (var m = 0; m < courses.length; m++) {
                course = courses[m];
                course.completePrereqs = [];

                // Check whether this course has been completed and track
                course.setHasPrereqs(this.allPrereqsComplete(completed, course));

                // Add the course to completed, and move on
                toMerge[course.getId()] = true;
            }
            completed = {...completed, ...toMerge}
        }

    }

    canAddCourse = (course, toQuarterIndex) => {
        if (this.quarters[toQuarterIndex].containsCourse(course)) {
            return new Status(false, "Course already exists in quarter.", true);
        }

        //check if the user has met the course prerequisites
        var completedCourses = this.academicInformation.taken;
        for(let i = 0; i < toQuarterIndex; i++){
            completedCourses = completedCourses.concat(this.quarters[i].dictify().courses);
        }

        var prereqs = course.dictify().prereqs;
        var incompletePrereqs = [];
        var missingPrereqs = false;

        //prereq array is an array of arrays.
        //need to scan each sub array to make sure at least one element has been completed
        for(let prereqArr of prereqs){
            let sinlgePrereqSatisfied = false;
            for(let c of prereqArr){
                if(completedCourses.some(e => e.id === c)){
                    sinlgePrereqSatisfied = true;
                }
            }
            if(!sinlgePrereqSatisfied){
                missingPrereqs = true;
                incompletePrereqs.push(prereqArr);
            }
        }

        //if any prereqs are not satisfied, output them in a warning with a toast message
        if(missingPrereqs){
            var prereqString = "Warning: You haven't completed the following prerequisites to this class: ";
            for(let p of incompletePrereqs){
                let prereqStringItem = "";
                for(let c of p){
                    prereqStringItem += c + "/";
                }
                prereqStringItem = prereqStringItem.substring(0, prereqStringItem.length - 1);
                prereqString += prereqStringItem + ", ";
            }
            prereqString = prereqString.substring(0, prereqString.length - 2);
            prereqString += ".";
            return new Status(true, prereqString, true);
        }


        // Checks if the course is expected to be offered during the quarter given
        var quarter = this.quarters[toQuarterIndex];
        var chance = course.getChance(idsMap[quarter.season]);
        if (chance.percent_offer <= WARNING_CUTOFF) {      // Send back a message warning the quarter will most likely not be offered.
            return new Status(true, course.getId() + " has only been offered in " + chance.qCnt + " of the last " + chance.years_back + " " + quarter.season + " quarters.", true);
        }
        return new Status(true, "", false);
    }

    moveCourse = (fromQuarterIndex, fromCourseIndex, toQuarterIndex) => {
        if (fromQuarterIndex === toQuarterIndex) {
            return new Status(true, "");
        }
        var removed = this.getCourse(fromQuarterIndex, fromCourseIndex);
        var status = this.canAddCourse(removed, toQuarterIndex);
        if (status.success === true) {
            this.removeCourse(fromQuarterIndex, fromCourseIndex);
            this.addCourse(toQuarterIndex, removed);
        }
        return status;
    }

    getQuarterUnits = (quarterIndex) => {
        return this.getQuarter(quarterIndex).units;
    }
    getQuarterTitle = (quarterIndex) => {
        var quarter = this.getQuarter(quarterIndex);
        if (quarter === undefined) {
            return undefined;
        }
        return this.getQuarter(quarterIndex).getTitle();
    }

    mapQuarters = (callback, extra) => {
        var arr = [];
        for (var i = 0; i < this.quarters.length; i++) {
            arr.push(callback(this.quarters[i], i, extra));
        }
        return arr;
    }

    mapCourses = (quarterIndex, callback, extra) => {
        var quarter = this.getQuarter(quarterIndex);
        if (quarter === undefined) {
            return [];
        }
        return quarter.mapCourses(callback, extra);
    }
}



const emptyCourse = new CourseElement({
    course_number: "0",
    hasPrereqs: true,
    department: "empty",
    description: "",
    id: "-",
    units: "0",
    postreqs: [],
    prereq_string: "",
    prereqs: [],
    quarter_offered: {
        FA: {
            percent_offer: 1
        },
        WI: {
            percent_offer: 1
        },
        SP: {
            percent_offer: 1
        },
        S1: {
            percent_offer: 1
        },
        S2: {
            percent_offer: 1
        },
    },
});
