const router = require('express').Router();
const cookieSession = require('cookie-session');
const ContactAction = require('../Action/ContactAction')

/**
 * Route: /contact/report
 * Description: Send an email to cse110classconstructor@gmail.com with an error/missing class report
 */
router.post('/report', (req, res) => {
    console.log("entered contact route");
    const message = {};
    message.subject = req.body.subject;
    message.body = req.body.message;
    console.log(message);
    ContactAction.sendReport(message).then(r => res.sendStatus(200)).catch(err => console.log(err));
})

module.exports = router;
