import React from 'react';
import PropTypes from 'prop-types';

class FileInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        valid_upload : props.valid_upload,
        file: null
    };

    this.onChange = this.onChange.bind(this);
    this.validInput = this.validInput.bind(this);
  }


  validInput(valid_upload, file) {
    if(valid_upload) {
      this.props.handleValidInput(valid_upload, file);
    }
  }


  onChange(e) {
      if(!e.target.files.length > 0) {
          console.log('no valid state');
          return;
      }
    this.setState({ file: e.target.files[0]}, () => {
        console.log('file', this.state.file);
        // if html file
        if(this.state.file.name.indexOf('.html') > -1) {
            // set button active
            this.setState({ valid_upload: true}, () => this.validInput(this.state.valid_upload, this.state.file));
            console.log('set valid_upload to true');
        }
        else {
            this.setState({ valid_upload: false}, () => this.validInput(this.state.valid_upload, this.state.file));
            console.log('set valid_upload to false');
        }
    });
  }



  render() {
    return (
      <form onSubmit={this.handleConfirmClick}>
          <input type="file" ref={this.fileInput} onChange={this.onChange} />
        <br />
      </form>
    );
  }
}

FileInput.propTypes = {
    handleDegreeAuditUpload: PropTypes.func.isRequired,

}

export default FileInput;
