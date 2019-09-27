import React from 'react';
import apiConfig from '../api/Config'
import TextField from "@material-ui/core/TextField/TextField";
import Typography from "@material-ui/core/Typography/Typography";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import AppBar from "@material-ui/core/AppBar/AppBar";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import navigationService from "../service/NavigationService";
import Paper from "@material-ui/core/Paper";

const styles = (theme) => ({
    container: {
        margin: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing(3, 2),
        margin: theme.spacing.unit * 2,
    },
    button: {
        marginTop: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
    },
    title: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit,
    }
});

class BackendSetup extends React.Component {

    state = {};

    componentDidMount = () => {
        this.setState({
            baseUrl: apiConfig.baseUrl,
            wsUrl: apiConfig.wsUrl,
        })
    };

    handleSaveClick = () => {
        apiConfig.updateApiConfig({
            baseUrl: this.state.baseUrl,
            wsUrl: this.state.wsUrl,
        });
        navigationService.goToProjects();
    };

    render = () => {
        const {baseUrl, wsUrl} = this.state;
        const {classes} = this.props;

        const handleChange = name => event => {
            this.setState({...this.state, [name]: event.target.value});
        };

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Configure Backend API URLs
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Paper className={classes.paper}>
                    <form className={classes.container} noValidate autoComplete="off">
                        <Typography variant="body1" className={classes.title}>
                            Backend Base URL
                        </Typography>
                        <TextField variant={"outlined"}
                                   value={baseUrl}
                                   fullWidth
                                   onChange={handleChange('baseUrl')}
                        />

                        <Typography variant="body1" className={classes.title}>
                            Web Socket Base URL
                        </Typography>
                        <TextField variant={"outlined"}
                                   fullWidth
                                   value={wsUrl}
                                   onChange={handleChange('wsUrl')}
                        />
                        <Button className={classes.button}
                                color={'primary'}
                                variant={'contained'}
                                onClick={this.handleSaveClick}
                        >
                            Save
                        </Button>
                    </form>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(BackendSetup);