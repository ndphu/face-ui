import React from 'react';
import {withStyles} from "@material-ui/core";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import SitReminderRuleIcon from "@material-ui/icons/TransferWithinAStationOutlined";
import WaterReminderRuleIcon from "@material-ui/icons/OpacityOutlined";


const styles = theme => ({
    iconCell: {
        maxWidth: 120
    }
});


class RuleList extends React.Component {
    render = () => {
        const {rules, onRuleClick, classes} = this.props;
        return (
            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.iconCell}/>
                            <TableCell>Type</TableCell>
                            <TableCell>Interval (minutes)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rules && rules.map(rule => {
                            return (
                                <TableRow key={`list-item-rule-${rule.id}`}
                                          hover
                                          onClick={() => {
                                              if (onRuleClick) onRuleClick(rule)
                                          }}>
                                    <TableCell className={classes.iconCell}>{rule.type === 'SITTING_MONITORING' ? <SitReminderRuleIcon/> :
                                        <WaterReminderRuleIcon/>} </TableCell>
                                    <TableCell>{rule.type}</TableCell>
                                    <TableCell>{rule.intervalMinutes}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        )
    }
}


export default withStyles(styles)(RuleList)