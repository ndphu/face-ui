import React from 'react';
import PropTypes from 'prop-types';
import config from '../api/Config'
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({});

class DeviceDetails extends React.Component {
  state = {}

  componentDidMount = (props) => {
    this.setState({deviceId: this.props.match.params.deviceId})
  };

  render = () => {
    const {classes} = this.props;
    return (
      <div>
        <h2>Device: {this.state.deviceId}</h2>
        <img width={640} height={480} src={`${config.baseUrl}/device/${this.state.deviceId}/capture/live`}/>
      </div>
    );
  }
}


export default withStyles(styles)(DeviceDetails);
