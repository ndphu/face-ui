import React from "react";
import Button from "@material-ui/core/Button/Button";
import api from "../api/Api"

class FacePreview extends React.Component {
    state = {
        loading: false,
        deviceId: "window-59a3b558-2207-45a3-8535-b61fc6fe454f",
    };

    componentDidMount = (props) => {
        // this.drawRecognizedResult();

    };

    detect = () => {
        const _this = this;
        this.setState({loading: true}, function () {
            api.get(`/device/${_this.state.deviceId}/detectFaces`).then(resp => {
                _this.setState({detectResult: resp}, _this.drawDetectResult);
            }).finally(() => {
                _this.setState({loading: false})
            })
        });
    };

    recognize = () => {
        const _this = this;
        this.setState({loading: true}, function () {
            api.get(`/device/${_this.state.deviceId}/recognizeFaces`).then(resp => {
                _this.setState({recognizeResult: resp}, _this.drawRecognizedResult);
            }).finally(() => {
                _this.setState({loading: false})
            })
        });
    };

    drawRecognizedResult = () => {
        const resp = this.state.recognizeResult;
        if (!resp) {
            return
        }
        const canvas = document.getElementById("c");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "16px Roboto";
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

    drawDetectResult = () => {
        const resp = this.state.detectResult;
        const canvas = document.getElementById("c");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "24px Roboto";
        ctx.strokeStyle = "green";
        ctx.lineWidth = "4";
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            if (resp.detectedFaces && resp.detectedFaces.length) {
                for (let i = 0; i < resp.detectedFaces.length; i++) {
                    const face = resp.detectedFaces[i];
                    const rect = face.rect;
                    ctx.beginPath();
                    ctx.rect(rect.Min.X, rect.Min.Y, rect.Max.X - rect.Min.X, rect.Max.Y - rect.Min.Y);
                    ctx.stroke();
                    if (face.label) {
                        ctx.fillStyle = "green";
                        ctx.fillText(face.label, rect.Min.X + 8, rect.Max.Y - 8);
                    }
                }
            }
        };
        img.src = "data:image/png;base64," + resp.image
    };

    onCanvasClick = (e) => {
        if (!this.state.detectResult) {
            return;
        }
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const faces = this.state.detectResult.detectedFaces;
        if (faces && faces.length > 0) {
            for (let i = 0; i < faces.length; i++) {
                const rect = faces[i].rect;
                if (rect.Min.X < x && x < rect.Max.X && rect.Min.Y < y && y < rect.Max.Y) {
                    const user = window.prompt("Enter user name");
                    if (user) {
                        faces[i].label = user;
                    }
                    this.drawDetectResult()
                    const _this = this;
                    this.setState({loading: true}, function () {
                        let labels = [];
                        labels.push({
                            "label": faces[i].label,
                            "descriptor": faces[i].descriptor,
                        });
                        api.post(`/labels`, labels).then(resp => {
                            console.log(resp);
                        }).finally(() => {
                            _this.setState({loading: false});
                        })
                    })
                }
            }
        }

    };

    submit = () => {
        if (this.state.detectResult && this.state.detectResult.detectedFaces) {
            const faces = this.state.detectResult.detectedFaces;
            let labels = [];
            for (let i = 0; i < faces.length; i++) {
                const face = faces[i];
                if (face.label) {
                    labels.push({
                        "label": face.label,
                        "descriptor": face.descriptor,
                    })
                }
            }
            if (labels.length > 0) {
                this.setState({loading: true}, function () {
                    api.post("/labels", labels).then(resp => {
                        console.log("submitted");
                    }).finally(() => {
                        this.setState({loading: false});
                    })
                });

            }
        }
    };

    reloadSamples = () => {
        const _this = this;

        this.setState({loading: true}, function () {
            api.get(`/device/${_this.state.deviceId}/reloadSamples`).then(resp => {

            }).finally(() => {
                _this.setState({loading: false})
            })
        });
    };

    render = () => {
        const {recognizeResult} = this.state;
        return (
            <div>
                <canvas id="c" width={640} height={480} onClick={this.onCanvasClick}/>
                <br/>
                <Button onClick={this.detect}
                        disabled={this.state.loading}
                        variant="contained"
                        style={{margin: 8}}
                        color="primary"
                >
                    Detect
                </Button>

                <Button onClick={this.recognize}
                        disabled={this.state.loading}
                        variant="contained"
                        style={{margin: 8}}
                        color="primary"
                >
                    Recognize
                </Button>

                <Button onClick={this.reloadSamples}
                        disabled={this.state.loading}
                        variant="contained"
                        style={{margin: 8}}
                        color="primary"
                >
                    Reload Samples
                </Button>

                <Button onClick={this.submit}
                        disabled={this.state.loading}
                        variant="contained"
                        style={{margin: 8}}
                        color="primary">
                    Save
                </Button>
                <br/>
            </div>
        )
    }

}

export default FacePreview;
