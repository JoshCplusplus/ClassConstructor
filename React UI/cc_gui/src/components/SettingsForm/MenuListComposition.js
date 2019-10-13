import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class MenuListComposition extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.initValue
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            value: newProps.initValue
        });
    }

    handleChange = (event, value) => {
        this.setState({ value: value });
        this.props.onChange(event, value);
    }

    render() {
        return (
            <div className="app-bar-wrapper">
                <AppBar>
                  <Tabs
                   value={this.state.value}
                   variant={"scrollable"}
                   onChange={this.handleChange}
                   >
                    {this.props.list.map(function(element, index) {
                        return (
                            <Tab key={index} label={element}/>
                        )
                    })}
                  </Tabs>
                </AppBar>
            </div>

        );
    }
}

MenuListComposition.propTypes = {
    list: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    initValue: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

export default MenuListComposition;
