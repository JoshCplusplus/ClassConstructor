import React from 'react';
import Grid from '@material-ui/core/Grid';
import './LinksPage.css'
import LinkItems from './LinkItems';
import warren from "../Images/warren.png"
import erc from "../Images/erc.png"
import marshall from "../Images/marshall.png"
import muir from "../Images/Muir.png"
import revelle from "../Images/revelle.png"
import sixth from "../Images/sixth.png"
import catalog from "../Images/catalog.png"
import cape from "../Images/cape.png"
import vac from "../Images/vac.png"
import webreg from "../Images/webreg.png"
import rmp from "../Images/rmp.png"

class Links extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            img: [warren, marshall, erc, revelle, sixth, muir, catalog, cape, vac, webreg, rmp]
        }
    };

    render() {
        return (
            <div className={"wrapper"}>
                <div className={"Linkwrapper"}>
                    <div className={"linksGrid"}>
                        <Grid container
                              spacing={40}
                              justify={"center"}>
                            {this.state.img.map(function (image, index) {
                                return (
                                    <LinkItems key={index} image={image} index={index}>

                                    </LinkItems>
                                );
                            })}
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}

export  default Links;
