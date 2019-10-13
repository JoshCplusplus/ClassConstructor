import React from "react";
import './ScheduleSummary.css';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words'
import _ from 'underscore'

/*eslint-disable*/


class ScheduleSummary extends React.Component {

    constructor(props) {
        super(props);
        this.description = "";
        this.preReq = "";
        this.quartersOffered = [];
        this.visible = false;
    }

    componentWillReceiveProps = (nextProps) => {
        this.description = "";
        this.prereqs = "";
        this.quartersOffered = [];
        this.visible = false;
        this.complete = [];
        var cElem = nextProps.course;
        var ahElem = nextProps.academicHistory;
        this.incomplete = [];
        if (cElem!== undefined) {

            this.complete = cElem.completePrereqs;
            this.prereqAr = cElem.getPrereqs();
            this.description = cElem.getDescription();
            this.prereqs = cElem.getPrereqString();
            this.quartersOffered = cElem.mapPercentsOffered( function(value, key, self){
                return {
                    quarter: key,
                    percent: Math.round(value.percent_offer * 100)
                }
            }, this);
            this.visible = true;


            this.inProgress = (this.inProgress && this.taken) ? this.inProgress.map((course) => course.id) : [];
            this.taken = (this.inProgress && this.taken) ? this.taken.map((course) => course.id) : [];

            this.complete = this.complete.concat(this.inProgress, this.taken);
            this.complete = _.flatten(this.complete);


            // Check every prerequisite group
            for (let i = 0; i < cElem.courseInformation.prereqs.length; i++) {
                let reqGroup = cElem.courseInformation.prereqs[i];
                let satisfied = false;
                // Iterate through each element in the group
                for (let j = 0; j < reqGroup.length; j++) {
                    let requiredCourse = reqGroup[j];
                    if (this.complete.includes(requiredCourse)) {      // They have the course
                        satisfied = true;
                    }
                }
                // If the group is not satisfied, add them all to incomplete
                if (satisfied === false) {
                    this.incomplete = this.incomplete.concat(reqGroup);
                }
            }
        }

        this.setState({});
    }



    render() {
        if(this.prereqs)
            var splitPrereq = this.prereqs.split(':');
        var prereq = this.prereqs ? splitPrereq[0] + ":" : "";
        var req = this.prereqs ? splitPrereq[1] : "";

        return (
            <div className="base-schedule-summary">
                <div className={"container-fluid", "summary-container"}>
                    <div className={"row"}>
                        <div className={"col", "w-75"}>
                            <div className="description">
                                <span className={"section-header"}>Description: </span>
                                {this.description}<br/>
                                <span className={"section-header"}>{prereq}</span>
                                <Highlighter
                                    highlightClassName={"incomplete-course"}
                                    searchWords={this.incomplete ? this.incomplete : []}
                                    autoEscape={true}
                                    textToHighlight={req}/>
                            </div>
                        </div>

                        <div className="col">
                            <span className={"section-header"}>Quarters offered: </span>
                            <div className="col">
                            <ul className={"listStyle"}>
                                {this.quartersOffered.map(function(quarter, index){
                                    return <li key={index}>{quarter.quarter}:  {quarter.percent}%</li>;
                                })}
                            </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ScheduleSummary.propTypes = {
    course: PropTypes.object,
    academicHistory: PropTypes.object
}


export default ScheduleSummary;
