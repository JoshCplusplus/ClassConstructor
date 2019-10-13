import React from "react";
import * as ScheduleConstants from './ScheduleConstants';
import './ScheduleGrid.css';
import Grid from '@material-ui/core/Grid';

class ScheduleGrid extends React.Component {


    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Grid container
            justify='center'
            spacing={ScheduleConstants.QUARTER_SPACING}
            className='grid'>
                {this.state.quarters.map(function(quarter, index) {
                    return (<Grid item
                             key={index}
                             >
                        {quarter}
                    </Grid>)
                })}
                <Grid item>
                    <AddQuarterButton clickListener={this.addButtonClicked}></AddQuarterButton>
                </Grid>
            </Grid>
        );
    }
}


export default ScheduleGrid;
