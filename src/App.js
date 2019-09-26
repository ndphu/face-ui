import React from 'react';
import './App.css';
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import DeviceList from './component/DeviceList';
import DeviceRecognizeSetup from './component/DeviceRecognizeSetup';
import navigationService from './service/NavigationService';
import ProjectList from "./component/ProjectList";
import Project from "./component/Project";
import DeviceDetails from "./component/DeviceDetails";


class App extends React.Component {
    render = () => {
        return (
            <div className="App">
                <HashRouter>
                    <Route path={'/'} render={(props) => {
                        navigationService.setLocation(props.location);
                        navigationService.setHistory(props.history);
                        return (
                            <Switch>
                                <Route path={"/projects"} component={ProjectList}/>
                                <Route path={"/project/:projectId"} component={Project}/>
                                <Route path={"/devices"} component={DeviceList}/>
                                <Route exact path={"/device/:deviceId"} component={DeviceDetails}/>
                                <Route path={"/device/:deviceId/recognizeSetup"} component={DeviceRecognizeSetup}/>
                                <Redirect exact={true} from={'/'} to={'/projects'}/>
                            </Switch>
                        );
                    }}/>
                </HashRouter>

            </div>
        );
    };

}

export default App;
