class ApiConfig {
    // baseUrl = 'https://swdcore-01.ddns.net/api';
    // wsUrl = 'wss://swdcore-01.ddns.net/api/ws';

    baseUrl = 'http://localhost:8080/api';
    wsUrl = 'ws://localhost:8080/api/ws';


    // loadLocalConfig = () => {
    //     let storedBaseUrl = localStorage.getItem("baseUrl");
    //     if (storedBaseUrl) {
    //         this.baseUrl = storedBaseUrl;
    //     }
    //     let storedWsUrl = localStorage.getItem("wsUrl");
    //     if (storedWsUrl) {
    //         this.wsUrl = storedWsUrl;
    //     }
    // };
    //
    // updateApiConfig = (config) => {
    //     if (config.baseUrl) {
    //         localStorage.setItem("baseUrl", config.baseUrl);
    //     }
    //     if (config.wsUrl) {
    //         localStorage.setItem("wsUrl", config.wsUrl);
    //     }
    //
    //     this.loadLocalConfig();
    // }
}

const apiConfig = new ApiConfig();
// apiConfig.loadLocalConfig();

export default apiConfig;