import React from 'react';
import './Loading.css';
import loadingImage from './Images/loading.gif';
import jasonbourne from './Images/GreatLeader.jpg'

class Loading extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            hovering: false,
            displayingRegular: true
        }
        this.src = loadingImage;
    };

    componentDidMount = () => {
        document.title = "Loading...";
    }

    componentWillUnmount = () => {
        document.title = "Class Constructor";
    }

    onImageSelect = () => {
        this.setState({
            displayingRegular: !this.state.displayingRegular
        });
    }

    onMouseOver = () => {
        this.setState({
            hovering: true
        })
    }

    onMouseExit = () => {
        this.setState({
            hovering: false
        })
    }

    getImageClassName = () => {
        if (this.state.hovering === true) {
            return "hovering-loading-image";
        }
        return "loading-image";
    }

    getLabelClassName = () => {
        if (this.state.hovering === true) {
            return "hovering-loading-text-wrapper";
        }
        return "loading-text-wrapper";
    }


    render() {
        var imgName = this.getImageClassName();
        var textName = this.getLabelClassName();
        var source = (this.state.displayingRegular ? loadingImage : jasonbourne)
        return (
            <div className="loading-wrapper">
                <div className="loading-image-wrapper"
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseExit}
                onClick={this.onImageSelect}
                >
                    <img className={imgName}
                        src={source}
                        alt="Loading..." />
                </div>
                <div className={textName}
                onMouseOver={this.onMouseOver}
                onMouseLeave={this.onMouseExit}
                onClick={this.onImageSelect}
                >
                    Loading...
                </div>
            </div>
        );
    }
}

export default Loading;
