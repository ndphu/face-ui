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

class DeskDetails extends React.Component {
    state = {loading: false, desk: null, openAddDeviceDialog: false, openAddRuleDialog: false};

    componentDidMount = () => {
        const deskId = this.props.match.params.deskId;
        this.loadDesk(deskId);
        this.setState({
            enableNotification: notificationService.getWatchingDesks().indexOf(deskId) >= 0,
        })
    };

    loadDesk = (id) => {
        if (!id) {
            id = this.props.match.params.deskId;
        }
        const _this = this;
        this.setState({loading: true}, function () {
            api.get(`/desk/${id}`).then(resp => {
                _this.setState({desk: resp}, function () {
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
        api.get(`/desk/${this.props.match.params.deskId}/devices`).then(resp => {
            this.setState({devices: resp})
        });
    };

    loadRules = () => {
        api.get(`/desk/${this.props.match.params.deskId}/rules`).then(resp => {
            this.setState({rules: resp});
        });
    };

    onTextChange = (event) => {
        this.setState({newDeviceName: event.target.value});
    };
    onDeviceSerialChange = (event) => {
        this.setState({newDeviceSerial: event.target.value});
    };
    handleAddDeviceClick = () => {
        this.setState({openAddDeviceDialog: true});
    };

    handleCloseAddDeviceDialog = () => {
        this.setState({openAddDeviceDialog: false})
    };

    handleAddDevice = () => {

        if (!this.state.newDeviceType) {
            alert("Device type should be define");
            return
        }

        if (this.state.newDeviceType === 'CAMERA' && (!this.state.newDeviceName || this.state.newDeviceName.trim().length === 0)) {
            alert("Device device name should be define");
            return
        }

        if (this.state.newDeviceType === 'WATER_MONITOR' && (!this.state.newDeviceSerial || this.state.newDeviceSerial.trim().length === 0)) {
            alert("Device serial name should be define");
            return
        }

        const _this = this;
        this.setState({loading: true}, function () {
            api.post(`/desk/${_this.state.desk.deskId}/devices`, {
                name: _this.state.newDeviceName ? _this.state.newDeviceName : "Water Monitor Device",
                type: _this.state.newDeviceType,
                deviceId: _this.state.newDeviceSerial,
            }).then(resp => {
                _this.setState({newDeviceName: "", openAddDeviceDialog: false}, _this.loadDesk);
            }).catch(() => {
                _this.setState({loading: false, openAddDeviceDialog: false});
            })
        });

    };

    handleCloseAddRuleDialog = () => {
        this.setState({openAddRuleDialog: false})
    };

    handleNotificationTypeChange = (event) => {
        this.setState({notificationType: event.target.value})
    };

    onIntervalChange = (event) => {
        this.setState({intervalMinutes: event.target.value});
    };

    handleSelectedDeviceChange = (event) => {
        this.setState({selectedDeviceId: event.target.value})
    };

    handleDeviceTypeChange = (event) => {
        this.setState({newDeviceType: event.target.value})
    };

    toggleNotification = (event) => {
        let checked = event.target.checked;
        const _this = this;
        this.setState({enableNotification: checked}, function () {
            if (checked) {
                notificationService.startWatchingDesk(_this.state.desk.deskId)
            } else {
                notificationService.stopWatchingDesk(_this.state.desk.deskId)
            }
        });
    };

    onRuleClick = (rule) => {
        this.setState({openAddRuleDialog: true, ruleMode: 'edit', currentRule: rule,
            intervalMinutes: rule.intervalMinutes})
    };


    handleAddRuleClick = () => {
        this.setState({openAddRuleDialog: true, currentRule: null, ruleMode: 'new', selectedDeviceId: null,
            interval: null, notificationType: null})
    };

    handleAddRule = () => {
        const _this = this;
        api.post(`/desk/${this.state.desk.deskId}/rules`, {
            deviceId: this.state.selectedDeviceId,
            interval: parseInt(this.state.interval),
            action: {
                type: this.state.notificationType,
            }
        }).then(resp => {
            _this.setState({openAddRuleDialog: false}, _this.loadRules)
        })
    };

    handleEditRule = () => {
        const _this = this;
        api.post(`/rule/${this.state.currentRule.id}`, {
            id: this.state.currentRule.id,
            type: this.state.currentRule.type,
            deskId: this.state.currentRule.deskId,
            userId: this.state.currentRule.userId,
            intervalMinutes: parseInt(this.state.intervalMinutes),
        }).then(resp => {
            _this.setState({openAddRuleDialog: false}, _this.loadRules)
        })
    };

    render = () => {
        const {
            loading, desk, openAddDeviceDialog, openAddRuleDialog,
            notificationType, selectedDeviceId, newDeviceType, devices, rules,
            enableNotification, ruleMode, intervalMinutes
        } = this.state;
        const {classes} = this.props;

        return (
            <div>
                {loading && <LinearProgress variant={"indeterminate"}/>}
                {!loading && desk &&
                <div>
                    <div className={classes.container}>
                        <Typography variant={'h4'}
                                    color={'primary'}
                        >
                            {desk.name}
                        </Typography>

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

                        {/*<Paper className={classes.paper}>*/}
                            {/*<Typography variant={'h6'}*/}
                                        {/*className={classes.label}*/}
                            {/*>*/}
                                {/*Notification Settings*/}
                            {/*</Typography>*/}
                            {/*<FormGroup>*/}
                                {/*<FormControlLabel*/}
                                    {/*control={<Switch checked={enableNotification} onChange={this.toggleNotification}/>}*/}
                                    {/*label={enableNotification ? "Enabled" : "Disabled"}*/}
                                {/*/>*/}
                            {/*</FormGroup>*/}
                        {/*</Paper>*/}

                        <Dialog open={openAddDeviceDialog}
                                fullWidth
                                onClose={this.handleCloseAddDeskDialog}>
                            <DialogTitle>Add New Device</DialogTitle>
                            <DialogContent>

                                <Typography variant={"body1"}>Device Type</Typography>
                                <Select
                                    value={newDeviceType}
                                    onChange={this.handleDeviceTypeChange}>
                                    <MenuItem value="CAMERA">Camera</MenuItem>
                                    <MenuItem value="WATER_MONITOR">Water Monitor</MenuItem>
                                </Select>

                                <div className={classes.divider}/>
                                {newDeviceType === 'CAMERA' &&
                                    <div>
                                        <Typography variant={"body1"}>Device Name</Typography>
                                        <TextField
                                            onChange={this.onTextChange}
                                            autoFocus
                                            margin="dense"
                                            fullWidth
                                        />
                                    </div>
                                }
                                {newDeviceType === 'WATER_MONITOR' &&
                                <div>
                                    <Typography variant={"body1"}>Device Serial</Typography>
                                    <TextField
                                        onChange={this.onDeviceSerialChange}
                                        autoFocus
                                        margin="dense"
                                        fullWidth
                                    />
                                </div>
                                }
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
                            <RuleList rules={rules} onRuleClick={this.onRuleClick}/>
                            {/*<Button color='primary'*/}
                                    {/*variant='contained'*/}
                                    {/*className={classes.button}*/}
                                    {/*onClick={this.handleAddRuleClick}>*/}
                                {/*Add Rule*/}
                            {/*</Button>*/}
                        </Paper>
                        <Dialog open={openAddRuleDialog}
                                fullWidth
                                onClose={this.handleCloseAddRuleDialog}>
                            <DialogTitle>{ruleMode === 'edit' ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
                            <DialogContent>
                                <Typography variant={"body1"}>Notify me after</Typography>
                                <TextField
                                    onChange={this.onIntervalChange}
                                    autoFocus
                                    type="number"
                                    margin="dense"
                                    label="Minutes"
                                    value={intervalMinutes}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleCloseAddRuleDialog} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={ruleMode === 'new' ? this.handleAddRule : this.handleEditRule}
                                        color="primary"
                                >
                                    Save
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

export default withStyles(styles)(DeskDetails);