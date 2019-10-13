import React from "react";
import PropTypes from 'prop-types';
import './CourseEntry.css'
import trash from './../../trash.png';
/*eslint-disable*/


class CourseEntry extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hoveringCourse: false,
            hoveringButton: false
        }
    }

    onMouseEnterButton = (event) => {
        this.setState({
            hoveringButton: true
        })
    }

    onMouseLeaveButton = (event) => {
        this.setState({
            hoveringButton: false
        })
    }

    onMouseEnterCourse = (event) => {
        this.setState({
            hoveringCourse: true
        })
    }

    onMouseLeaveCourse = (event) => {
        this.setState({
            hoveringCourse: false
        })
    }

    getCourseHoveringClassName = () => {
        return (this.state.hoveringCourse ? "course-entry-hovering" : "");
    }

    getButtonHoveringClassName = () => {
        return (this.state.hoveringButton ? "delete-button-hovering" : "");
    }

    removeButtonClick = () => {
        this.props.handleRemoveClick(this.props.id);
    }

    courseButtonClick = () => {
        this.props.handleCourseClick(this.props.id);
    }


    render() {
        return (
            <div className={"row", " course-entry-wrapper", "unselectable"}>
                <div className={"col", this.getButtonHoveringClassName() + " course-entry-delete-button"}
                 onMouseEnter={this.onMouseEnterButton}
                 onMouseLeave={this.onMouseLeaveButton}
                 onClick={this.removeButtonClick}>
                    <img src={trash} className="course-entry-image" alt="x"/>
                </div>
                <div className={"col", this.getCourseHoveringClassName() + " course-entry-column"}
                 onMouseEnter={this.onMouseEnterCourse}
                 onMouseLeave={this.onMouseLeaveCourse}
                 onClick={this.courseButtonClick}>
                    {this.props.name}
                </div>
            </div>
        );
    }
}

CourseEntry.propTypes = {
    name: PropTypes.string.isRequired,
    handleRemoveClick: PropTypes.func.isRequired,
    handleCourseClick: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired
}


export default CourseEntry;
