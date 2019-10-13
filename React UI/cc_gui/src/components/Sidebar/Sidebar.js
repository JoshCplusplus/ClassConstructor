import React from "react";
import './Sidebar.css'
import SidebarButton from "./SidebarButton";
import logo from './../imgCCLogo.png'
import Profile from './Profile';
import {withRouter} from "react-router-dom";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import * as MessageHandler from '../Functionality/MessageHandler';
import PropTypes from 'prop-types';

import * as SendAccessors from '../Accessors/SendAccessors';
import * as UserAccessor from '../Accessors/UserAccessor';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

/*eslint-disable*/

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reportDialogOpen: false,
            reportMessage: ""
        }
    }

    onButtonClick = (path) => {
        if (path === "report") {
            this.setState({
                reportDialogOpen: true
            })
        } else if (path === "new-schedule") {
            this.props.addSchedule();
        } else if (path === "delete account") {
            confirmAlert({
                  title: 'Delete account?',
                  message: 'Are you sure you want to delete your account?',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => this.onConfirmDeleteAccount()
                    },
                    {
                      label: 'No',
                      onClick: () => this.onCancelDeleteAccount()
                    }
                  ]
                });
        }
    }

    onConfirmDeleteAccount = () => {
        // First send a message to the backend to delete the entire account
        UserAccessor.deleteAccount((success, self) => {
            MessageHandler.sendMessage("Your account was successfully deleted!", success);
        }, this)

        // Redirect them to the login page
        this.props.history.push('/logout');
    }

    onCancelDeleteAccount = () => {
    }

    handleSubmit = (event) => {
        var name = this.props.profileInformation.firstName + " " + this.props.profileInformation.lastName;
        SendAccessors.sendEmail(name, this.state.reportMessage, function (success, self) {
            MessageHandler.sendMessage("Your report has been sent. We will deal with it as soon as possible.", success);
        }, this)
        this.setState({
            reportDialogOpen: false
        });
    }

    handleCancel = (event) => {
        this.setState({
            reportDialogOpen: false
        })
    }

    handleReportChange = (event) => {
        this.state.reportMessage = event.target.value;
    }


    render() {
        var scheduleNames = this.props.profileInformation.scheduleNames;
        return (
            <div className={"container-fluid", "sidebar", "text-center"}>
                <Dialog open={this.state.reportDialogOpen}>
                    <DialogTitle id="form-dialog-title">Report Inaccurate Data</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        Please list any inaccuracies or problems with the data. We will look into them, and fix them as soon as possible.
                        </DialogContentText>
                        <TextField
                            multiline={true}
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Report"
                            type="email"
                            fullWidth
                            onChange={this.handleReportChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSubmit} color="primary">
                            Submit
                        </Button>
                        <Button onClick={this.handleCancel} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className={"row", "sidebar-image-row"}>
                    <img src={logo} alt="logo not found" className={"sidebar-image"}/>
                </div>
                <SidebarButton name="Overview" buttonClicked={this.onButtonClick} path="" isSchedule={false} isPath={true}/>
                <SidebarButton name="Academic History" buttonClicked={this.onButtonClick} path="academic-history" isSchedule={false} isPath={true}/>
                <SidebarButton color="green" name="+ New Schedule" buttonClicked={this.onButtonClick} path="new-schedule" isSchedule={false} isPath={false}/>
                {scheduleNames.length === 0 ? [] : scheduleNames.map(function(schedule, index) {
                    return (
                        <SidebarButton key={index} id={schedule.id} name={schedule.name} buttonClicked={this.onButtonClick} path={"schedule/" + index} isSchedule={true} isPath={true}/>
                    )
                }, this)}
                <SidebarButton name="Links" buttonClicked={this.onButtonClick} path="links" isSchedule={false} isPath={true}/>
                <SidebarButton name="Settings" buttonClicked={this.onButtonClick} path="settings" isSchedule={false} isPath={true}/>
                <SidebarButton name="Report Inaccurate Data" buttonClicked={this.onButtonClick} path="report" isSchedule={false} isPath={false}/>
                <SidebarButton name="Delete Account" buttonClicked={this.onButtonClick} path="delete account" isSchedule={false} isPath={false}/>
                <SidebarButton name="Log Out" buttonClicked={this.onButtonClick} path="logout" isSchedule={false} isPath={true}/>

                <div className={"row", "sidebar-profile-row"}>
                    <Profile profileInformation={this.props.profileInformation}></Profile>
                </div>
            </div>

        );
    }
}

Sidebar.propTypes = {
    profileInformation: PropTypes.object.isRequired,
    addSchedule: PropTypes.func.isRequired,
}

export default withRouter(Sidebar);
