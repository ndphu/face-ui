import React from 'react';
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import navigationService from "../service/NavigationService";

const styles = (theme) => ({
    container: {
        margin: theme.spacing.unit * 2,
        padding: theme.spacing.unit * 2,
    },
    gridList: {
        justifyContent: 'center',
    },
    gridListTile: {
        // margin: theme.spacing.unit * 2,
        width: 500,
    },

    paper: {
        padding: theme.spacing.unit * 2,
    },

    errorContainer: {
        textAlign: 'left',
        marginTop: theme.spacing.unit * 2,
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
    }
});

class ErrorPage extends React.Component {
    state = {};
    componentDidMount = () => {
        const e = localStorage.getItem("lastError")
        if (e) {
            try {
                this.setState({error: JSON.parse(e)})
            } catch (e) {
                // ignore
            }
        }
    };

    render = () => {
        const {classes} = this.props;
        const {error} = this.state;
        return (
            <Paper className={classes.container}>

                <GridList className={classes.gridList} cellHeight={250}>
                    <GridListTile className={classes.gridListTile}>
                        <Typography variant={'h4'}>Something Went Wrong</Typography>
                        <Typography variant={'body1'}>Please contact developer to resolve the issue.</Typography>
                        {error && (
                            <div className={classes.errorContainer}>
                                <Typography variant={'h5'}>Error Details</Typography>
                                <Typography variant={'body2'}>Type: {error.message}</Typography>
                                <Typography variant={'body2'}>URL: {error.url}</Typography>
                            </div>
                        )}
                        <Button variant={'contained'}
                                className={classes.button}
                                color={'primary'}
                                onClick={() => {
                                    navigationService.goToDesks();
                                    window.location.reload();
                                }}>
                            Reload
                        </Button>
                        <Button className={classes.button}
                                variant='outlined'
                                onClick={() => {
                                    navigationService.goToConfig();
                                }}>
                            Configure Backend
                        </Button>
                    </GridListTile>
                </GridList>
            </Paper>
        )
    }
}


export default withStyles(styles)(ErrorPage);