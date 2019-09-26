import React from 'react';
import config from '../api/Config'
import withStyles from '@material-ui/core/styles/withStyles';
import Button from "@material-ui/core/Button/Button";
import api from "../api/Api";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Typography from "@material-ui/core/Typography/Typography";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";

const styles = theme => ({
    title: {
        flexGrow: 1,
    },
    container: {
        margin: theme.spacing.unit * 2,
    },

    button: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    }
});

class DeviceRecognizeSetup extends React.Component {
    state = {liveStream: false, showingRecognizeResult: false};

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
        const _this = this;
        this.setState({loading: true}, function () {
            api.get(`/device/${_this.state.deviceId}/recognizeFaces?timeout=5`).then(resp => {
                if (resp.recognizedFaces && resp.recognizedFaces.length > 0) {
                    _this.setState({showingRecognizeResult: true, recognizedData: resp}, function () {
                        setTimeout(_this.drawRecognizedResult, 250);
                    })
                } else {
                    _this.setState({showingRecognizeResult: false, recognizedData: resp})
                }
            }).finally(() => {
                _this.setState({loading: false})
            });
        });

    };

    drawRecognizedResult = () => {
        const resp = this.state.recognizedData;
        if (!resp) {
            return
        }
        const canvas = document.getElementById("livestream");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "24px Roboto";
        ctx.lineWidth = "4";
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            if (resp.recognizedFaces && resp.recognizedFaces.length) {
                for (let i = 0; i < resp.recognizedFaces.length; i++) {
                    const face = resp.recognizedFaces[i];
                    const rect = face.rect;
                    ctx.beginPath();

                    if (face.category >= 0) {
                        ctx.strokeStyle = "green";
                        ctx.rect(rect.Min.X, rect.Min.Y, rect.Max.X - rect.Min.X, rect.Max.Y - rect.Min.Y);
                        ctx.stroke();
                        ctx.fillStyle = "green";
                        ctx.fillText(face.label, rect.Min.X + 8, rect.Max.Y - 8);
                    } else {
                        ctx.strokeStyle = "yellow";
                        ctx.rect(rect.Min.X, rect.Min.Y, rect.Max.X - rect.Min.X, rect.Max.Y - rect.Min.Y);
                        ctx.stroke();
                        ctx.fillStyle = "yellow";
                        ctx.fillText("UNKNOWN", rect.Min.X + 8, rect.Max.Y - 8);
                    }
                }
            }
        };
        img.src = "data:image/png;base64," + resp.image
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

    render = () => {
        const {classes} = this.props;
        const {openFacePreview, recognizedData, showingRecognizeResult, loading, device, realTimeLabels} = this.state;
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
                         src={`${config.baseUrl}/device/${this.state.deviceId}/capture/live`}
                         style={{display: 'block'}}/>

                    <Button color={'primary'} variant={'contained'}
                            disabled={loading}
                            className={classes.button}
                            onClick={this.handleRecognizeClick}>Recognize</Button>
                    {
                        realTimeLabels && realTimeLabels.map(l =>
                        <Typography
                            key={`realtime-label-${l}`}
                            variant={'h6'}>{l}</Typography>)
                    }

                    <Dialog open={showingRecognizeResult}
                            onClose={this.handleCloseRecognizeResultDialog}
                            maxWidth={"xl"}
                    >
                        <DialogTitle>Recognize Result</DialogTitle>
                        <DialogContent>
                            <canvas width={640} height={480}
                                    id={'livestream'}
                                    onClick={this.onCanvasClick}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseRecognizeResultDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
                }
            </div>
        );
    }
}

export default withStyles(styles)(DeviceRecognizeSetup);
