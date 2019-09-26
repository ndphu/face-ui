import Push from 'push.js';

import apiConfig from '../api/Config';

let storageKey = "monitoringProjects";

class NotificationService {

    showNotification = (title, body, timeout, icon, onClickCallback) => {
        if (timeout) {
            timeout = 5000
        }

        let notificationConfig = {
            body: body,
            timeout: timeout,
            onClick: onClickCallback,
        };
        if (icon) {
            notificationConfig.icon = icon;
        }
        Push.create(title, notificationConfig).then()
    };


    startWatchingProject = (projectId) => {
        let saved = localStorage.getItem(storageKey);
        if (saved) {
            let projects = JSON.parse(saved);
            if (projects.indexOf(projectId) < 0) {
                projects.push(projectId);
                localStorage.setItem(storageKey, JSON.stringify(projects));
            }
        } else {
            let devices = [projectId];
            localStorage.setItem(storageKey, JSON.stringify(devices));
        }
        this.wsSend({
            code: 200,
            type: "WATCH_PROJECT",
            payload: projectId,
        })
    };

    wsSend = (data) => {
      if (this.ws && this.wsReady) {
          this.ws.send(JSON.stringify(data))
      }
    };

    stopWatchingProject = (projectId) => {
        let saved = localStorage.getItem(storageKey);
        if (saved) {
            let projects = JSON.parse(saved);
            projects.splice(projects.indexOf(projectId), 1);
            localStorage.setItem(storageKey, JSON.stringify(projects));
        }
        this.wsSend({
            code: 200,
            type: "UNWATCH_PROJECT",
            payload: projectId,
        })
    };

    getWatchingProjects = () => {
        let saved = localStorage.getItem(storageKey);
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    };

    onSocketOpen = () => {
        if (this.ws) {
            this.wsReady = true;
            let saved = localStorage.getItem(storageKey);
            if (saved) {
                let projects = JSON.parse(saved);
                for (let i = 0; i < projects.length; ++i) {
                    this.wsSend({
                        code: 200,
                        type: "WATCH_PROJECT",
                        payload: projects[i],
                    })
                }
            }
        }
    };

    onSocketMessage = (event) => {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
            case "APP_NOTIFICATION_REMIND": {
                this.showNotification("Remind", msg.payload, 5000, "notification_clock_icon.png", function () {
                    window.focus();
                    this.close();
                });
                break
            }

            case "APP_NOTIFICATION_WATCH_PROJECT_SUCCESS": {
                this.showNotification("Info", msg.payload, 1500, null, function () {
                    window.focus();
                    this.close();
                });
                break
            }
        }
    };
}

const notificationService = new NotificationService();

function initWebSocket() {
    notificationService.ws = new WebSocket(apiConfig.wsUrl);
    notificationService.ws.onopen = notificationService.onSocketOpen;
    notificationService.ws.onmessage = notificationService.onSocketMessage;
    notificationService.ws.onerror = function(e) {
        console.log("Websocket error.", e);
    };
    notificationService.ws.onclose = function (e) {
        console.log("Websocket connect lost. Reconnect in 5 seconds.", e.reason);
        notificationService.wsReady = false;
        setTimeout(function () {
            initWebSocket();
        }, 5000);
    };
}

initWebSocket();

export default notificationService;