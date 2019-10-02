import React from 'react';
import {withStyles} from "@material-ui/core";
import DeskList from "./DeskList";
import SlackConfig from "./SlackConfig";

const styles = (theme) => ({});

class HomePage extends React.Component {

    render = () => {
        const {classes} = this.props;
        return (
            <div>
                <DeskList/>
                <SlackConfig/>
            </div>
        )
    }
}


export default withStyles(styles)(HomePage);