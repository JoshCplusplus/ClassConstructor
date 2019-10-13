/**
 * @description Sends an email to the cse110classconstructor@gmail.com account with the given message
 * and a header representing the User.
 *
 * @export
 * @param {string} user the user sending the message
 * @param {string} message the message being sent
 * @param {function} callback a function to execute on successful sending of the email
 * @param {*} extra an extra argument for the callback function (this)
 * 
 * @return {function} callback
 */
export function sendEmail(user, message, callback, extra) {
    var subject = 'User Error Report ' + user;
    fetch('/contact/report', {
        method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           subject: subject,
           message: message,
         }),
    }).then(
        callback(true, extra)
    );
}
