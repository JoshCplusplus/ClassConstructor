import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import ClassButton from './ClassButton';
import PropTypes from 'prop-types';
import './ScrollList.css';

/**
 * @description ScrollList creates a list object based on imported data with scroll functionality.
 * Displays clickable buttons with toggleable colors. Purpose: hold interactive lists of classes.
 *
 * @class ScrollList
 * @extends {React.Component}
 */
class ScrollList extends React.Component {
    /**
     *@description Creates an instance of ScrollList.
     * @param {*} props
     * @memberof ScrollList
     * 
     * @returns {Object} ScrollList object
     */
    constructor(props) {
        super(props)
        /*
         *  state variables:
         *      data: input values from parent containing class objects
         *      title: title of Scroll List
         *      default_color: default color of the buttons in this list
         *      hoveringTitle: whether the mouse is currently over the title field
         */
        this.state = {
            data : this.props.inVal,
            title: this.props.title,
            default_color: this.props.default_color,
            hoveringTitle: false
        }
    }

    
    componentWillReceiveProps = (newProps) => {
        this.setState({
            data: newProps.inVal
        })
    }

    /*
     * 
     * fromIdentifier: id of selected dropdown button
     * index: reference value for button position in list array
    */
    /**
     * @description Passes the on-click handling from the child button to the parent (Academic History).
     * 
     * @param {string} fromIdentifier id of selected dropdown button
     * @param {string} index reference value for button position in list array
     * @memberof ScrollList
     * 
     * @returns {function} this.props.handleMoveCourse(fromIdentifier, this.props.identifier, index)
     */
    handleDropDownSelect = (fromIdentifier, index) => {
        //parent object
        this.props.handleMoveCourse(fromIdentifier, this.props.identifier, index);
    }

    /**
     * @description Render function of ScrollList
     *
     * @returns {*} render function
     * @memberof ScrollList
     */
    render() {
        //check if the title is currently a button
        var isButton=this.props.isButton;
        return (
            <div className="course-list"
            style={{ left: this.props.left + "%" }}
            id={this.state.title}>
                <div className="fluid-container full-size">
                    {/* Create title field with ability to be clicekd when
                        an active item is selected from the sidebar */}
                    <h2 className={(isButton?"button-":"") + "scroll-list-title" + (this.state.hoveringTitle?"-hovering":"")}
                    onMouseOver={(e) => {this.setState({ hoveringTitle: true });}}
                    onMouseLeave={(e) => {this.setState({ hoveringTitle: false });}}
                    onClick={(e) => {
                        if(isButton)
                            this.props.handleTitleClick(this.props.id);
                    }}>
                        {this.state.title}
                    </h2>
                    <ListGroup className="list-group show-overflow"
                    style={{ height: "90%" }}>
                        {/* Create a button for each class in this list */}
                        {this.state.data.map( (data, index) =>
                                <ClassButton
                                index={index}
                                handleDropDownSelect={this.handleDropDownSelect}
                                key={data.id}
                                val={this.state.default_color}
                                >
                                    {data.id}
                                </ClassButton>
                            , this)}
                    </ListGroup>
                </div>
            </div>
        );
    }
}

// Proptype requirements
ScrollList.propTypes = {
    isButton: PropTypes.bool.isRequired,
    handleTitleClick: PropTypes.func.isRequired,
    handleMoveCourse: PropTypes.func.isRequired,
    identifier: PropTypes.string.isRequired
}

export default ScrollList;
