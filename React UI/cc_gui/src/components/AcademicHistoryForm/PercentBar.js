import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PropTypes from 'prop-types';

class PercentBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            complete: props.complete,
            required: props.required
        }
    }

    render() {
        // set value as percent of completed courses
        let val = 0;
        if (this.props.required !== 0) {
            val = (this.props.complete) / (this.props.complete + this.props.required) * 100;
            val = val.toFixed(2);
        }
        return (
            <div className="percent-bar">
                <h1>Percent Complete: </h1>
                <ProgressBar animated striped variant="success" now={val} label={`${val}%`}/>
            </div>
        )
    }
}

PercentBar.propTypes = {
    complete: PropTypes.number.isRequired,
    required: PropTypes.number.isRequired
}

export default PercentBar;
