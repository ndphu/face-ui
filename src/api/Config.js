class ApiConfig {

    loadLocalConfig = () => {
        this.baseUrl = 'http://192.168.26.37:8080/api';
        this.wsUrl = 'ws://192.168.26.37:8080/api/ws';

        let storedBaseUrl = localStorage.getItem("baseUrl");
        if (storedBaseUrl) {
            this.baseUrl = storedBaseUrl;
        }

        let storedWsUrl = localStorage.getItem("wsUrl");
        if (storedWsUrl) {
            this.wsUrl = storedWsUrl;
        }
    };

    updateApiConfig = (config) => {
        if (config.baseUrl) {
            localStorage.setItem("baseUrl", config.baseUrl);
        }
        if (config.wsUrl) {
            localStorage.setItem("wsUrl", config.wsUrl);
        }

        this.loadLocalConfig();
    }

}

const apiConfig = new ApiConfig();
apiConfig.loadLocalConfig();

export default apiConfig;