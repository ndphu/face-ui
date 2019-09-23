import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import navigationService from '../service/NavigationService';

const styles = theme => ({});

class DeviceList extends React.Component {

  state = {
    devices: [
      {
        "id": "window-59a3b558-2207-45a3-8535-b61fc6fe454f",
        "name": "Windows PC",
      },
      {
        "id": "rpi-00000000ece92c87",
        "name": "Raspberry",
      }
    ]
  };

  handleDeviceClick = (d) => {
    navigationService.goToDevice(d.id);
  };

  render = () => {
    const {classes} = this.props;
    return (
      <div>
        <h2>My Devices</h2>
        <List>
          {this.state.devices.map(d =>
            <ListItem button>
              <ListItemText primary={d.name} secondary={d.id} onClick={() => {
                this.handleDeviceClick(d);
              }}/>
            </ListItem>)}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(DeviceList);
