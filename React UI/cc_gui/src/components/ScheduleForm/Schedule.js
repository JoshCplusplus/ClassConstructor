import React from "react";
import * as ScheduleConstants from './ScheduleConstants';
import './Schedule.css';
import Quarter from './Quarter';
import AddQuarterButton from './AddQuarterButton'
import Grid from '@material-ui/core/Grid';
import Scrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import QuarterModal from './QuarterForm/QuarterModal';
import * as MessageHandler from '../Functionality/MessageHandler';
import * as SearchbarInfo from '../Searchbar/SearchbarAccess';
import PropTypes from 'prop-types';
import * as ScheduleHandler from './ScheduleHandler';

class Schedule extends React.Component {

    /*
    -------------------------------------------------------------------------
        Generation and Loading Function
    -------------------------------------------------------------------------
    */

    constructor(props) {
        super(props);
        this.state = {
            update: false,
            showQuarterModal: false,
            selectedQuarter: -1,
            selectedCourse: -1,
            openedQuarter: -1,
            scheduleInformation: ScheduleHandler.getQuarterList(this.props.scheduleInformation, this.props.academicInformation)
        }

        SearchbarInfo.addListener(this);
        this.comp = React.createRef();
    }

    componentWillReceiveProps =(newProps) => {
        this.setState({
            scheduleInformation: ScheduleHandler.getQuarterList(newProps.scheduleInformation, newProps.academicInformation),
        })
    }

    componentDidMount = () => {
        this.ps = new Scrollbar(this.comp.current, {
            suppressScrollX: true,
        });
        this.setState({
            scheduleInformation: ScheduleHandler.getQuarterList(this.props.scheduleInformation, this.props.academicInformation)
        })
        this.setState({});
    }

    componentWillUnmount() {
        if (this.ps) {
          this.ps.destroy();
          this.ps = null;
        }
        SearchbarInfo.removeListener(this);
    }

    /*
    -------------------------------------------------------------------------
        Handle Function
    -------------------------------------------------------------------------
    */

    onWrapperClick = (event) => {
        if (event.target.getAttribute("name") !== "quarter" && event.target.getAttribute("name") !== "entry") {
            this.onOutsideClick();
        }
    }

    onOutsideClick = () => {
        this.clearSelectedCourse();
    }


    handleTitleClick = (quarterIndex) => {
        this.setState({
            showQuarterModal: true,
            openedQuarter: quarterIndex
        });
    }

    handleClassClick = (id, quarterIndex) => {
        this.selectClass(quarterIndex, id);
    }


    addButtonClicked = () => {
        var newQuarter = this.state.scheduleInformation.addQuarter([], "-1", this.props.scheduleInformation._id);
        this.props.handleSaveNewQuarter(newQuarter, this.props.index);
        this.update()
    }

    removeCourseButtonClick = (courseIndex, quarterIndex) => {
        this.handleRemoveCourse(quarterIndex, courseIndex);
        this.update();
    }

    handleSave = () => {
        this.props.handleSaveSchedule(this.state.scheduleInformation.dictify(), this.props.index);
    }

    /*
    -------------------------------------------------------------------------
        Modal Management
    -------------------------------------------------------------------------
    */
    onModalClose = () => {
        this.setState({
            showQuarterModal: false,
            openedQuarter: -1
        })
    }

    handleModalRemoveSelect = (quarterId, courseId) => {
        this.handleRemoveCourse(quarterId, courseId);
        this.update();
    }

    handleModalCourseSelect = (quarterId, courseId) => {
        if (this.state.scheduleInformation.isRealCourse(quarterId, courseId).success === true) {
            this.setState({
                selectedQuarter: quarterId,
                selectedCourse: courseId
            });
            this.props.onSelectCourse(this.state.scheduleInformation.getCourse(quarterId, courseId));
        } else {
            var course = SearchbarInfo.getSelectedCourse();
            if (course !== undefined) {
                // Get the selected course in the searchbar and then add that course to the open quarter
                this.handleAddCourse(quarterId, SearchbarInfo.getSelectedCourse());
            }
        }
    }

    handleRemoveCourse = (quarterId, courseId) => {
        this.state.scheduleInformation.removeCourse(quarterId, courseId);
        this.handleSave();
    }

