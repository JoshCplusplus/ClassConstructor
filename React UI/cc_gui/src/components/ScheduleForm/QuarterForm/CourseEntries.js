import React from "react";
import PropTypes from 'prop-types';
import CourseEntry from './CourseEntry';
import './CourseEntries.css';
import * as MessageHandler from '../../Functionality/MessageHandler';

/*eslint-disable*/


class CourseEntries extends React.Component {

    handleCourseClick = (courseIndex) => {
        this.props.handleCourseClick(courseIndex);
    }

    handleRemoveClick = (courseIndex) => {
        this.props.handleRemoveClick(courseIndex);
    }

    handleNukeClick = () => {
        for(var i = 6; i >= 0 ; i--)
            this.props.handleRemoveClick(i);
    }

    handleButtonClick(quarterID) {
        if (this.props.scheduleInformation.getQuarter(quarterID).size > 0)
            MessageHandler.sendMessage("You have courses in this quarter.  Please clear the quarter to continue", false);
        else
            this.props.recommendQuarter(quarterID);
    }

    render() {
        return (
            <div className="course-entries-wrapper">
                <div className={"container-fluid", "course-list-container"}>
                    {this.props.scheduleInformation.mapCourses(this.props.quarterID, function(course, index, self) {
                            return (
                                <div className="course-row-wrapper"
                                 key={index}>
                                    <CourseEntry
                                     key={index}
                                     id={index}
                                     name={course.getId()}
                                     handleCourseClick={self.handleCourseClick}
                                     handleRemoveClick={self.handleRemoveClick}
                                    />
                                </div>
                            );
                        }, this)}
                </div>
                <div className="course-row-wrapper">
                    <button className="course-entry-nuke-button" onClick={this.handleNukeClick}>
                            Clear
                    </button>
                    <button className="course-entry-recommend-button"
                            onClick={() => {this.handleButtonClick(this.props.quarterID)}}>
                            Recommend Quarter
                    </button>
                </div>
            </div>
        );
    }
}

CourseEntries.propTypes = {
    handleCourseClick: PropTypes.func.isRequired,
    handleRemoveClick: PropTypes.func.isRequired,
    quarterID: PropTypes.number.isRequired,
    scheduleInformation: PropTypes.object.isRequired,
    recommendQuarter: PropTypes.func.isRequired
}


export default CourseEntries;
