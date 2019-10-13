import React from 'react';
import Grid from "@material-ui/core/Grid";
import "./LinkItems.css";

const links = {
    textDecoration: 'none'
}
class LinkItems extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hovering: false,
            description: [
              "Warren",
              "Marshall",
              "ERC",
              "Revelle",
              "Sixth",
              "Muir",
              "Course Catalog",
              "Cape",
              "VAC",
              "WebReg",
              "Rate My Professors",
            ],
            links: [
              "https://warren.ucsd.edu/",
              "https://marshall.ucsd.edu/",
              "https://roosevelt.ucsd.edu/",
              "https://revelle.ucsd.edu/",
              "https://sixth.ucsd.edu/",
              "https://muir.ucsd.edu/",
              "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudent.htm",
              "http://www.cape.ucsd.edu/",
              "http://vac.ucsd.edu/",
              "https://act.ucsd.edu/webreg2",
              "https://ratemyprofessors.com",
            ]
        }

    };

    onMouseEnter = (event) => {
        this.setState({
            hovering: true
        });
    }

    onMouseLeave = (event) => {
        this.setState({
            hovering: false
        });
    }

    getBaseName = () => {
        if (this.state.hovering)
            return "image-hover";
        else
            return "image";
    }

    render() {
        return (
            <Grid item>
                <div>
                <a href={this.state.links[this.props.index]} target="_blank" rel='noreferrer noopener' style={links}>
                    <div className={this.getBaseName()}
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}>
                        <img className={"icon"} src={this.props.image} alt=""/>
                        <div className={"text"}>
                            <h2>{this.state.description[this.props.index]}</h2>
                        </div>
                    </div>
                </a>

                </div>

            </Grid>
        );
    }
}

LinkItems.propTypes = {
}

export default LinkItems;
