import React from 'react';
import './AcademicHistory.css';
import ScrollList from './ScrollingList/ScrollList';
import PercentComplete from './PercentBar';
import RightSearchBar from './RightSearchBar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import PropTypes from 'prop-types';
import HistoryModal from './HistoryModal';
import * as UserAccessor from '../Accessors/UserAccessor';
import * as SearchbarAccess from '../Searchbar/SearchbarAccess';
import * as MessageHandler from '../Functionality/MessageHandler';

/**
 * @description container for the ScrollList and ClassButton objects. Renders the academic history page.
 *
 * @class AcademicHistory
 * @extends {React.Component}
 */
class AcademicHistory extends React.Component {

    /**
     * @description Creates an instance of AcademicHistory.
     * @param {*} props
     * @memberof AcademicHistory
     * @returns {Object} AcademicHistory object
     */
    constructor(props) {
        super(props);
        this.state = {
            // array of classes in "Completed" column
            taken: this.props.academicHistoryInformation.taken,
            // array of classes in "In Progress" column
            in_progress: this.props.academicHistoryInformation.inProgress,
            // array of classes in "Required" column
            required: this.props.academicHistoryInformation.required,
            // current course selected from right sidebar
            selectedCourse: undefined,
            // default coloration for courses
            default_colors: {
                    "complete": "2",
                    "in_progress": "4",
                    "required": "3"
            },   
        }
    }


    componentWillReceiveProps = (newProps) => {
        console.log("NEW Props", newProps);
        this.setState({
            taken: newProps.academicHistoryInformation.taken,
            in_progress: newProps.academicHistoryInformation.inProgress,
            required: this.props.academicHistoryInformation.required
        });
    }

    /*
    *  Save the current contents of the taken, in_progress, and required arrays
    *  to the user account in the database.
    */
    /**
     * @description Save the current contents of the taken, in_progress, and required arrays to the user account in the database.
     *
     * @memberof AcademicHistory
     * @returns {function} this.props.handleSaveAcademicHistory(academicInformation)
     */
    saveAcademicHistory = () => {
        console.log("SAVING", this.state);
        var academicInformation = {
          taken: this.state.taken,
            in_prog: this.state.in_prog,
            required: this.state.required
        }
        this.props.handleSaveAcademicHistory(academicInformation);
    }

    /*
    * Removes the course located at the provided
    * index value from the array.
    * 
    * Returns the removed course if found.
    * TODO: implement upperbound checking
    */
    /**
     * @description Removes the course located at the provided index value from the array.
     * 
     * @param {string} fromIndex index of source scrollList
     * @param {number} index index of class in source ScrollList
     * 
     * @return {JSON} removed course
     * @memberof AcademicHistory
     */
    removeCourse = (fromIden, index) => {
        //basic input checking
        if (index < 0) {
            console.log("ERROR: bad index for removeCourse");
            return;
        }

        if (fromIden === "Required") {
            let course = this.state.required[index];
            this.state.required.splice(index, 1);
            return course;
        }
        else if (fromIden === "Completed") {
            let course = this.state.taken[index];
            this.state.taken.splice(index, 1);
            return course;
        }
        else if (fromIden === "In Progress") {
            let course = this.state.in_progress[index];
            this.state.in_progress.splice(index, 1);
            return course;
        }
        else {
            console.log("ERROR: Unrecognized identifier in AcademicHistory", fromIden);
            return;
        }
    }


  /**
   * @description get course from list
   * 
   * @param {string} iden identifier for given ScrollList
   * @param {number} index index value of array to be returned
   * 
   * @returns {JSON} ScrollList[index]
   * @memberof AcademicHistory
   */
  getCourse = (iden, index) => {
    if (index < 0) {
      console.log("ERROR: bad index for getCourse");
      return;
    }

    if (iden === "Required") {
      return this.state.required[index];
    }
    else if (iden === "Completed") {
      return this.state.taken[index];
    }
    else if (iden === "In Progress") {
      return this.state.in_progress[index];
    }
    else {
      console.log("ERROR: Unrecognized identifier in AcademicHistory", iden);
      return;
    }
  }

  /**
   * @description returns boolean value of whether course is present in current ScrollList
   * 
   * @param {string} course course to be searched for
   * @param {string} ignoreIden optional ScollList to be ignored
   *
   * @memberof AcademicHistory
   * @returns {boolean} true if in a scrollList
   */
  containsCourse = (course, ignoreIden) => {
    if (ignoreIden !== "Required") {
      if(this.hasCourse("Required", course)) {
        return true;
      }
    }

    if (ignoreIden !== "In Progress") {
      if (this.hasCourse("In Progress", course)) {
        return true;
      }
    }

    if (ignoreIden !== "Completed") {
      if (this.hasCourse("Completed", course)) {
        return true;
      }
    }

    return false;
  }

  /**
   * @description checks if a 
   *
   * @memberof AcademicHistory
   */
  includes = (array, course) => {
      for (var i = 0; i < array.length; i++) {
          if (array[i]._id === course._id) {
              return true;
          }
      }
      return false;
  }

