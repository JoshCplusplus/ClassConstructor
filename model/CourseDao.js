const Course = require('./CourseSchema');

const CourseDao = {
  /*
  * Function : getCourse
  * Paramters : None
  * Description : Returns all the courses stored in the database
  * Return: A Promise with the entire Course collection
  */
  getCourses : async function() {
    const collection = await Course.find();
    return collection;
  },
  /*
  * Function : getCourse
  * Paramters : The course ID of a particular course
  * Description : Returns the course object from the database
  * Return: A Promise with the Course found
  */
  getCourse : async function(courseID) {
    const course = await Course.findOne({id : courseID})
    return course;
  },

  /*
  * Function : getCourseArr
  * Paramters : Array of course object Id's
  * Description : Returns an array containing course objects from the database
  * Return: A Promise with an array of found Courses
  */
  getCourseArr : async function(arr) {
    const courseArr = await Course.find({ 
      _id: {
          $in: arr
      }
    });
    return courseArr;
  }
}

module.exports = CourseDao;
