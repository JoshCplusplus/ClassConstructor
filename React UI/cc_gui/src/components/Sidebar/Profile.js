import React from 'react';
import './Profile.css';
import PropTypes from 'prop-types';

class Profile extends React.Component {


    render() {
        return (
            <div>
                <img src={this.props.profileInformation.imageUrl} className={"profile-image"} alt=""/>
                <span className={"user-name"}>
                    {this.props.profileInformation.firstName} {this.props.profileInformation.lastName}
                </span>
            </div>
        );
    }
}

Profile.propTypes = {
    profileInformation: PropTypes.object.isRequired,
}

export default Profile;