  hasCourse = (iden, course) => {
    console.log("HAS COURSE", iden, course, this.state);
    if (course === undefined) {
      console.log("ERROR: hasCourse is called with undefined and identifier", iden);
      return false;
    }
    if (iden === "Required") {
        return this.includes(this.state.required, course);
    } else if (iden === "Completed") {
        return this.includes(this.state.taken, course);
    } else if (iden === "In Progress") {
        return this.includes(this.state.in_progress, course);
    } else {
      console.log("ERROR: hasCourse called with invalid identifier of", iden);
      return false;
    }
  }

  addCourse = (toIden, course) => {
    if (course === undefined) {
      console.log("ERROR: bad index for addCourse");
      return;
    }
    if (toIden === "Required") {
      this.state.required.push(course);
    } else if (toIden === "Completed") {
      this.state.taken.push(course);
    } else if (toIden === "In Progress") {
      this.state.in_progress.push(course);
    } else {
      console.log("ERROR: Unrecognized identifier in AcademicHistory", toIden);
      return;
    }
  }


  handleTitleClick = (id) => {
    if (this.containsCourse(this.state.selectedCourse)) {
      MessageHandler.sendMessage(this.state.selectedCourse.id + " is already being tracked.", false);
      return;
    }
    var index = this.state[id].findIndex( x => x.id === this.state.selectedCourse.id);
    if(!(index < -1)) {
      switch (id) {
        case "taken":
        this.addCourse("Completed", this.state.selectedCourse);
        this.setState({});
        break;
        case "in_progress":
        this.addCourse("In Progress", this.state.selectedCourse);
        this.setState({});
        break;
        case "required":
        this.addCourse("Required", this.state.selectedCourse);
        this.setState({});
        break;
        default:
        break;
      }
    }

      this.saveAcademicHistory();
    }



  componentDidMount = () => {
    SearchbarAccess.addListener(this);
  }

  componentWillUnmount = () => {
    SearchbarAccess.removeListener(this);
    this.saveAcademicHistory();
  }

  saveAcademicHistory = () => {
    var academicInformation = {
      taken: this.state.taken,
      in_prog: this.state.in_progress,
      required: this.state.required
    }
    this.props.handleSaveAcademicHistory(academicInformation);
  }


  handleDegreeAuditUpload = (file) => {
    this.props.showLoading();
    UserAccessor.parseDegreeAudit(file, function(data, self) {
        self.setState({
            taken: data.completed,
            in_progress: data.ip,
            required: data.missing
        })
      self.saveAcademicHistory();
      self.props.hideLoading();
    }, this);
  }

  notifySelection = (course) => {
    this.setState({
      selectedCourse: course
    });
  }

  notifyDoubleClick = (course) => {
    if (this.containsCourse(course) === true) {
      MessageHandler.sendMessage(course.id + " is already being tracked.", false);
      return;
    }
    this.addCourse("Required", course);
    this.saveAcademicHistory();
    this.setState({});
  }

  /*
   * Adjusts and saves changes to the courses listed
   * in the arrays.
   *  toIden: id of selected dropdown button within array
   *  fromIden: id of current Scroll List object (list where button is leaving)
   *  index: reference value for button position in fromIden array
   */
  handleMoveCourse = (toIden, fromIden, index) => {
    // return removed course from array
    let course = this.removeCourse(fromIden, index);
    if(toIden !== "Remove") {
      this.addCourse(toIden, course);
    }
    this.saveAcademicHistory();
    this.setState({});
  }

  /**
   * @description 
   *
   * @returns
   * @memberof AcademicHistory
   */
  render() {
    console.log("RENDERING WITH", this.state);
    var addingCourse = this.state.selectedCourse !== undefined;
    return(
      <div className="container-academic-history-top">
      <div className="container-academic-history-content">
      <PercentComplete
        complete={this.state.taken.length}
      required={this.state.required.length}/>
      <ScrollList
        left={20}
        default_color={this.state.default_color ? this.state.default_colors["complete"] : "2"}
        title="Completed Courses"
        isButton={addingCourse}
        inVal={this.state.taken}
        id={"taken"}
        handleTitleClick={this.handleTitleClick}
        handleMoveCourse={this.handleMoveCourse}
      identifier="Completed"/>
      <ScrollList
        left={40}
        handleTitleClick={this.handleTitleClick}
        default_color={this.state.default_color ? this.state.default_colors["in_progress"] : "4"}
        title="In Progress"
        isButton={addingCourse}
        inVal={this.state.in_progress}
        id={"in_progress"}
        handleMoveCourse={this.handleMoveCourse}
      identifier="In Progress"/>
      <ScrollList
        left={60}
        handleTitleClick={this.handleTitleClick}
        default_color={this.state.default_color ? this.state.default_colors["required"] : "3"}
        title="Required"
        isButton={addingCourse}
        inVal={this.state.required}
        id={"required"}
        handleMoveCourse={this.handleMoveCourse}
      identifier="Required"/>
      <div className="col text-center" style={{postiion: "absolute", top: "80%"}}>
      <HistoryModal handleDegreeAuditUpload={this.handleDegreeAuditUpload} {...this.props}></HistoryModal>
      </div>
      </div>
      <div className="right-search-bar">
      <RightSearchBar className="right-search-bar"/>
      </div>
      </div>
      );}
    }


  AcademicHistory.propTypes = {
    academicHistoryInformation: PropTypes.object.isRequired,
    handleSaveAcademicHistory: PropTypes.func.isRequired
  }

export default AcademicHistory;
