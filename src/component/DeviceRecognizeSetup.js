import React from 'react';
import config from '../api/Config'
import withStyles from '@material-ui/core/styles/withStyles';
import api from "../api/Api";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import RecognizeResultList from "./RecognizeResultList";

const styles = theme => ({
    title: {
        flexGrow: 1,
    },
    container: {
        margin: theme.spacing.unit * 2,
        textAlign: 'center',
    },
    button: {
        margin: theme.spacing.unit,

    },
    recognizeContainer: {
        marginTop: theme.spacing.unit * 2,
    }
});

class DeviceRecognizeSetup extends React.Component {
    state = {liveStream: false, showingRecognizeResult: false, mode: 'normal'};
    numberOfFrame = 20;
    delay = 500;

    componentDidMount = () => {
        this.setState({deviceId: this.props.match.params.deviceId});
        this.loadDevice();
    };

    componentWillUnmount = () => {
        if (this.ws) {
            this.ws.close()
        }
    };

    loadDevice = () => {
        api.get(`/device/${this.props.match.params.deviceId}`).then(resp => {
            this.setState({device: resp})
        })
    };

    handleRecognizeClick = () => {
        this.setState({
            mode: 'capturing',
            recognizedResult: null,
        }, this.startRecognizing)
    };

    startRecognizing = () => {
        api.get(`/device/${this.state.device.deviceId}/startRecognize?frameDelay=${this.delay}&totalPics=${this.numberOfFrame}`)
            .then(resp => {
                this.setState({recognizedResult: resp, mode: 'normal'})
            }).catch(() => {
            this.setState({recognizedResult: null, mode: 'normal'})
        })
    };


    handleCloseRecognizeResultDialog = () => {
        this.setState({showingRecognizeResult: false})
    };

    onCanvasClick = (e) => {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const faces = this.state.recognizedData.recognizedFaces;

        if (faces && faces.length > 0) {
            for (let i = 0; i < faces.length; i++) {
                const rect = faces[i].rect;
                if (rect.Min.X < x && x < rect.Max.X && rect.Min.Y < y && y < rect.Max.Y && faces[i].label === 'UNKNOWN') {
                    const user = window.prompt("Enter user name");

                    if (user) {
                        faces[i].label = user;
                    }
                    this.drawRecognizedResult();
                    const _this = this;
                    this.setState({loading: true}, function () {
                        let labels = [];
                        labels.push({
                            "label": faces[i].label,
                            "descriptor": faces[i].descriptor,
                            "deviceId": _this.state.device.deviceId,
                            "projectId": _this.state.device.projectId,
                        });
                        api.post(`/labels`, labels).then(resp => {
                            _this.setState({showingRecognizeResult: false});
                        }).finally(() => {
                            _this.setState({loading: false});
                        })
                    })
                }
            }
        }
    };

    handleSubmitFaceData = () => {
        const _this = this;
        const {recognizedResult, device} = this.state;
        if (!device || !recognizedResult || recognizedResult.length === 0) {

        } else {
            const data = [];
            recognizedResult.forEach((e) => {
                if (!e.faceDetailsList || e.faceDetailsList.length !== 1) {
                    return
                }
                const fd = e.faceDetailsList[0];
                data.push({
                    "label": device.projectId,
                    "descriptor": fd.descriptor,
                    "deviceId": device.deviceId,
                    "projectId": device.projectId,
                });
            });
            api.post(`/labels`, data).then(resp => {
                _this.setState({recognizedResult: null});
            })
        }
    };

    handleCancelClick = () => {
        this.setState({recognizedResult: null})
    };

    render = () => {
        const {classes} = this.props;
        const {device, mode, recognizedResult} = this.state;
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            {device ? `Device: ${device.name}` : ''}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {device &&
                <div className={classes.container}>
                    <img width={640} height={480}
                         src={`${config.baseUrl}/device/${this.state.deviceId}/capture/live`}/>
                    {!recognizedResult &&
                    <div>
                        {mode === 'normal' &&
                        <Typography variant={'h6'}>
                            Make sure you there is only you in front of the camera then press the button bellow
                        </Typography>
                        }
                        {mode === 'capturing' &&
                        <Typography variant={'h6'}>
                            Move your face slowly to allow the camera to capture as many aspect of your face as possible
                        </Typography>
                        }
                        <Button variant={'contained'}
                                color={'primary'}
                                onClick={this.handleRecognizeClick}
                                disabled={mode === 'capturing'}
                        >
                            {mode === 'normal' ? "Start Recognize" : "Recognizing"}
                        </Button>
                    </div>
                    }
                    {recognizedResult &&
                    <div className={classes.recognizeContainer}>
                        <Typography variant={'h6'}>
                            Please review the detection result below and press OK to save the your face data.
                        </Typography>
                        <RecognizeResultList result={recognizedResult}/>
                        <Button variant={'contained'}
                                color={'primary'}
                                onClick={this.handleSubmitFaceData}
                                className={classes.button}
                        >
                            OK
                        </Button>
                        <Button variant={'contained'}
                                className={classes.button}
                                onClick={this.handleCancelClick}
                        >
                            Cancel
                        </Button>
                    </div>
                    }
                </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(DeviceRecognizeSetup);
