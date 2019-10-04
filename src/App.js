import React from 'react';
import './App.css';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import DeviceList from './component/DeviceList';
import DeviceRecognizeSetup from './component/DeviceRecognizeSetup';
import navigationService from './service/NavigationService';
import DeviceDetails from "./component/DeviceDetails";
import BackendSetup from "./component/BackendSetup";
import LoginPage from './component/login/LoginPage';
import RegisterPage from './component/login/RegisterPage';
import DeskDetails from './component/DeskDetails';
import ErrorPage from "./component/ErrorPage";
import HomePage from "./component/HomePage";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import {withStyles} from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer/Drawer";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import authService from "./service/AuthService";

const styles = (theme) => ({
    title: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    list: {
        width: 256,
    },
    fullList: {
        width: 'auto',
    },
});

class App extends React.Component {
    state = {};

    handleDrawerOpen = () => {
        this.setState({drawerOpen: true})
    };

    handleDrawerClose = () => {
        this.setState({drawerOpen: false})
    };

    render = () => {
        const {classes} = this.props;
        const {drawerOpen} = this.state;

        const fullList = (
            <div
                className={classes.list}
                role="presentation"
            >
                <List>
                    <ListItem button onClick={() => {
                        navigationService.goToHome();
                        this.handleDrawerClose();
                    }}>
                        <ListItemText primary='Home'/>
                    </ListItem>
                    <ListItem button onClick={() => {
                        authService.logout();
                        navigationService.goToLoginPage();
                        this.handleDrawerClose();
                    }}>
                        <ListItemText primary='Logout'/>
                    </ListItem>
                </List>
            </div>
        );


        return (
            <div className="App">
                <CssBaseline/>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            edge="start"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            Smarter Working Desk
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer open={drawerOpen} onClose={this.handleDrawerClose}>
                    {fullList}
                </Drawer>
                <main>
                    <HashRouter>
                        <Route path={'/'} render={(props) => {
                            navigationService.setLocation(props.location);
                            navigationService.setHistory(props.history);
                            return (
                                <Switch>
                                    <Route path={"/home"} component={HomePage}/>
                                    <Route path={"/desk/:deskId"} component={DeskDetails}/>
                                    <Route path={"/devices"} component={DeviceList}/>
                                    <Route exact path={"/device/:deviceId"} component={DeviceDetails}/>
                                    <Route path={"/device/:deviceId/recognizeSetup"} component={DeviceRecognizeSetup}/>
                                    <Route path={"/config"} component={BackendSetup}/>
                                    <Route path={"/login"} component={LoginPage}/>
                                    <Route path={"/register"} component={RegisterPage}/>
                                    <Route path={"/error"} component={ErrorPage}/>
                                    <Redirect exact={true} from={'/'} to={'/home'}/>
                                </Switch>
                            );
                        }}/>
                    </HashRouter>
                </main>
            </div>
        );
    };

}

export default withStyles(styles)(App);
