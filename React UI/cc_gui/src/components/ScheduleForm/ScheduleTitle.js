import React from "react";
import './ScheduleTitle.css';
import PropTypes from 'prop-types';
import trash from './../trash.png';
import * as MessageHandler from '../Functionality/MessageHandler';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


// Contants for schedule name
const SCHEDULE_NAME_CHAR_LIMIT = 40;        // Character limit on schedule name
const LENGTH_DATE_LIMITER = 1000;           // Limiter on how often to send TOAST
const SCHEDULE_SAVE_BUFFER = 2000;          // How often the schedule name is saved

class ScheduleTitle extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: this.props.name               // name of this schedule
        }

        // Tracking time for last time name was changed, and last time it was
        //  saved
        this.lastChangeCall = this.now();
        this.lastSaveCall = this.lastChangeCall;
    }

    // Returns the current system time in milliseconds
    now = () => {
        return (new Date()).getTime();
    }

    /*
        Triggered when the name is changed
    */
    onChange = (e) => {
        // If we are over the character limit, ignore the input and notify the user if necessary
        if(e.target.value.length > SCHEDULE_NAME_CHAR_LIMIT){
            var date = this.now();
            if (date - this.lastChangeCall < LENGTH_DATE_LIMITER) {
                return;
            }
            this.lastChangeCall = date;
            MessageHandler.sendMessage("Schedule names must be under 40 characters.");
            return;
        }

        // Update the stored name
        this.setState({
            name: e.target.value
        })
        // Notify the parent that the schedule has a name change, but we don't want
        //  to save
        this.props.onNameChange(this.props.index, e.target.value, false);
    }

    /*
        Triggered when the name field is selected
    */
    onClick = (e) => {
        e.target.select();
        this.setState({
            hoveringTitle: false
        })
    }

    /*
        Triggered when the name field is deselected
    */
    onBlur = (e) => {
        var time = this.now();
        // Check if we really want to save
        if (time - this.lastSaveCall > SCHEDULE_SAVE_BUFFER) {
            // Reset time tracking
            this.lastSaveCall = time;
            // Save the schedule
            this.props.onNameChange(this.props.index, e.target.value, true);
        }
    }

    /*
        Trigered whenever a key is pressed while some child is selected
        @required to prevent reloading of page on enter press
    */
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
        }
    }

    /*
        Triggered whenever mouse enters title field
    */
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

    onMouseEnterTitle = (event) => {
        this.setState({
            hoveringTitle: true
        })
    }

    onMouseLeaveTitle = (event) => {
        this.setState({
            hoveringTitle: false
        })
    }

    onMouseEnterDQ = (event) => {
        this.setState({
            hoveringDQ: true
        })
    }

    onMouseLeaveDQ = (event) => {
        this.setState({
            hoveringDQ: false
        })
    }

    onClickDQ = (event) => {
        this.props.handleExportClick(this.props.index);
    }

    getButtonHoveringClassName = () => {
        return (this.state.hoveringButton ? "schedule-entry-delete-button-hover" : "schedule-entry-delete-button");
    }

    getImgHoveringClassName = () => {
        return (this.state.hoveringButton ? "schedule-entry-image-hover" : "schedule-entry-image");
    }

    getTitleHoveringClassName = () => {
        return (this.state.hoveringTitle ? "form-styling-hover" : "form-styling");
    }

    handleDeleteSchedule = (event) => {
        this.props.handleDeleteSchedule(this.props.index);
    }

    getDeleteQuarterButtonClassName = (event) => {
        return (this.state.hoveringDQ ? "del-quarter-hover" : "del-quarter");
    }

    onCancelDeleteSchedule = () => {
    }

    onClickDel = (event) => {
        confirmAlert({
            title: 'Delete Schedule?',
            message: 'Are you sure you want to delete this schedule?',
            buttons: [
              {
                label: 'Yes',
                onClick: () => this.handleDeleteSchedule()
              },
              {
                label: 'No',
                onClick: () => this.onCancelDeleteSchedule()
              }
            ]
          });
    }


    render() {

        this.field = <label className="schedule-title-label">
            <input className="title-entry"
             onChange={this.onChange}
             onClick={this.onClick}
             onKeyDown={this.handleKeyDown}
             onBlur={this.onBlur}
             value={this.state.name}/>
        </label>;

        return (
            <div className={"schedule-title-wrapper"}>
                <form className={this.getTitleHoveringClassName()}
                      onMouseEnter={this.onMouseEnterTitle}
                      onMouseLeave={this.onMouseLeaveTitle}>
                    {this.field}
                </form>
                <div className={this.getButtonHoveringClassName()}
                     onMouseEnter={this.onMouseEnterButton}
                     onMouseLeave={this.onMouseLeaveButton}
                     onClick={this.onClickDel}>
                    <img src={trash} className={this.getImgHoveringClassName()} alt="x"/>
                </div>
                <div className={this.getDeleteQuarterButtonClassName()}
                     onMouseEnter={this.onMouseEnterDQ}
                     onMouseLeave={this.onMouseLeaveDQ}
                     onClick={this.onClickDQ}
                     >
                    <span>Delete Last Quarter</span>
                </div>
            </div>
        );
    }
}


ScheduleTitle.propTypes = {
    name: PropTypes.string.isRequired,
    onNameChange: PropTypes.func.isRequired,        // scheduleId, newName, save?
    index: PropTypes.number.isRequired,
    handleDeleteSchedule: PropTypes.func.isRequired,
    handleExportClick: PropTypes.func.isRequired
}


export default ScheduleTitle;
