import React from 'react';
import {withStyles} from "@material-ui/core";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import api from "../api/Api";


const styles = theme => ({});


class RuleList extends React.Component {
    state = {};

    render = () => {
        const {classes, rules} = this.props;
        return (
            <div>
                <List>
                    {rules && rules.map(rule => {
                        return (
                            <ListItem key={`rule-list-item-${rule.id}`} button>
                                <ListItemText primary={`Notify via ${rule.action.type} after ${rule.interval} minutes`} secondary={`On device ${rule.deviceId}`}/>
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        )
    }
}


export default withStyles(styles)(RuleList)