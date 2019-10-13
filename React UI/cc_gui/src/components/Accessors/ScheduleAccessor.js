


/**
 * @description Backend fetch to get an empty schedule form
 *
 * @export
 * @param {function} callback function that will be passed into a schedule
 * @param {*} extra reference to be passed into callback function (this)
 *
 * @returns {function} callback
 */

export function getScheduleForm (callback, extra) {
    fetch('/schedule/create', {
        method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            scheduleName: "My Schedule"
        })
        }
    ).then( response => {
        return response.json();
    }).then (schedule => {
        callback(schedule, extra);
    })
}


/**
 * @description Saves an entire schedule to the backend
 *
 * @export
 * @param {string} schedule schedule object to be saved to the backend
 * @param {function} callback function to call when the save is completed
 * @param {*} extra reference to be passed into callback function (this)
 * 
 * @returns {function} callback
 */
export function saveSchedule(schedule, callback, extra) {
    fetch('/schedule/save', {
        method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            schedule: schedule
        })
        }
    )
}


/**
 * @description Saves a new quarter to the server
 *
 * @export
 * @param {JSON} quarter quarter to be saved
 * @param {function} callback function to call when the save is completed
 * @param {*} extra reference to be passed into callback function (this)
 * 
 * @returns {function} callback
 */
export function saveNewQuarter(quarter, callback, extra) {
    fetch('/quarter/update', {
        method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            quarterObj: quarter.dictify()
        })
        }
    ).then( response => {
        return response.json();
    }).then( data => {
        quarter.id = data;
    }).then( res => {
        callback(quarter, extra);
    })
}


/**
 * @description Delete a schedule from the server
 *
 * @export
 * @param {string} schedule the id of the schedule to be removed
 * 
 * @returns {function} callback
 */
export function deleteSchedule(schedule) {
    console.log("deleting" + schedule);
    fetch('/schedule/delete', {
        method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            scheduleId : schedule
        })
        }
    ).catch( err => {console.log(err)})
}


/**
 * @description Save the name of a schedule
 *
 * @export
 * @param {string} scheduleId the id of the schedule to save the name of
 * @param {string} name the new name of the schedule
 * 
 * @returns {void}
 */
export function saveScheduleName(scheduleId, name) {
    console.log("Saving name of", scheduleId, "to", name);
    fetch('/schedule/saveName', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            scheduleId: scheduleId,
            name: name
        })
    }).catch( err => {console.log(err)})
}


/**
 * @description Calls the recommend quarter route, saving to the database and returning the recommended quarter
 *
 * @export
 * @param {string} quarterId the id of the quarter to be filled
 * @param {string} scheduleId the id of the schedule to be saved to
 * @param {function} callback the callback function to be executed after ompletion
 * @param {*} extra reference to be passed into callback function (this)
 * 
 * @returns {function} callback
 */
export function recommendQuarter(quarterId, scheduleId, callback, extra) {
    fetch('/quarter/recommend', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            scheduleId: scheduleId,
            quarterId: quarterId
        })
    })
    .then (res => {
        if (res.status === 420) {
            callback(false, undefined, extra);
        } else {
            return res.json();
        }
    })
    .then ( data => {
        if (data === undefined) {
            return;
        }
        callback(true, data.data, extra);
    }).catch (err => console.log(err));
}



/**
 * @description remove a quarter from a given schedule in the database
 *
 * @export
 * @param {string} schedule id of target schedule containing quarter
 * @param {string} quarter id of quarter to be deleted
 * 
 * @returns {void}
 */
export function deleteQuarter(schedule, quarter) {
    fetch('/quarter/delete', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            scheduleId : schedule,
            quarterId : quarter
        }), 
    }).then( res => { console.log("Quarter is deleted")});
}
