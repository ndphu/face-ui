import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import navigationService from '../service/NavigationService';
import api from "../api/Api";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

const styles = theme => ({});

class DeviceList extends React.Component {

    state = {
        devices: []
    };
    handleDeviceClick = (d) => {
        navigationService.goToDevice(d);
    };

    render = () => {
        const {classes, devices} = this.props;
        return (
            <div>
                {devices &&
                <List>
                    {devices.map(d =>
                        <ListItem button key={`device-item-${d.id}`} onClick={() => {
                            this.handleDeviceClick(d);
                        }}>
                            <ListItemText primary={d.name} secondary={d.deviceId} />
                        </ListItem>)}
                </List>
                }
            </div>
        );
    }
}

export default withStyles(styles)(DeviceList);
