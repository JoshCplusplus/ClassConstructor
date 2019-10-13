import React, { Component } from 'react';
import './CheckboxComponent.css';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

const checkboxTheme = {
    width: "95%",
    margin: "0%",
    height: "2rem",
    position: "relative",
    left: "5%"
}

class CheckboxComponent extends Component {

    toggleCheckbox = (event) => {
        this.props.handleToggle(this.props.id);
    }

    handleChange = (event) => {
        console.log("change handled");
    }

    render() {
        return (
            <FormGroup style={checkboxTheme}>
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      onChange={this.toggleCheckbox}
                      value="checkedI"
                      checked={this.props.initToggle}
                    />
                  }
                  label={this.props.name}
                />
            </FormGroup>
        );
    }
}


CheckboxComponent.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    handleToggle: PropTypes.func.isRequired,
    initToggle: PropTypes.bool.isRequired
}

export default CheckboxComponent
