import React from "react";
import './SettingsForm.css';
import './SettingsConstants';
import Field from './Field';
import SettingsDropDown from './SettingsDropDown';
import * as SettingsAccessor from '../Accessors/SettingsAccessor';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';

class SettingsForm extends React.Component {


    constructor(props) {
        super(props);


        this.collegeOptions = [
            "John Muir",
            "Thurgood Marshall",
            "Revelle",
            "Earl Warren",
            "Eleanor Roosevelt",
            "Sixth"
        ];

        this.standingOptions = [
            "Freshman",
            "Sophomore",
            "Junior",
            "Senior"
        ];

        this.standing = this.props.settingsInformation.standing;
        this.college = this.props.settingsInformation.college;
        this.major = this.props.settingsInformation.major;

        this.originalSettings = this.props.settingsInformation;

        this.state = {
            settings: SettingsAccessor.getEmptySettings(),
            unsavedChanges: false
        }
    }

    componentDidMount = () => {

        window.addEventListener("beforeunload", (ev) => {
            if (this.areUnsavedChanges()) {
                ev.preventDefault();
                return ev.returnValue = 'Are you sure you want to close?';
            }
        });
    }

    componentWillUnmount = () => {
        if (this.areUnsavedChanges()){
            this.saveSettings();
        }
        window.removeEventListener('beforeunload', this.handleWindowClose);
    }

    saveSettings = () => {
        var settings = {
            standing: this.standing,
            college: this.college,
            major: this.major
        }
        this.originalSettings = settings;
        this.props.saveSettings(settings);
    }

    onStandingChange = (event, value) => {
        this.standing = value;
        this.setState({})
    }

    onCollegeChange = (event, value) => {
        this.college = value;
        this.setState({});
    }

    handleFieldChange = (value) => {
        this.major = value;
        this.setState({})
    }

    areUnsavedChanges = () => {
        if (this.standing !== this.originalSettings.standing ||
            this.college !== this.originalSettings.college ||
            this.major !== this.originalSettings.major) {
                return true;
            }
        return false;
    }

    render() {
        var unsavedChanges = this.areUnsavedChanges();

        var variant = (unsavedChanges) ? "warning" : "success";
        var buttonText = (unsavedChanges) ? "Save Unsaved Changes" : "Save";
        return (
            <div className="settings-center settings-wrapper">
                <div className="settings-center">
                    <ul className="settings-list">
                        <li className="field-entry">
                            <Field
                             name="Major"
                             handleFieldChange={this.handleFieldChange}
                             initValue={this.major}/>
                        </li>
                        <li className="drop-down-entry">
                            <SettingsDropDown
                            initSelected={this.standing}
                             options={this.standingOptions}
                             name="Standing"
                             onChange={this.onStandingChange}/>
                        </li>
                        <li className="drop-down-entry">
                            <SettingsDropDown
                            initSelected={this.college}
                             options={this.collegeOptions}
                             name="College"
                             onChange={this.onCollegeChange}/>
                        </li>
                        <li className="drop-down-entry">
                            <Button variant={variant} size="lg" onClick={this.saveSettings} block>
                                {buttonText}
                            </Button>
                        </li>

                    </ul>

                </div>
            </div>
        );
    }
}

SettingsForm.propTypes = {
    settingsInformation: PropTypes.object.isRequired,
    saveSettings: PropTypes.func.isRequired
}


export default SettingsForm;