    handleAddCourse = (quarterId, course) => {
        var status = this.state.scheduleInformation.addCourse(quarterId, course);
        if (status.displayMessage === true) {
            MessageHandler.sendMessage(status.message, status.success);
        }
        if (status.success === true) {
            this.handleSave();
            this.update();
        }
    }

    notifySelection = (course) => {
        this.props.onSelectCourse(ScheduleHandler.wrapCourse(course));
    }

    notifyDoubleClick = (course) => {
        this.handleAddCourse(this.state.openedQuarter, course);
    }

    handleRecommendQuarter = (quarterId) => {
        var sId = this.state.scheduleInformation.getScheduleId();
        var qId = this.state.scheduleInformation.getQuarterId(quarterId);
        this.props.handleRecommendQuarter(qId, sId);
    }

    /*
    -------------------------------------------------------------------------
        Misc. Functionality
    -------------------------------------------------------------------------
    */
    update = () => {
        this.setState({
            update: true
        })
    }

    clearSelectedCourse = () => {
        this.setState({
            selectedCourse: -1,
            selectedQuarter: -1
        })
        this.props.onSelectCourse(undefined);
    }

    selectClass = (courseIndex, quarterIndex) => {

        // Check if we are selecting a real course, in which case switch selection
        if (this.state.scheduleInformation.isRealCourse(quarterIndex, courseIndex)) {
            this.setState({
                selectedQuarter: quarterIndex,
                selectedCourse: courseIndex
            })
            this.props.onSelectCourse(this.state.scheduleInformation.getCourse(quarterIndex, courseIndex));
            return;
        }


        this.props.onSelectCourse(undefined);

        // At this point, the selected class is not a real course

        // Check if we are selecting a course in the same quarter, in which case open quarter
        if (this.state.selectedQuarter === -1 || this.state.selectedQuarter === quarterIndex) {
            this.handleTitleClick(quarterIndex);
            return;
        }

        // The only case is we select an empty course in a different quarter, and we have something already selected

        var s = this.state.scheduleInformation.moveCourse(this.state.selectedQuarter, this.state.selectedCourse, quarterIndex);
        if (s.success === false) {
            MessageHandler.sendMessage(s.message, false);
            this.update();
        }

        this.setState({
            selectedQuarter: -1,
            selectedCourse: -1
        });
        this.handleSave();
    }

    /*
    -------------------------------------------------------------------------
        Rendering
    -------------------------------------------------------------------------
    */


    getScheduleOverviewClassName = () => {
        if (this.props.displayBottom) {
            return "schedule-wrapper";
        }
        return "schedule-wrapper-no-course-overview";
    }

    render() {

        return (
            <div
                id="schedule-total-wrapper"
                onClick={this.onWrapperClick}
            >
                <QuarterModal
                 open={this.state.showQuarterModal}
                 onRequestClose={this.onModalClose}
                 quarterID={this.state.openedQuarter}
                 handleCourseSelect={this.handleModalCourseSelect}
                 handleRemoveSelect={this.handleModalRemoveSelect}
                 scheduleInformation={this.state.scheduleInformation}
                 handleRecommendQuarter={this.handleRecommendQuarter}/>
                <div className={this.getScheduleOverviewClassName()}>
                    <div className={"schedule-grid"} ref={this.comp}>
                        <Grid container
                        justify='center'
                        spacing={ScheduleConstants.QUARTER_SPACING}
                        className='grid'>
                            {this.state.scheduleInformation.mapQuarters(function(quarterInfo, index, self) {
                                var indexSelected = (index === self.state.selectedQuarter ? self.state.selectedCourse : -1 );
                                return (<Grid item
                                        key={index}>
                                            <Quarter
                                            quarterInformation={quarterInfo}
                                            key={index}
                                            id={index}
                                            handleTitleClick = {self.handleTitleClick}
                                            handleClassClick = {self.handleClassClick}
                                            selectedIndex={indexSelected}
                                            handleRemoveCourse={self.removeCourseButtonClick}/>
                                        </Grid>)
                            }, this)}
                            <Grid item>
                                <AddQuarterButton clickListener={this.addButtonClicked}></AddQuarterButton>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

Schedule.propTypes = {
    scheduleInformation: PropTypes.object.isRequired,
    handleSaveSchedule: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    onSelectCourse: PropTypes.func.isRequired,
    displayBottom: PropTypes.bool.isRequired,
    academicInformation: PropTypes.object.isRequired,
    handleRecommendQuarter: PropTypes.func.isRequired
}


export default Schedule;
