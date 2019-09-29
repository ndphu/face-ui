import 'whatwg-fetch';
import config from './Config.js';
import navigationService from "../service/NavigationService";

class Api {
  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json',

    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  get = (path) => {
    return fetch(config.baseUrl + path, {
      method: 'GET',
      headers: this.buildHeaders()
    }).then(resp => {
      if (resp.status === 401) {
        navigationService.goToLoginPage();
        return Promise.reject();
      } else if (resp.status === 404) {
        return navigationService.goToConfig();
      } else if (resp.status >= 500) {
        return Promise.reject(resp);
      }
      return resp.json();
    }).catch((resp) => {
      console.log("catch", resp);
      return Promise.reject();
    });
  };

  post = (path, body, raw) => {
    let input = path.startsWith("http") ? path : config.baseUrl + path;
    return new Promise((resolve, reject) => {
      fetch(input, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: raw ? body : JSON.stringify(body),
      }).then(resp => {
        if (resp.status >= 200 && resp.status <= 299) {
          resp.json().then(data => {
            resolve(data);
          })
        } else {
          resp.json().then(data => {
            reject(data);
          });
        }
      }).catch(err => {
        reject(err);
      });
    });
  };


  fetchBlob = (url) => {
    return fetch(url).then(resp => resp.blob())
  };

  setToken = (token) => {
    this.token = token;
    localStorage.setItem("jwt.token", token);
  };

  postForm(path, formData) {
    const input = config.baseUrl + path;
    const headers = {};
    headers['Authorization'] = `Bearer ${this.token}`;
    return new Promise((resolve, reject) => {
      fetch(input, {
        method: 'POST',
        headers: headers,
        body: formData,
      }).then(resp => {
        if (resp.status >= 200 && resp.status <= 299) {
          resp.json().then(data => {
            resolve(data);
          })
        } else {
          resp.json().then(data => {
            reject(data);
          });
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}

const api = new Api();
api.token = localStorage.getItem("jwt.token");

export default api;
