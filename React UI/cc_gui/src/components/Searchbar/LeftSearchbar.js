import React, { Component } from 'react';
import {Portal} from 'react-portal';
import Searchbar from './Searchbar';

const leftSearchbarStyle = {
    width: '20%',
    position: 'absolute',
    top: '0%',
    left: '0%',
    height: '100%',
    backgroundColor: "yellow",
    zIndex: '2'
}

class LeftSearchbar extends Component {

    render() {
        return (
            <Portal node={document.getElementsByClassName('sidebar-style')[0]}>
                <div style={leftSearchbarStyle}>
                    <Searchbar/>
                </div>
            </Portal>
        );
    }
}

export default LeftSearchbar
