import React from "react";
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import QuarterForm from './QuarterForm';


const modalStyle = {
  content : {
    top                   : '45%',
    left                  : '60%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    maxHeight             : '72%',
    height                : "37rem",
    width                 : '35%',
    backgroundColor       : 'white',
    transform             : 'translate(-50%, -50%)',
    borderRadius        : '10px'
  }
};


class QuarterModal extends React.Component {

    constructor(props) {
        super(props);

        this.onCloseModal = this.onCloseModal.bind(this);
    }

    componentWillMount() {
        Modal.setAppElement('body');
    }

    onCloseModal() {
        console.log("no closing");
        this.props.onRequestClose();
    }

    handleCourseSelect = (courseId) => {
        this.props.handleCourseSelect(this.props.quarterID, courseId);
    }

    handleRemoveSelect = (courseId) => {
        this.props.handleRemoveSelect(this.props.quarterID, courseId);
    }

    handleRecommendQuarter = (quarterId) => {
        this.props.handleRecommendQuarter(quarterId);
    }

    render() {
        return (
            <Modal
             isOpen={this.props.open}
             style={modalStyle}
             onRequestClose={this.props.onRequestClose}
             medium
             >
                <QuarterForm
                handleRecommendQuarter={this.handleRecommendQuarter}
                quarterId={this.props.quarterID}
                onSelect={this.handleCourseSelect}
                onRemove={this.handleRemoveSelect}
                scheduleInformation={this.props.scheduleInformation}/>
            </Modal>

        );
    }
}

QuarterModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    quarterID: PropTypes.number.isRequired,
    handleCourseSelect: PropTypes.func.isRequired,
    handleRemoveSelect: PropTypes.func.isRequired,
    scheduleInformation: PropTypes.object.isRequired,
    handleRecommendQuarter: PropTypes.func.isRequired
}


export default QuarterModal;
