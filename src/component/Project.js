import React from 'react'
import api from "../api/Api";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import DeviceList from "./DeviceList";
import Button from "@material-ui/core/Button/Button";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import {withStyles} from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import RuleList from "./RuleList";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch/Switch";
import FormGroup from "@material-ui/core/FormGroup/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import notificationService from "../service/NotificationService";

const styles = theme => ({
    title: {
        flexGrow: 1,
    },
    container: {
        margin: theme.spacing.unit * 2,
    },
    divider: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
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

class Project extends React.Component {
    state = {loading: false, project: null, openAddDeviceDialog: false, openAddRuleDialog: false};

    componentDidMount = () => {
        const projectId = this.props.match.params.projectId;
        this.loadProject(projectId);
        this.setState({
            enableNotification: notificationService.getWatchingProjects().indexOf(projectId) >= 0,
        })
    };

    loadProject = (id) => {
        if (!id) {
            id = this.props.match.params.projectId;
        }
        const _this = this;
        this.setState({loading: true}, function () {
            api.get(`/project/${id}`).then(resp => {
                _this.setState({project: resp}, function () {
                    _this.loadDevices();
                    _this.loadRules();
                })
            }).finally(() => {
                _this.setState({loading: false});
            })
        });
        //TODO
    };

    loadDevices = () => {
        api.get(`/project/${this.props.match.params.projectId}/devices`).then(resp => {
            this.setState({devices: resp})
        });
    };

    loadRules = () => {
        api.get(`/project/${this.props.match.params.projectId}/rules`).then(resp => {
            this.setState({rules: resp});
        });
    };

    onTextChange = (event) => {
        this.setState({newDeviceName: event.target.value});
    };

    handleAddDeviceClick = () => {
        this.setState({openAddDeviceDialog: true});
    };

    handleCloseAddDeviceDialog = () => {
        this.setState({openAddDeviceDialog: false})
    };

    handleAddDevice = () => {
        if (!this.state.newDeviceName) {
            alert("invalid device name");
            return
        }
        const _this = this;
        this.setState({loading: true}, function () {
            api.post(`/project/${_this.state.project.projectId}/devices`, {
                name: _this.state.newDeviceName
            }).then(resp => {
                _this.setState({newDeviceName: "", openAddDeviceDialog: false}, _this.loadProject);
            }).catch(() => {
                _this.setState({loading: false, openAddDeviceDialog: false});
            })
        });

    };

    handleCloseAddRuleDialog = () => {
        this.setState({openAddRuleDialog: false})
    };

    handleAddRuleClick = () => {
        this.setState({openAddRuleDialog: true})
    };

    handleAddRule = () => {
        const _this = this;
        api.post(`/project/${this.state.project.projectId}/rules`, {
            deviceId: this.state.selectedDeviceId,
            interval: parseInt(this.state.interval),
            action: {
                type: this.state.notificationType,
            }
        }).then(resp => {
            _this.setState({openAddRuleDialog: false}, _this.loadRules)
        })
    };

    handleNotificationTypeChange = (event) => {
        this.setState({notificationType: event.target.value})
    };

    onIntervalChange = (event) => {
        this.setState({interval: event.target.value});
    };

    handleSelectedDeviceChange = (event) => {
        this.setState({selectedDeviceId: event.target.value})
    };

    toggleNotification = (event) => {
        let checked = event.target.checked;
        const _this = this;
        this.setState({enableNotification:  checked}, function () {
            if (checked) {
                notificationService.startWatchingProject(_this.state.project.projectId)
            } else {
                notificationService.stopWatchingProject(_this.state.project.projectId)
            }
        });
    };

    render = () => {
        const {
            loading, project, openAddDeviceDialog, openAddRuleDialog,
            notificationType, selectedDeviceId, devices, rules,
            enableNotification
        } = this.state;
        const {classes} = this.props;

        return (
            <div>
                {loading && <LinearProgress variant={"indeterminate"}/>}
                {!loading && project &&
                <div>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" className={classes.title}>
                                {project.name}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.container}>
                        <Paper className={classes.paper}>
                            <Typography variant={'h6'}
                                        className={classes.label}
                            >
                                Browser Notification
                            </Typography>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch checked={enableNotification} onChange={this.toggleNotification} />}
                                    label={enableNotification ? "Enabled" : "Disabled"}
                                />
                            </FormGroup>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Typography variant={'h6'}
                                        className={classes.label}
                            >
                                Devices
                            </Typography>
                            <DeviceList devices={devices}/>
                            <Button color='primary'
                                    variant='contained'
                                    className={classes.button}
                                    onClick={this.handleAddDeviceClick}>
                                Add Device
                            </Button>
                        </Paper>
                        <Dialog open={openAddDeviceDialog}
                                fullWidth
                                onClose={this.handleCloseAddProjectDialog}>
                            <DialogTitle>Add New Device</DialogTitle>
                            <DialogContent>
                                <TextField
                                    onChange={this.onTextChange}
                                    autoFocus
                                    margin="dense"
                                    label="Device Name"
                                    fullWidth
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseAddDeviceDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleAddDevice}
                                        color="primary"
                                >
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Paper className={classes.paper}>
                            <Typography variant={'h6'}
                                        className={classes.label}
                            >
                                Notification Rules
                            </Typography>
                            <RuleList rules={rules}/>
                            <Button color='primary'
                                    variant='contained'
                                    className={classes.button}
                                    onClick={this.handleAddRuleClick}>
                                Add Rule
                            </Button>
                        </Paper>
                        <Dialog open={openAddRuleDialog}
                                fullWidth
                                onClose={this.handleCloseAddRuleDialog}>
                            <DialogTitle>Add New Rule</DialogTitle>
                            <DialogContent>
                                <Typography variant={"body1"}>On Device</Typography>
                                <Select
                                    value={selectedDeviceId}
                                    onChange={this.handleSelectedDeviceChange}>
                                    {devices && devices.map(d => {
                                        return <MenuItem key={`menu-item-device-${d.id}`} value={d.deviceId}>{d.name}</MenuItem>
                                    })
                                    }
                                </Select>
                                <div className={classes.divider}/>
                                <Typography variant={"body1"}>Notify me after</Typography>
                                <TextField
                                    onChange={this.onIntervalChange}
                                    autoFocus
                                    type="number"
                                    margin="dense"
                                    label="Minutes"
                                />
                                <div className={classes.divider}/>
                                <Typography variant={"body1"}>Via</Typography>
                                <Select
                                    variant={"filled"}
                                    autoWidth
                                    value={notificationType}
                                    onChange={this.handleNotificationTypeChange}>
                                    <MenuItem value="BROWSER">Browser Notification</MenuItem>
                                    <MenuItem value="MOBILE">Mobile Notification</MenuItem>
                                </Select>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseAddRuleDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleAddRule}
                                        color="primary"
                                >
                                    Add
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
                }
            </div>
        )
    }
}

export default withStyles(styles)(Project);