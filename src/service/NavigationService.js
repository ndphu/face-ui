class NavigationService {
    setLocation = (location) => {
        this.location = location;
    };

    setHistory = (history) => {
        this.history = history;
    };

    goToProjects = () => {
        this.history.push(`/projects`);
    };

    goToProject = (id) => {
        this.history.push(`/project/${id}`);
    };

    goToDevice = (device) => {
        this.history.push(`/device/${device.deviceId}`)
    };

    goToDeviceRecognizeSetup = (device) => {
        this.history.push(`/device/${device.deviceId}/recognizeSetup`)
    };

    goToConfig = () => {
        this.history.push(`/config`);
    }
}

const navigationService = new NavigationService();

export default navigationService;