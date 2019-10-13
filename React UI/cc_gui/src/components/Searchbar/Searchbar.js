import React, { Component } from 'react';
import CourseListing from './CourseListing';
import CheckboxComponent from './CheckboxComponent';
import './Searchbar.css';
import SearchbarInfo from './SearchbarInfo';
import SearchbarInput from './SearchbarInput';


class Searchbar extends Component {
    constructor(props) {
        super(props);

        this.searchValue = SearchbarInfo.getInstance().getStoredSearchValue();
        this.state = {
            update: true,
            searchbarInfo: SearchbarInfo.getInstance()
        }
    }

    componentWillUnmount = () => {
        this.state.searchbarInfo.storeSearchValue(this.searchValue);
    }

    setSearchValue = (searchValue) => {
        this.searchValue = searchValue;
    }

    handleSearch = (searchValue) => {
        this.state.searchbarInfo.updateCourses(searchValue);
        this.setState({});
    }

    handleToggle = (id) => {
        this.state.searchbarInfo.toggleIndex(id);
        this.state.searchbarInfo.updateCourses(this.searchValue);
        this.setState({});
    }

    render() {
        return (
            <div className="searchbar-wrapper">
                <SearchbarInput initSearchValue={this.searchValue} setSearchValue={this.setSearchValue} handleSearch={this.handleSearch}/>
                <div className="filters">
                    {

                        this.state.searchbarInfo.mapToggles(function(name, index, self) {
                            return (<CheckboxComponent initToggle={self.state.searchbarInfo.getToggle(index)} id={index} key={index} handleToggle={self.handleToggle} name={name}/>)
                        }, this)
                    }
                </div>
                <div className="course-listing">
                    <CourseListing/>
                </div>
            </div>
        );
    }
}


export default Searchbar
