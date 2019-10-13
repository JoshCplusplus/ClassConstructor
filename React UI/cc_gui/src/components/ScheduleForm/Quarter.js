import React from "react";
import './Quarter.css';
import Course from './Course'
import PropTypes from 'prop-types';

/*eslint-disable*/

class Quarter extends React.Component {


    handleTitleClick = (e) => {
        this.props.handleTitleClick(this.props.id);

    }

    handleClassClick = (quarterId, course) => {
        this.props.handleClassClick(this.props.id, quarterId);
    }

    handleRemoveCourse = (courseIndex) => {
        this.props.handleRemoveCourse(courseIndex, this.props.id);
    }

    getBackgroundColor = (course, isSelected) => {
        if (course.hasPrereqs === false) {
            return "lacks-prereqs";
        } else if (course.likelyToBeOffered(this.props.quarterInformation.getSeason())) {
            return "likely";
        }
        return "unlikely";
    }

    render() {

        return (
            <div className="total" >
                    <div className={"container-fluid", "quarter"}>
                        <div className={"row", "quarter-row"}>
                            <div className={"col", "column"}>
                                <div className="title-row" onClick={this.handleTitleClick}>
                                    {this.props.quarterInformation.getTitle()}
                                </div>
                            </div>
                        </div>
                        {this.props.quarterInformation.mapCourses(function(courseInfo, index, self) {
                            return (
                                <Course
                                key={index}
                                id={index}
                                quarterId={self.props.id}
                                handleClick={self.handleClassClick}
                                isSelected={self.props.selectedIndex === index}
                                handleRemoveButton={self.handleRemoveCourse}
                                courseInformation={courseInfo}
                                backgroundColor={self.getBackgroundColor(courseInfo, self.props.selectedIndex === index)}/>
                            );
                        }, this)}
                        <div className="row quarter-row">
                            <div className={"col", "unit-title-column"} name="quarter">
                                Total Units:
                            </div>
                            <div className={"col", "unit-column"} name="quarter">
                                {this.props.quarterInformation.getUnits()}
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

Quarter.propTypes = {
    selectedIndex: PropTypes.number.isRequired,
    handleRemoveCourse: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    quarterInformation: PropTypes.object.isRequired
}

export default Quarter;
