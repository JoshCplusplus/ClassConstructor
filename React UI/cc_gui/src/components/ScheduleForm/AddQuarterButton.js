import React from "react";
import './AddQuarterButton.css';
import PropTypes from 'prop-types';

class AddQuarterButton extends React.Component {

    constructor(props) {
        super(props);

        this.courses = []
        this.units = 0

        this.state = {
            hovering: false
        }


        this.handleClassClick = this.handleClassClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.getClasses = this.getClasses.bind(this);

    }

    onMouseEnter() {
        this.setState({
            hovering: true
        })
    }

    onMouseLeave() {
        this.setState({
            hovering: false
        })
    }

    handleClassClick() {

    }

    handleButtonClick() {
        this.props.clickListener();
    }

    getClasses() {
        return "button " + (this.state.hovering ? "button-hovering" : "button-not-hovering");
    }

    render() {

        var cName = this.getClasses()

        return (
            <div className={cName}
             onClick={this.handleButtonClick}
             onMouseEnter={this.onMouseEnter}
             onMouseLeave={this.onMouseLeave}>
                <table className="button-table">
                    <tbody>
                        <tr>
                            <td>
                                +
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
AddQuarterButton.propTypes = {
    clickListener: PropTypes.func.isRequired
}


export default AddQuarterButton;
