import React from 'react';
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper";
import api from "../api/Api";

const styles = (theme) => ({
    container: {
        margin: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(3, 2),
        marginTop: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(2),
    },

});

class SlackConfig extends React.Component {
    state = {};
    componentDidMount = () => {
        this.load();
    };

    load = () => {
        api.get("/notification/slackConfig").then(resp => {
            this.setState({slackConfig: resp})
        }).catch(err => {
            this.setState({slackConfig: null})
        });
    };

    setupSlackNotification = () => {
        api.get("/notification/sendSlackInvitation").then(resp => {
            this.load();
        }).catch(err => {

        })
    };

    testSlackNotification = () => {
        this.setState({loading: true}, function () {
            api.get("/notification/testSlackNotification").then(resp => {
                this.setState({loading: false});
            }).catch((error) => {
                this.setState({loading: false});
            })
        });

    };

    snackbarOpen = () => {

    };


    render = () => {
        const {classes} = this.props;
        const {slackConfig, loading} = this.state;
        return (
            <div className={classes.container}>
                {slackConfig &&
                <Paper className={classes.paper}>
                    <Typography variant={'h6'}
                                className={classes.label}
                    >
                        Slack Notification Setup
                    </Typography>

                    {(slackConfig && !slackConfig.slackUserId) && (
                        <div>
                            <Typography variant={'body1'}
                                        className={classes.label}
                            >
                                You are not setup Slack notification yet
                            </Typography>
                            <Button variant={'contained'}
                                    color='primary'
                                    className={classes.button}
                                    onClick={this.setupSlackNotification}
                            >
                                Setup
                            </Button>
                        </div>
                    )}
                    {slackConfig && slackConfig.slackUserId && (
                        <div>
                            <Typography variant={'body1'}
                                        className={classes.label}
                            >
                                This account is linked to Slack's User ID: {slackConfig.slackUserId}
                            </Typography>
                            <Button variant='contained'
                                    color='primary'
                                    disabled={loading}
                                    className={classes.button}
                                    onClick={this.testSlackNotification}>
                                Test Notification
                            </Button>
                        </div>
                    )}

                </Paper>
                }
            </div>
        )
    }
}


export default withStyles(styles)(SlackConfig);