import React from 'react';
// import {Portal} from 'react-portal';
import Searchbar from '../Searchbar/Searchbar';


class RightSearchbar extends React.Component {

    render() {
        return (
            // <Portal node={document.getElementsByClassName('sidebar-style')[0]}>
                // <div style={rightSearchbarStyle}>
                    <Searchbar/>
                // </div>
            // </Portal>
        );
    }
}
export default RightSearchbar
