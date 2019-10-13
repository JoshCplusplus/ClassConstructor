import React, { Component } from 'react';
import './Searchbar.css';
import PropTypes from 'prop-types';

class SearchbarInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchValue: this.props.initSearchValue
        }
    }


    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            this.props.handleSearch(this.state.searchValue);
            event.preventDefault();
        }
    }

    handleInputChange = (event) => {
        this.setState({
            searchValue: event.target.value
        })
        this.props.setSearchValue(event.target.value);
        this.props.handleSearch(event.target.value);
    }

    handleSelectForm = (event) => {
        event.target.select();
    }

    handleFormBlur = (event) => {

    }

    render() {
        return (
            <input
              value={this.state.searchValue}
              className="searchbar-input"
              placeholder="Search for..."
              onKeyDown={this.handleKeyDown}
              onChange={this.handleInputChange}
              onClick={this.handleSelectForm}
              onBlur={this.handleFormBlur}
            />
        );
    }
}

SearchbarInput.propTypes = {
    handleSearch: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    initSearchValue: PropTypes.string.isRequired
}

export default SearchbarInput
