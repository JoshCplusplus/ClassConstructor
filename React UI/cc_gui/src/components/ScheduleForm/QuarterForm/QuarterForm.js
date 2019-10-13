import React from "react";
import PropTypes from 'prop-types';
import CourseEntries from './CourseEntries';
import './QuarterForm.css'
import LeftSearchbar from './../../Searchbar/LeftSearchbar';


class QuarterForm extends React.Component {

    constructor(props) {
        super(props);


        this.courses = [
            "cse 110",
            "cse 110",
            "cse 110",
            "cse 110"
        ];
    }

    handleCourseClick = (courseIndex) => {
        this.props.onSelect(courseIndex);
    }

    handleRemoveClick = (courseIndex) => {
        this.props.onRemove(courseIndex);
    }

    recommendQuarter = (quarterId) => {
        this.props.handleRecommendQuarter(quarterId);
    }

    render() {
        return (
            <div className="quarter-form-wrapper">
                <LeftSearchbar/>
                <div className="quarter-form-title">
                    {this.props.scheduleInformation.getQuarterTitle(this.props.quarterId)}
                </div>

                <div className="course-entries-container">
                    <CourseEntries
                    recommendQuarter={this.recommendQuarter}
                    handleCourseClick={this.handleCourseClick}
                    handleRemoveClick={this.handleRemoveClick}
                    quarterID={this.props.quarterId}
                    scheduleInformation={this.props.scheduleInformation}/>
                </div>
            </div>

        );
    }
}

QuarterForm.propTypes = {
    quarterId: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    scheduleInformation: PropTypes.object.isRequired,
    handleRecommendQuarter: PropTypes.func.isRequired
}


export default QuarterForm;
