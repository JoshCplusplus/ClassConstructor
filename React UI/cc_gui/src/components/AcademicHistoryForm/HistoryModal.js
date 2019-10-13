import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import FileInput from '../FileInput';
import PropTypes from 'prop-types';

class HistoryModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            valid_upload: false,
            file: null
        }

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setValid = this.setValid.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleClose() {
        this.setState({ show: false, file: null, valid_upload: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleSubmit() {
        var formData = new FormData();
        formData.append('file', this.state.file);
        fetch('http://api.classconstructor.com/scrape', {
            method: 'POST',
            body: formData,
        })
          .then(response => {
                return response.json()
            })
          .then(data => {
                this.props.handleDegreeAuditUpload(data)
            });
      }


    handleDegreeAuditUpload = (data) => {
        this.props.handleDegreeAuditUpload(data);
    }

    onClick(event) {
        console.log('file input', this.state.file);
        if(!this.state.file || !(this.state.valid_upload) ) {
            console.log('upload failed: this.state.file: ', this.state.file, "this.state.valid_upload: ", this.state.valid_upload);
            return;
        }
        this.handleSubmit(); 
        this.handleClose();
    }

    setValid(valid, fileIn) {
        this.setState({valid_upload: valid}, () => {
            this.setState({file: fileIn});
        });
    }

    render() {
        return (
            <div>
                <Button
                    variant="success"
                    size="lg"
                onClick={this.handleShow}>
                    Upload Academic History
                </Button>
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Academic History</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p> In order to upload your current degree progress, please follow the steps below</p>
                        <ol>
                            <li>Sign in to your UCSD account <a target="_blank" rel='noreferrer noopener' href="https://act.ucsd.edu/studentDarsSelfservice/audit/list.html">here</a> (link will open in new tab)</li>
                            <li>Click the "Run Audit" button.</li>
                            <li>Click the "Run Declared Programs" button.</li>
                            <li>Under the "View" column, choose the "View Audit" option for the most recently run audit.</li>
                            <li>Save the Displayed Page to your computer as an html file. (Ctrl + S or Right Click > Save Page As...)</li>
                            <li>Upload that saved .html file here.</li>
                        </ol>
                        <FileInput handleValidInput={this.setValid} {...this.props}></FileInput>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant={this.state.valid_upload ? "success": "secondary"} onClick={this.onClick} disabled={!this.state.valid_upload}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

HistoryModal.propTypes = {
    handleDegreeAuditUpload: PropTypes.func.isRequired
}

export default HistoryModal;
