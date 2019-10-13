import React from 'react';
import './style.css';
import gary from './yunqgod.jpeg'


const dropDownStyle = {
    position: 'absolute',
    right: '9rem',
    top: '3.5rem'
}

const garyIconStyle = {
    width: '3rem',
    borderRadius: '50%'
}

class Dropdown extends React.Component {
constructor(){
 super();

 this.state = {
       displayMenu: false,
     };

  this.showDropdownMenu = this.showDropdownMenu.bind(this);
  this.hideDropdownMenu = this.hideDropdownMenu.bind(this);

};

showDropdownMenu(event) {
    event.preventDefault();
    this.setState({ displayMenu: true }, () => {
    document.addEventListener('click', this.hideDropdownMenu);
    });
  }

  hideDropdownMenu() {
    this.setState({ displayMenu: false }, () => {
      document.removeEventListener('click', this.hideDropdownMenu);
    });

  }

  render() {
    return (
        <div  className="dropdown" style = {{width:"200px"}} >
         <img src={gary} onClick={this.showDropdownMenu} style={garyIconStyle}/>

          { this.state.displayMenu ? (
          <ul style={dropDownStyle}>
         <li><a href="#Manage Pages">Gary Gillespie</a></li>
         <li><a href="#Create Ads">UCSD</a></li>
         <li><a href="#Manage Ads">Sign Out</a></li>
          </ul>
        ):
        (
          null
        )
        }

       </div>

    );
  }
}

export default Dropdown;
