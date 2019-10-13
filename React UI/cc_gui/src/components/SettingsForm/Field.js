import React from "react";
import './Field.css';
import './SettingsConstants'
import PropTypes from 'prop-types';

class Field extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            value: this.props.initValue,
            hovering: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.initValue
        })
    }

    handleChange = (event) => {
        this.setState({
            value: event.target.value
        });
        this.props.handleFieldChange(event.target.value);
    }

    handleMouseClick = (event) => {
        event.target.select();
    }

    handleMouseOver = (event) => {
        this.setState({
            hovering: true
        })
    }

    handleMouseLeave = (event) => {
        this.setState({
            hovering: false
        })

    }

    getFieldClass = () => {
        return (this.state.hovering ? "field-text-entry-hovering" : "field-text-entry");
    }

    render() {
        return (
            <div className="field-container">
                <div className="field-title">
                    {this.props.name + ":"}
                </div>
                <div className="field-entry-container">
                    <input className={this.getFieldClass()}
                     type="text"
                     name="name2"
                     value={this.state.value}
                     onChange={this.handleChange}
                     onClick={this.handleMouseClick}
                     onMouseOver={this.handleMouseOver}
                     onMouseOut={this.handleMouseLeave}/>
                </div>
            </div>
        );
    }
}


Field.propTypes = {
    name: PropTypes.string.isRequired,
    initValue: PropTypes.string.isRequired,
    handleFieldChange: PropTypes.func.isRequired
}



export default Field;
