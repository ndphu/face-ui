class NavigationService {
  setLocation = (location) => {
    this.location = location;
  };

  setHistory = (history) => {
    this.history = history;
  };

  goToDesks = () => {
    this.history.replace(`/desks`);
  };

  goToDesk = (id) => {
    this.history.push(`/desk/${id}`);
  };

  goToDevice = (device) => {
    this.history.push(`/device/${device.deviceId}`)
  };

  goToDeviceRecognizeSetup = (device) => {
    this.history.push(`/device/${device.deviceId}/recognizeSetup`)
  };

  goToConfig = () => {
    this.history.push(`/config`);
  };

  goToLoginPage = () => {
    this.history.push(`/login`);
  };

  goToRegister = () => {
    this.history.push(`/register`);
  };
}

const navigationService = new NavigationService();

export default navigationService;