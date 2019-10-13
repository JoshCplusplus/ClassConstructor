import React, { Component } from 'react';
import './CourseListingEntry.css';
import PropTypes from 'prop-types';

/*eslint-disable*/


class CourseListingEntry extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hovering: false
        }
    }

    onMouseEnter = (event) => {
        this.setState({
            hovering: true
        })
    }

    onMouseExit = (event) => {
        this.setState({
            hovering: false
        })
    }

    onClick = (event) => {
        this.props.onSelection(this.props.id)
        this.setState({});
    }

    getHoveringName = () => {
        if (this.props.selected) {
            return "is-selected";
        }
        return (this.state.hovering ? "courselisting-entry-hovering" : "");
    }

    onDoubleClick = () => {
        this.props.onDoubleClick(this.props.id);
    }

    render() {
        return (
            <div className={"row", "course-listing-row"}>
                <div className={"col", "course-listing-col " + this.getHoveringName()}
                 onMouseEnter={this.onMouseEnter}
                 onMouseLeave={this.onMouseExit}
                 onClick={this.onClick}
                 onDoubleClick={this.onDoubleClick}>
                    <div name="entry" className="course-listing-entry-name-wrapper">
                        {this.props.name}
                    </div>
                    <div name="entry" className="course-listing-entry-units-wrapper">
                        {this.props.units}
                    </div>
                </div>
            </div>
        );
    }
}


CourseListingEntry.propTypes = {
    selected: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    onSelection: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    units: PropTypes.string.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
}

export default CourseListingEntry
