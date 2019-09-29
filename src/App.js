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
import DeskList from './component/DeskList';


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
                <Route path={"/desks"} component={DeskList}/>
                <Route path={"/desk/:deskId"} component={DeskDetails}/>
                <Route path={"/devices"} component={DeviceList}/>
                <Route exact path={"/device/:deviceId"} component={DeviceDetails}/>
                <Route path={"/device/:deviceId/recognizeSetup"} component={DeviceRecognizeSetup}/>
                <Route path={"/config"} component={BackendSetup}/>
                <Route path={"/login"} component={LoginPage}/>
                <Route path={"/register"} component={RegisterPage}/>
                <Redirect exact={true} from={'/'} to={'/desks'}/>
              </Switch>
            );
          }}/>
        </HashRouter>

      </div>
    );
  };

}

export default App;
