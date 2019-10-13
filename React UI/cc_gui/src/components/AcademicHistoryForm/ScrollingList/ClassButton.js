import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import './ScrollList.css';
import PropTypes from 'prop-types';

/**
 * @description: Button object representing an individual class. Renders both itself and the associated
 * dropdown menu of options for the given object.
 *
 * @class ClassButton
 * @extends {React.Component}
 */
class ClassButton extends React.Component{

    /**
     *Creates an instance of ClassButton.
     * @param {*} props
     * @memberof ClassButton
     * 
     * @returns {Object} ClassButton
     */
    constructor(props) {
        super(props);
        /*
         * this.state variables: 
         *  index: reference value for item (starts at 0)
         *  hover: indicates if button is currently hovered
         *  color: index value of current button (see cycle)
         *  className: default class name
         *  cycle: array of possible color values
         */
        this.state = {
            index: props.index,
            hover: false,
            href: props.href,
            color: props.val,
            className: "py-2 base-z list-group-item list-group-item-action class-list-option list-group-item-",
            cycle: ["primary", "secondary","success","danger", "warning", "info"],
        }
        this.handleClick = this.handleClick.bind(this);
    }

  
    /**
     * @description Passes on-click handling to parent object with parameters button id and current props
     * 
     * @memberof ClassButton
     * @return {function} this.props.handleDropDownSelect(button id, this.props.index)
     */
    handleClick = (event) => {
        this.props.handleDropDownSelect(event.target.getAttribute("id"), this.props.index);
    }


    /*
     * Returns a button with associated dropdown list
     * with color derived from state and content set from
     * props.children.
    */
    /**
     * @description Returns a button with associated dropdown list with color derived from state and coentnt set from props.children
     *
     * @returns {*} render function
     * @memberof ClassButton
     */
    render() {
        return(
            <div className="container-fluid">
                <ButtonGroup style={{ width: "100%" }}>
                    <Button 
                    className={this.state.className + (this.state.cycle[this.state.color] !== undefined ? this.state.cycle[this.state.color] : 'warning')}
                    href={ this.state.href }
                    size="lg">
                        {this.props.children}
                    </Button>

                    <DropdownButton
                    variant="outline-secondary"
                    title=""
                    id="input-group-dropdown-2"
                    size="lg"
                    alignRight>
                        <Dropdown.Item
                        id="Completed"
                        onClick={this.handleClick}>
                            Mark Completed
                        </Dropdown.Item>
                        <Dropdown.Item
                        id="In Progress"
                        onClick={this.handleClick}>
                            Mark In-Progress
                        </Dropdown.Item>
                        <Dropdown.Item
                        id="Required"
                        onClick={this.handleClick}>
                            Mark Required
                        </Dropdown.Item>
                        <Dropdown.Item
                        id="Remove"
                        onClick={this.handleClick}>
                            Delete
                        </Dropdown.Item>
                    </DropdownButton>
                </ButtonGroup>
            </div>
        )
    }
}

ClassButton.propTypes = {
    handleDropDownSelect: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired
}

export default ClassButton
