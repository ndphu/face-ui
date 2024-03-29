import React from 'react';
import {withStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import api from "../api/Api";
import Button from "@material-ui/core/Button/Button";
import navigationService from "../service/NavigationService";
import DeviceEvents from "./DeviceEvents";

const styles = (theme) => ({
    container: {
        margin: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing(3, 2),
        marginTop: theme.spacing.unit * 2,
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
    }
});

class DeviceDetails extends React.Component {
    state = {};

    componentDidMount = () => {
        this.loadDevice();
    };

    loadDevice = () => {
        const _this = this;
        api.get(`/device/${this.props.match.params.deviceId}`).then(resp => {
            this.setState({device: resp})
        }).catch(err => {
            console.log("Error", err);
        });

        this.eventUpdateInterval = setInterval(function () {
            api.get(`/device/${_this.props.match.params.deviceId}/events`).then(resp => {
                _this.setState({events: resp})
            });
        }, 500);

    };

    componentWillUnmount = () => {
        if (this.eventUpdateInterval) {
            clearInterval(this.eventUpdateInterval);
        }
    }

    handleRemoveDeviceClick = () => {
        if (window.confirm(`Delete device ${this.state.device.name}?`)) {
            api.delete(`/device/${this.props.match.params.deviceId}`).then(resp => {
                navigationService.goToDesk(this.state.device.deskId);
            });
        }
    };

    render = () => {
        const {classes} = this.props;
        const {device, events} = this.state;

        return (
            <div>
                <div className={classes.container}>
                    {device &&
                    <div>
                        <Paper className={classes.paper}>
                            <Typography variant={'h5'}>Device ID: {device.deviceId}</Typography>
                            {device.type === 'CAMERA' &&
                            <Button variant={'contained'}
                                    color={'primary'}
                                    className={classes.button}
                                    onClick={() => {
                                        navigationService.goToDeviceRecognizeSetup(device)
                                    }}
                            >
                                Setup Face Recognition
                            </Button>
                            }
                            <Button variant={'outlined'}
                                    color={'secondary'}
                                    className={classes.button}
                                    onClick={this.handleRemoveDeviceClick}
                            >
                                Remove Device
                            </Button>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Typography variant={'h6'}>Events</Typography>
                            <DeviceEvents events={events} device={device}/>
                        </Paper>
                    </div>
                    }
                </div>

            </div>
        )
    }
}

export default withStyles(styles)(DeviceDetails)