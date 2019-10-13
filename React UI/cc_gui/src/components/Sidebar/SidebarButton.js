import React from "react";
import './SidebarButton.css'
import PropTypes from 'prop-types';
/*eslint-disable*/


import {
  withRouter
} from 'react-router-dom'

class SidebarButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hovering: false
        }

        this.onClick = this.onClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.getBaseName = this.getBaseName.bind(this);
    }

    onClick = (e) => {
        this.props.buttonClicked(this.props.path);
        if (this.props.isPath && this.props.location.pathname !== ('/' + this.props.path)) {
            this.props.history.push('/' + this.props.path)
        }
    }

    onMouseEnter() {
        this.setState({
            hovering: true
        });
    }

    onMouseLeave() {
        this.setState({
            hovering: false
        });
    }

    getBaseName() {
        let path = this.props.location.pathname;

        if (this.props.color === "green") {
            return "add-schedule-button";
        } else if (this.state.hovering) {
            return "on-hover";
        } else if (path === '/' + this.props.path) {
            return "at-page";
        } else {
            return (this.props.isSchedule ? "schedule-button" : "page-button")
        }
    }

    getScheduleName() {
        if (this.props.isSchedule) {
            return "schedule-button-button";
        }
        return "sidebar-button-button";
    }


    render() {
        return (
            <div className={"row", "sidebar-button-row", this.getBaseName()}
                onClick={this.onClick}
                onMouseEnter = {this.onMouseEnter}
                onMouseLeave = {this.onMouseLeave}>
                <button className={this.getScheduleName()}>
                    {this.props.name}
                </button>
            </div>
        );
    }
}

SidebarButton.propTypes = {
    buttonClicked: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    isPath: PropTypes.bool.isRequired,
    isSchedule: PropTypes.bool.isRequired,
    id: PropTypes.string
}

export default withRouter(SidebarButton);
