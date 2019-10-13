
// A variable used in getUserData, stored here to allow access in multiple
// .thens
var loggedIn = false;

/*
    Gets the user data for the currently logged in user in this account
    @callback = A callback function to execute on successful retrieval of
        user data
    @extra = An extra argument for the callback function
*/
export function getUserData(callback, extra) {
    fetch('/user')
    .then(response => {
        loggedIn = response.status === 200;
        if (!loggedIn) {
            return {user: {}, courseList: {}};
        }
        return response.json();
    })
    .then( data => {
        callback(data, loggedIn, extra);
    })
    .catch(err => console.log(err));
}

export function saveAcademicHistory(academicHistory, callback, extra){
    console.log(academicHistory.required);
    console.log("SAVING", academicHistory);
    fetch('user/saveAcademicProgress', {
        method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            taken_courses: academicHistory.taken,
            ip_courses: academicHistory.in_prog,
            needed_courses: academicHistory.required
        })
        }).then( data => {
            callback(true, extra);
        }).catch(err => console.log(err));
}

export function deleteAccount(callback, extra) {
    fetch('user/deleteAccount')
    .then( callback(true, extra));
}

export function parseDegreeAudit(data, callback, extra) {
    console.log("DATA", data);
    fetch('/course/courseList', {
        method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            data: data
         })
    })
    .then( response => {
        return response.json();
    })
    .then( data =>  {
        callback(data, extra);
    })
    .catch( err => console.log(err));
}

/*
    Gets an empty data set to tide over any component depending on user data, because
    the fetch is asynchronous
*/
export function getEmptyData() {
    var emptyData = {
        firstName: "",
        lastName: "",
        imageURL: "",
        schedules: [],
        compCourses: [],
        ipCourses: [],
        reqCourses: [],
        academicHistory: false
    }
    return emptyData;
}
