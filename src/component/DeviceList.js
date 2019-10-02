import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import navigationService from '../service/NavigationService';
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";

const styles = theme => ({});

class DeviceList extends React.Component {

    state = {
        devices: []
    };
    handleDeviceClick = (d) => {
        navigationService.goToDevice(d);
    };

    render = () => {
        const {devices} = this.props;
        return (
            <div>
                {devices &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device Name</TableCell>
                            <TableCell>Device Type</TableCell>
                            <TableCell>Device Id</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {devices.map(d => {
                            return (
                                <TableRow key={`list-item-rule-${d.id}`} onClick={() => {navigationService.goToDevice(d)}}>
                                    <TableCell>{d.name}</TableCell>
                                    <TableCell>{d.type}</TableCell>
                                    <TableCell>{d.deviceId}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                }
            </div>
        );
    }
}

export default withStyles(styles)(DeviceList);
