import firebase from 'firebase/app';
import 'firebase/auth'
import api from '../api/Api';
import config from '../api/Config';


class AuthService {
    authenticated = false;
    user = null;

    getCurrentUser = () => {
        return this.user;
    };

    setUser = (user) => {
        this.user = user;
    };

    loginWithEmail = (email, password) => {
        return new Promise((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                firebase.auth().currentUser.getIdToken(true).then(token => {
                        this.getJWTToken(token).then(resp => {
                            this.authenticated = true;
                            api.setToken(resp.jwtToken);
                            this.user = resp.user;
                            resolve(this.user);
                        }).catch(err => {
                            reject(err);
                        });
                    }
                );
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    isAuthenticated = () => {
        return this.authenticated;
    };

    getJWTToken = (idToken) => {
        return api.post(`${config.baseUrl}/auth/login/firebase`, {token: idToken})
    };

    registerUserWithEmail = (email, password, displayName) => {
        return api.post(`${config.baseUrl}/auth/register`, {
            email: email,
            password: password,
            displayName: displayName,
        }).then((resp) => {
            if (!resp.error) {
                firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
                    if (firebase.auth().currentUser.emailVerified !== true) {
                        firebase.auth().currentUser.sendEmailVerification().then(() => {
                            console.log("Email sent.")
                        });
                    }
                })
            }
        })
    };

    logout = () => {
        this.setUser(null);
        this.authenticated = false;
        api.clearToken();
    }
}

const authService = new AuthService();

export default authService;