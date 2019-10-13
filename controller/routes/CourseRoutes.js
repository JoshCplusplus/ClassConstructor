const router = require('express').Router();
const ActionUtil = require('../Action/ActionUtil');
const courseAction = require('../Action/CourseAction');

/**
 * Route: /course/
 * Optional params: id=<course id>
 * Description: gets all courses or gets single course by id
 */
router.get('/', (req, res) => {
	if(req.query.id === undefined){
		courseAction.getAllCourses().then(courses =>
			res.json(courses)).catch(err => console.log(err));
	}else{
		courseAction.getCourseById(parseInt(req.query.id)).then(course =>
			res.json(course)).catch(err => console.log(err));
	}
})

router.post('/courseList', (req, res) => {
	courseAction.getUserCompletionObject(req.body.data)
    .then(completionObj => res.json(completionObj))
    .catch(err => console.log(err));
})

/**
 * Route: /course/filter
 * Optional params: upperDiv=<true/false>
 * 					lowerDiv=<true/false>
 * 					rangeLow=<course number lower bound>
 * 					rangeHigh=<course number upper bound>
 * 					userID=<user google id>
 * 					isReq=<true/false>
 * 					searchStr
 * Example: /course/filter?<filter1>=<value>&<filter2>=<value2>&...
 * Description: Gets array of courses matching the given filter
 */
router.get('/filter', (req, res) => {
	const filter = {};
	filter.upperDiv = req.query.upperDiv;
	filter.lowerDiv = req.query.lowerDiv;
	filter.rangeLow = req.query.rangeLow;
	filter.rangeHigh = req.query.rangeHigh;
	filter.userID = ActionUtil.getUserId(req);
	filter.isReq = req.query.isReq;
	filter.searchStr = req.query.searchStr;
	courseAction.filterCourses(filter).then(courses => {
		res.json(courses);
	}).catch(err => console.log(err));
})

module.exports = router;
