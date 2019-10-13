import React from "react";
import './Course.css';
import PropTypes from 'prop-types';

/*eslint-disable*/


class Course extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hover: false
        }
    }

    /*
        Triggers when the class portion is clicked
    */
    classClicked = (e) => {
        this.props.handleClick(this.props.id, this);
    }

    /*
        Triggers when the units portion is clicked
    */
    unitsClicked = (e) => {
        console.log("unitsClicked");
    }

    /*
        Triggered when the course is hovered over
    */
    onHover = () => {
        this.setState({hover: true})
    }

    /*
        Triggered when the mouse leaves the course
    */
    onMouseLeave = () => {
        this.setState({hover: false})
    }

    /*
        Triggered when the remove button is clicked
    */
    onRemoveClick = () =>{
        this.props.handleRemoveButton(this.props.id);
    }

    getExtraClassName = () => {
        if (this.props.isSelected === true) {
            return "selected-" + this.props.backgroundColor;
        }
        return (this.state.hover ? "hover-" : "") + this.props.backgroundColor;
    }

    render() {

        // The css name for the course
        var extraClassName = this.getExtraClassName();
        return (
            <div className={"container-fluid", "course-container"}>
                <div className={"row"}>
                    <div
                        name="quarter"
                     className={"col " + extraClassName}
                     onClick={this.onRemoveClick}
                     onMouseOver={this.onHover}
                     onMouseLeave={this.onMouseLeave}>
                        x
                    </div>
                    <div className={"col", "course-title"}>
                        <div
                            name="quarter"
                        className={"course-base " + extraClassName}
                        onClick={this.classClicked}
                        onMouseOver={this.onHover}
                        onMouseLeave={this.onMouseLeave}>
                                {this.props.courseInformation.getId()}
                        </div>
                    </div>
                    <div className={"col", "course-units"}>
                        <div
                        name="quarter"
                        className={"course-base " + extraClassName}
                        onClick={this.unitsClicked}
                        onMouseOver={this.onHover}
                        onMouseLeave={this.onMouseLeave}>
                            {this.props.courseInformation.getUnitsDisplay(this.props.quarterId, this.props.id)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Course.propTypes = {
    id: PropTypes.number.isRequired,
    quarterId: PropTypes.number.isRequired,
    handleClick: PropTypes.func.isRequired,
    isSelected: PropTypes.bool.isRequired,
    handleRemoveButton: PropTypes.func.isRequired,
    courseInformation: PropTypes.object.isRequired,
    backgroundColor: PropTypes.string.isRequired,
}


export default Course;
