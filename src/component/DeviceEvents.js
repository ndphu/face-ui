import React from 'react';
import {withStyles} from "@material-ui/core";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Table from "@material-ui/core/Table/Table";

const styles = (theme) => ({

});

class DeviceEvents extends React.Component {
   render = () => {

       const {events} = this.props;

       return (
           <div>
               <Table>
                   <TableHead>
                       <TableRow>
                           <TableCell>Device</TableCell>
                           <TableCell>Type</TableCell>
                           <TableCell>Timestamp</TableCell>
                           <TableCell>Label</TableCell>
                           <TableCell>Error</TableCell>
                       </TableRow>
                   </TableHead>
                   <TableBody>
                       {events && events.map(function (event) {
                           return (
                               <TableRow key={`list-item-event-${event.id}`}>
                                   <TableCell>{event.deviceId}</TableCell>
                                   <TableCell>{event.type}</TableCell>
                                   <TableCell>{event.timestamp}</TableCell>
                                   <TableCell>{event.labels.join(', ')}</TableCell>
                                   <TableCell>{event.error}</TableCell>
                               </TableRow>
                           )
                       })
                       }
                   </TableBody>
               </Table>
           </div>
       )
   }
}

export default withStyles(styles)(DeviceEvents)