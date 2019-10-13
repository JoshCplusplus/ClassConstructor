
// Basic React and styling imports
import React, { Component } from 'react';
import './CourseListing.css';

// Children component imports
import CourseListingEntry from './CourseListingEntry';
import SearchbarInfo from './SearchbarInfo';

// Allows for continous scroll without loading all element
import {WindowScroller, AutoSizer, List} from 'react-virtualized';

class CourseListing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1,                              // The currently selected index
            searchbarInfo: SearchbarInfo.getInstance(),     // A reference to the searchbarInfo
        }
        this.scrollPosition = 0;                            // Tracks the scrollPosition
    }

    // Triggers on selection of a sub-element, given the id in the array loaded
    onSelection = (id) => {
        this.setState({
            selectedIndex: id
        })
        this.state.searchbarInfo.setSelectedCourse(id, true);
    }

    // Triggers on double click of an element
    onDoubleClick = (id) => {
        this.state.searchbarInfo.doubleClick(id);
    }

    // Handles a click event of this object, including children
    handleClick= (event) => {
        // Guarantees we are not selecting a class
        if (event.target.getAttribute("name") !== "entry") {
            this.handleClickOutside();
        }
    }

    // Triggered when something other than a class is selected
    handleClickOutside = () => {
        this.setState({
            selectedIndex: -1
        });
        this.state.searchbarInfo.setSelectedCourse(-1, true);
    }


    // Helper function to render a row
    renderRow = ({index, isScrolling, key, style}) => {
        var selected = (this.state.selectedIndex === index);
        var course = this.state.searchbarInfo.getCourse(index);
        return (
            <div name="entry" key={key} style={style}>
                <CourseListingEntry
                onSelection={this.onSelection}
                selected={selected}
                id={index}
                isScrolling = {isScrolling}
                name={course.id}
                units={course.units[0]}
                onDoubleClick={this.onDoubleClick}
                />
            </div>
        );


    }

    // Helper function to render when there are no rows to render
    noRowsRenderer = () => {
       return <div>No courses match your current search.</div>;
    }

    // Callback function after rows are rendered
    onRowsRendered = ({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) => {
        this.scrollPosition = stopIndex;
    }

    // Render function
    render() {
        return (
            <div key={this.state.selectedIndex} style={{width: "100%", height: "100%", overflow: "hidden"}} onClick={this.handleClick}>
                <WindowScroller>
                      {({height, isScrolling, onChildScroll, scrollTop}) => (
                          <AutoSizer>
                              {({ height, width }) => (
                                  <List
                                      height={height}
                                      width={width}
                                      scrollTop={scrollTop}
                                      onChildScroll={onChildScroll}
                                      rowHeight={44}
                                      isScrolling ={isScrolling}
                                      onRowsRendered={this.onRowsRendered}
                                      ref="List"
                                      scrollToIndex={this.scrollPosition}
                                      noRowsRenderer={this.noRowsRenderer}
                                      rowCount={this.state.searchbarInfo.getNumCourses()}
                                      rowRenderer={this.renderRow}
                                      overscanRowCount={20}
                                    />
                              )}
                          </AutoSizer>
                      )}
                </WindowScroller>
            </div>
        );
    }
}


CourseListing.propTypes = {

}

export default CourseListing
