import React from "react";
import './SettingsDropDown.css';
import './SettingsConstants';
import PropTypes from 'prop-types';
import MenuListComposition from './MenuListComposition'

class SettingsDropDown extends React.Component {




    render() {
        return (
            <div className="drop-down-wrapper">
                <div className="drop-down-title">
                    {this.props.name + ":"}
                </div>
                <div className="drop-down-container">
                    <div className="drop-down-button">
                        <MenuListComposition onChange={this.props.onChange} initValue={this.props.initSelected} list={this.props.options} name={this.props.name}/>
                    </div>
                </div>
            </div>

        );
    }
}

SettingsDropDown.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    initSelected: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}

export default SettingsDropDown;
