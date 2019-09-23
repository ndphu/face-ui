import React from 'react';
import './App.css';
import FacePreview from "./component/FacePreview";
import {HashRouter, Redirect, Route, Switch} from 'react-router-dom';
import DeviceList from './component/DeviceList';
import DeviceDetails from './component/DeviceDetails';
import navigationService from './service/NavigationService';


function App() {
  return (
    <div className="App">
      {/*<img src={'http://localhost:8080/api/device/rpi-00000000ece92c87/capture/live'}/>*/}
      <HashRouter>
        <Route path={'/'} render={(props) => {
          navigationService.setLocation(props.location);
          navigationService.setHistory(props.history);
          return (
            <Switch>
              <Route path={"/devices"} component={DeviceList}/>
              <Route path={"/device/:deviceId"} component={DeviceDetails}/>
              <Redirect exact={true} from={'/'} to={'/devices'}/>
            </Switch>
          );
        }}/>
      </HashRouter>
    </div>
  );
}

export default App;
