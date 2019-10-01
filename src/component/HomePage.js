import React from 'react';
import {withStyles} from "@material-ui/core";
import DeskList from "./DeskList";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import SlackConfig from "./SlackConfig";

const styles = (theme) => ({});

class HomePage extends React.Component {

    render = () => {
        const {classes} = this.props;
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Smarter Working Desk
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DeskList/>
                <SlackConfig/>
            </div>
        )
    }
}


export default withStyles(styles)(HomePage);