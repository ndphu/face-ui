import Push from 'push.js';

import apiConfig from '../api/Config';

let storageKey = "monitoringDesks";

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
        Push.create(title, notificationConfig).then().catch(err => {
            console.log("Fail to show notification", err);
            Push.Permission.request(function () {
                console.log("Permission granted");
            }, function () {
                console.log("Permission rejected");
            });
        })
    };


    startWatchingDesk = (deskId) => {
        let saved = localStorage.getItem(storageKey);
        if (saved) {
            let desks = JSON.parse(saved);
            if (desks.indexOf(deskId) < 0) {
                desks.push(deskId);
                localStorage.setItem(storageKey, JSON.stringify(desks));
            }
        } else {
            let devices = [deskId];
            localStorage.setItem(storageKey, JSON.stringify(devices));
        }
        this.wsSend({
            code: 200,
            type: "WATCH_DESK",
            payload: deskId,
        })
    };

    wsSend = (data) => {
      if (this.ws && this.wsReady) {
          this.ws.send(JSON.stringify(data))
      }
    };

    stopWatchingDesk = (deskId) => {
        let saved = localStorage.getItem(storageKey);
        if (saved) {
            let desks = JSON.parse(saved);
            desks.splice(desks.indexOf(deskId), 1);
            localStorage.setItem(storageKey, JSON.stringify(desks));
        }
        this.wsSend({
            code: 200,
            type: "UNWATCH_DESK",
            payload: deskId,
        })
    };

    getWatchingDesks = () => {
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
                let desks = JSON.parse(saved);
                for (let i = 0; i < desks.length; ++i) {
                    this.wsSend({
                        code: 200,
                        type: "WATCH_DESK",
                        payload: desks[i],
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

            case "APP_NOTIFICATION_WATCH_DESK_SUCCESS": {
                this.showNotification("Info", msg.payload, 1500, null, function () {
                    window.focus();
                    this.close();
                });
                break
            }

            default: {
                console.log("Unknown message", msg)
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