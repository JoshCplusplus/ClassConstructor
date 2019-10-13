const UPPER_DIV_MIN_COURSENUM = 100;


class SearchbarInfo {
    constructor() {

        this.toggles = [
            "Upper Division",
            "Lower Division",
            "Required Courses"
        ];

        this.toggled = [
            false,
            false,
            false
        ];

        this.listeners = [];
        this.searchValue = "";

        this.selectedCourse = -1;


        this.allCourses = [ {id: "cse 100", units: [5]}];
        this.courses = this.allCourses;

        this.requiredCourses = [];
    }

    getStoredSearchValue = () => {
        return this.searchValue;
    }

    getToggles = () => {
        return this.toggled;
    }

    getToggle = (id) => {
        return this.toggled[id];
    }

    getNumCourses = () => {
        return this.courses.length;
    }

    getCourse = (index) => {
        return this.courses[index]
    }

    setUserInformation = (courses, requiredCourses) => {
        for (var i = 0; i < courses.length; i++) {
            if (courses[i].units === undefined) {
                courses[i].units = ["0"]
            } else if (courses[i].units.length === 0) {
                courses[i].units.push("0");
            }
        }
        this.allCourses = courses;
        this.courses = courses;
        this.requiredCourses = requiredCourses;
    }

    storeSearchValue = (searchValue) => {
        this.searchValue = searchValue;
    }


    static getInstance() {
        return searchbarInfo;
    }

    updateCourses(searchStr) {
        this.selectedCourse = -1;
        const upperDiv = this.toggled[0];
        const lowerDiv = this.toggled[1];
        const isReq = this.toggled[2];

        let courseList = this.allCourses;
		if((isReq === true)){
			courseList = this.requiredCourses;
		}

		courseList = courseList.filter(course => {
			//clean course name and search string
            const courseName = ((course.id).toUpperCase()).replace(/\s/g, "");
			let searchClean;
			if(searchStr !== undefined){
				searchClean = (searchStr.replace(/\s/g, "")).toUpperCase();
            }

            //if all booleans below evaluate to true then include the current course in results
            const rangeLowPass = true;
            const rangeHighPass = true;

			const upperDivPass = (upperDiv === false) ||
								((upperDiv === true) && (parseInt(course.course_number) >= UPPER_DIV_MIN_COURSENUM));
			const lowerDivPass = (lowerDiv === false) ||
								((lowerDiv === true) && (parseInt(course.course_number) < UPPER_DIV_MIN_COURSENUM));
			//const rangeLowPass = (filter.rangeLow === undefined) ||
			//					(filter.rangeLow <= parseInt(course.course_number));
			//const rangeHighPass = (filter.rangeHigh === undefined) ||
			//					(filter.rangeHigh >= parseInt(course.course_number));
			const searchStrPass = (searchStr === "") ||
									(courseName.includes(searchClean)) || (searchClean.includes(courseName));
			return (upperDivPass && lowerDivPass && rangeLowPass && rangeHighPass && searchStrPass);
        });

		//console.log("finished filtering courses");
	    this.courses = courseList;
    }

    addListener = (listener) => {
        this.listeners.push(listener);
    }

    removeListener = (listener) => {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i] === listener) {
                this.listeners.splice(i, 1);
                return;
            }
        }
        console.log("Warning: was not able to remove the listener", listener, " from", this.listeners);
    }

    clearCourses = () => {
        this.courses = this.allCourses;
    }

    doubleClick = (id) => {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].notifyDoubleClick(this.courses[id]);
        }
    }


    toggleIndex = (index) => {
        this.toggled[index] = !this.toggled[index];
    }

    setSelectedCourse = (id, notify) => {
        this.selectedCourse = id;
        if (notify === true) {
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i].notifySelection(this.courses[id]);
            }
        }
    }

    getSelectedCourse = () => {
        if (this.selectedCourse < 0 || this.selectedCourse > this.courses.length) {
            return undefined;
        }
        return this.courses[this.selectedCourse];
    }

    mapToggles = (callback, extra) => {
        var arr = [];
        for (var i = 0; i < this.toggles.length; i++) {
            arr.push(callback(this.toggles[i], i, extra));
        }
        return arr;
    }

    mapCourses = (callback, extra) => {
        if (this.courses === undefined) {
            return [];
        }
        var arr = [];
        for (var i = 0; i < this.courses.length; i++) {
            if (this.courses[i].units.length === 0) {
                continue;
            }
            arr.push(callback(this.courses[i].id, this.courses[i].units[0], i, extra));
        }
        return arr;
    }
}


var searchbarInfo = new SearchbarInfo();

export default SearchbarInfo;
