import React from "react";
import './App.css';
import Schedule from "./components/ScheduleForm/Schedule";
import ScheduleTitle from "./components/ScheduleForm/ScheduleTitle";
import ScheduleSummary from "./components/ScheduleForm/ScheduleSummary";
import { Route, withRouter, Redirect } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import LinksPage from "./components/LinksPage"
import SettingsForm from "./components/SettingsForm/SettingsForm";
import LoginForm from "./components/LoginForm/LoginForm";
import AcademicHistoryForm from './components/AcademicHistoryForm/AcademicHistory';
import * as MessageHandler from './components/Functionality/MessageHandler';
import * as UserAccessor from './components/Accessors/UserAccessor';
import * as ScheduleAccessor from './components/Accessors/ScheduleAccessor';
import * as SettingsAccessor from './components/Accessors/SettingsAccessor';
import * as AppConstants from './AppConstants';
import * as SearchbarAccess from './components/Searchbar/SearchbarAccess';
import Loading from './Loading';
import { renderToString } from 'react-dom/server'
import { Loader } from 'react-overlay-loader';

/*eslint-disable*/

import 'react-overlay-loader/styles.css';

/*

*/
class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gotLoginStatus: false,
            loginStatus: false,
            scheduleList: [],
            selectedCourse: undefined,
            rootStyle: {},
            displayingLoadingOverlay: false
        }
        // Tracks the last time we tried to save the schedule name
        this.lastSaveScheduleNameCall = (new Date()).getTime();
    }


    /*
    -------------------------------------------------------------------------
        Component Loaders
    -------------------------------------------------------------------------
    */

    Welcome = () => {
        return (
            <div className="whole">
                <div className="welcome-container">
                      <img src={ require('./components/imgCCLogo.png') } className={"welcome-image"} alt="Logo not found."/>
                      <div>
                          Welcome!  
                          Class Constructor is a tool to help you plan out your journey at UCSD.
                          We provide schedule recommendations based on the courses you need to graduate.
                          Please create a schedule or navigate to an existing schedule to start planning!
                      </div>
                </div>
            </div>
        );
    }

    Schedule = () => {
        var arr = this.props.location.pathname.split('/');
        if (arr.length < 1) {
            console.error("Error loading schedule, id not found");
        }
        var index = parseInt(arr[arr.length - 1]);
        var schedule = this.state.scheduleList[index];
        var displayBottom = (this.state.selectedCourse !== undefined);
        var botClassName = (displayBottom === false) ? "empty-bot" : "bot";
        return (<div className="page-root">
            <div className={"container-fluid text-center"} >
                <div className={"top"}>
                    <ScheduleTitle
                        name={schedule.name}
                        index={index}
                        onNameChange={this.scheduleNameChange}
                        handleDeleteSchedule={this.handleDeleteSchedule}
                        handleExportClick={this.handleExportClick}
                    />
                </div>

                <div className="mid">
                    <Schedule
                        handleSaveSchedule={this.saveSchedule}
                        handleSaveNewQuarter={this.saveNewQuarter}
                        handleRecommendQuarter={this.handleRecommendQuarter}
                        scheduleInformation={schedule}
                        index={index}
                        onSelectCourse={this.onSelectCourse}
                        displayBottom = {displayBottom}
                        academicInformation={this.state.academicInformation}
                    />
                </div>

                <div className={botClassName}>
                    <ScheduleSummary course={this.state.selectedCourse}
                                     academicHistory={this.state.academicInformation}/>
                </div>
            </div>
        </div>);
    }

    Links = () => {
        return (
            <div className={"container-fluid text-center"} >
                <div className={"mid"}>
                    <LinksPage></LinksPage>
                </div>
            </div>

    )}

    AcademicHistory = () => {
        return <AcademicHistoryForm
            showLoading={this.makeLoadingVisible}
            hideLoading={this.makeLoadingInvisible}
            academicHistoryInformation={this.state.academicInformation} handleSaveAcademicHistory={this.saveAcademicHistory}/>;
    }

    Login = () => {
        return (
            <div className="page-wrapper center">
                <LoginForm userData = {UserAccessor.getEmptyData()} handleLoginSuccess = {this.handleLoginSuccess} />
            </div>
        );
    }

    Settings = () => {
        return <SettingsForm saveSettings={this.saveSettings} settingsInformation={this.state.settingsInformation}/>;
    }


    /*
    -------------------------------------------------------------------------
        Functionality
    -------------------------------------------------------------------------
    */

    makeLoadingVisible = () => {
        this.setState({
            displayingLoadingOverlay: true
        })
    }

    makeLoadingInvisible = () => {
        this.setState({
            displayingLoadingOverlay: false
        })
    }

    handleExportClick = (scheduleIndex) => {
        let schedule = this.state.scheduleList[scheduleIndex];
        // Check if there is a quarter to delete
        if (schedule.quarters.length === 0) {
            MessageHandler.sendMessage("There are no quarters to remove.", false);
            return;
        }
        let quarterId = schedule.quarters[schedule.quarters.length - 1]._id;
        // Make local changes
        this.state.scheduleList[scheduleIndex].quarters.splice(this.state.scheduleList[scheduleIndex].quarters.length - 1, 1);

        this.setState({
        });
        // Update the database
        ScheduleAccessor.deleteQuarter(this.state.scheduleList[scheduleIndex]._id, quarterId);
    }






    /*
        Splits the passed in user data into manageable formats for the pages
    */
    splitUserData = (userData) => {



        var schedules = userData.schedules;
        if (schedules === undefined) {
            schedules = [];
        }

        //var schedules = [{name: "SCHEDULE", id: "1", quarters: [{id: "2", courses: [{id: "34", name:"cse 110", units: "11" }, {id: "20", name: "cse 100", units: "4"}]}]}];

        var scheduleNames = [];
        for (var i = 0; i < schedules.length; i++) {
            scheduleNames.push({name: schedules[i].name, id: schedules[i]._id});
        }

        var profileInformation = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            imageUrl: userData.imageUrl,
            scheduleNames: scheduleNames
        }

        var settingsInformation = {
            major: userData.major,
            standing: userData.standing,
            college: userData.college
        }

        var academicInformation = {
            taken: userData.taken_courses,
            inProgress: userData.ip_courses,
            required: userData.needed_courses,
        }

        this.setState({
            profileInformation: profileInformation,
            settingsInformation: settingsInformation,
            academicInformation: academicInformation,
            scheduleList: schedules
        });


    }

    /*
    -------------------------------------------------------------------------
        Event Listeners
    -------------------------------------------------------------------------
    */

    handleRecommendQuarter = (quarterId, scheduleId) => {
        this.setState({
            displayingLoadingOverlay: true
        })
        ScheduleAccessor.recommendQuarter(quarterId, scheduleId, function(success, courseList, self) {
            if (success === false) {
                MessageHandler.sendMessage("Unable to recommend schedule, because you have no required courses listed.", false);
                self.setState({
                    displayingLoadingOverlay: false
                })
                return;
            }

            for (var i = 0; i < self.state.scheduleList.length; i++) {
                var schedule = self.state.scheduleList[i];
                if (schedule._id === scheduleId) {
                    for (var j = 0; j < schedule.quarters.length; j++) {
                        var quarter = schedule.quarters[j];
                        if (quarter._id === quarterId) {
                            // We have the right quarter
                            self.state.scheduleList[i].quarters[j].courses = courseList;
                        }
                    }
                }
            }
            self.setState({
                displayingLoadingOverlay: false
            })
        }, this);
    }

    onSelectCourse = (course) => {
        this.setState({
            selectedCourse: course
        })
    }

    componentDidMount = () => {
        UserAccessor.getUserData(function(data, isLoggedIn, self) {

            console.log("User Data", data);
            // Sets the user data to hold all the user data
            self.splitUserData(data.user);
            SearchbarAccess.setUserInformation(data.courseList, self.state.academicInformation.required);
            self.setState({
                gotLoginStatus: true,
                loginStatus: isLoggedIn
            });

            console.log("Page State", self.state);

        }, this);
    }

    handleDeleteSchedule = (scheduleIndex) => {
        ScheduleAccessor.deleteSchedule(this.state.scheduleList[scheduleIndex]._id);
        this.state.scheduleList.splice(scheduleIndex, 1);
        this.state.profileInformation.scheduleNames.splice(scheduleIndex, 1);
        this.setState({});
        this.props.history.push('/');
    }

    handleLoginSuccess = () => {
        window.location.reload();
    }

    saveSettings = (settingsInformation) => {
        this.setState({
            settingsInformation: settingsInformation
        })
        SettingsAccessor.saveSettings(settingsInformation, function(success, self) {
            MessageHandler.sendMessage("Settings successfully saved", success);
        }, this);
    }

    saveAcademicHistory = (academicHistoryInformation) => {
        UserAccessor.saveAcademicHistory(academicHistoryInformation, function(success, self) {
            console.log("INFO", academicHistoryInformation);
            self.state.academicInformation.taken = academicHistoryInformation.taken;
            self.state.academicInformation.required = academicHistoryInformation.required;
            self.state.academicInformation.inProgress = academicHistoryInformation.in_prog;
            self.setState({});
        }, this);
    }

    saveSchedule = (scheduleInformation, index) => {
        var newName = this.state.scheduleList[index].name;

        this.state.scheduleList[index] = scheduleInformation;

        this.state.scheduleList[index].name = newName;

        // Updates the schedule names if necessary
        this.state.profileInformation.scheduleNames[index].name = scheduleInformation.name;
        ScheduleAccessor.saveSchedule(this.state.scheduleList[index]);
        this.setState({});
    }

    saveNewQuarter = (quarterInformation, index) => {
        ScheduleAccessor.saveNewQuarter(quarterInformation, function(quarter, self) {
            self.state.scheduleList[index].quarters.push(quarterInformation.dictify());
            self.setState({});
        }, this);
    }

    addSchedule = () => {
        if (this.state.scheduleList.length >= AppConstants.MAX_SCHEDULES) {
            MessageHandler.sendMessage("You may only have five schedules. Please remove on to create a new one.", false);
            return;
        }
        ScheduleAccessor.getScheduleForm(function(scheduleForm, self) {
                self.state.profileInformation.scheduleNames.push(
                    { name:scheduleForm.name, id: scheduleForm._id } );
                self.state.scheduleList.push(scheduleForm);
                self.setState({})
                self.props.history.push('/schedule/' + (self.state.scheduleList.length - 1));
        }, this)
    }


    /*
        Triggers whenever there is a change in the schedule name
        @scheduleId = the schedule id of the schedule changing
        @newName = the new name of the schedule
    */
    scheduleNameChange = (scheduleId, newName, saveRemotely) => {
        // Updates the local information
        this.state.scheduleList[scheduleId].name = newName;
        this.state.profileInformation.scheduleNames[scheduleId].name = newName;
        this.setState({});

        // Checks if we should be saving remotely, and does so if necessary
        if (saveRemotely === true) {
            ScheduleAccessor.saveScheduleName(this.state.scheduleList[scheduleId]._id, newName);
        }
    }

    /*
    -------------------------------------------------------------------------
        Renderer
    -------------------------------------------------------------------------
    */

    render() {
        var loggedIn = this.state.gotLoginStatus;
        var isLoggedIn = this.state.loginStatus;
        var loginPage = String(this.props.location.pathname).includes("/login");
        var logoutPage = String(this.props.location.pathname).includes("/logout");

        if(!loggedIn) {
            if(!loginPage) {
                return (<Redirect to="/login" />);
            }
            return (<Loading/>);
        }
        if(isLoggedIn && loginPage) {
            return (<Redirect to="/" />);
        }
        if(isLoggedIn && logoutPage){
            this.state.loginStatus = false;
            fetch("/logout");
            return (<Redirect to="/login" />);
        }


        return (
            <div className={"container-fluid", "page-container-wrapper"}>
                <Loader fullPage loading={this.state.displayingLoadingOverlay}/>
                <div className="row" style={{height: "100%", width: "100%", left: "0.8%", position: "absolute"}}>
                    <Route path="/login/" component={this.Login} />
                    <div className={"col", "sidebar-style"}>
                        <Sidebar profileInformation={this.state.profileInformation} addSchedule = {this.addSchedule} />
                    </div>
                    <div className={"col", "main-style"}>
                        <Route exact path="/" component={this.Welcome} />
                        <Route path="/academic-history/" component={this.AcademicHistory} />
                        <Route path="/settings/" component={this.Settings}/>
                        {this.state.scheduleList.map(function(schedule, index) {
                            return <Route exact key={index} path={"/schedule/" + index} component={this.Schedule} />
                        }, this)}
                        <Route path="/links/" component={this.Links} />
                        {MessageHandler.getMessageHandler()}
                    </div>
                </div>
            </div>
        );
    };
}


export default withRouter(Page);
