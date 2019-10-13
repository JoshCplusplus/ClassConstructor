/**
 * @description Gets an empty set of settings for anyone depending on settings, because of asynchronous call
 *
 * @export
 * @returns {JSON} empty JSON object 
 */
export function getEmptySettings() {
    var emptySettings = {
        major: "",
        standing: 0,
        college: 0
    }
    return emptySettings;
}

/**
 * @description saves the settings for the currently logged in user
 *
 * @export
 * @param {JSON} setting JSON object { standing(number), major(string), college(number)}
 * @param {function} callback a callback function to execution on successful save of settings
 * @param {*} extra an extra argument for the callback function (this)
 * @return {function} callback
 */
export function saveSettings(setting, callback, extra) {
    fetch('/user/update', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({

            standing: setting.standing,
            major: setting.major,
            college: setting.college
        })
    })
        .then(
            callback(true, extra)
        );
}
