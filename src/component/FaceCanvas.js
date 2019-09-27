import React from 'react';
import {withStyles} from "@material-ui/core";

const styles = (theme) => ({});

class FaceCanvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount = () => {
        const canvas = this.canvasRef.current;
        const faceInfo =  this.props.faceInfo;
        const ctx = canvas.getContext("2d");
        let scale = 0.5;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "24px Roboto";
        ctx.lineWidth = "2";
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
            let faceDetailsList = faceInfo.faceDetailsList;
            if (faceDetailsList && faceDetailsList.length) {
                for (let i = 0; i < faceDetailsList.length; i++) {
                    const face = faceDetailsList[i];
                    const rect = face.rect;
                    ctx.beginPath();
                    ctx.strokeStyle = "yellow";
                    ctx.rect(rect.Min.X  * scale, rect.Min.Y * scale, (rect.Max.X - rect.Min.X)  * scale, (rect.Max.Y - rect.Min.Y)  * scale);
                    ctx.stroke();
                }
            }
        };
        img.src = "data:image/png;base64," + faceInfo.image
    };
    //
    // drawRecognizedResult = () => {
    //     const canvas = document.getElementById("livestream");
    //     const ctx = canvas.getContext("2d");
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     ctx.font = "24px Roboto";
    //     ctx.lineWidth = "4";
    //     const img = new Image();
    //     img.onload = () => {
    //         ctx.drawImage(img, 0, 0);
    //         if (resp.recognizedFaces && resp.recognizedFaces.length) {
    //             for (let i = 0; i < resp.recognizedFaces.length; i++) {
    //                 const face = resp.recognizedFaces[i];
    //                 const rect = face.rect;
    //                 ctx.beginPath();
    //
    //                 if (face.category >= 0) {
    //                     ctx.strokeStyle = "green";
    //                     ctx.rect(rect.Min.X, rect.Min.Y, rect.Max.X - rect.Min.X, rect.Max.Y - rect.Min.Y);
    //                     ctx.stroke();
    //                     ctx.fillStyle = "green";
    //                     ctx.fillText(face.label, rect.Min.X + 8, rect.Max.Y - 8);
    //                 } else {
    //                     ctx.strokeStyle = "yellow";
    //                     ctx.rect(rect.Min.X, rect.Min.Y, rect.Max.X - rect.Min.X, rect.Max.Y - rect.Min.Y);
    //                     ctx.stroke();
    //                     ctx.fillStyle = "yellow";
    //                     ctx.fillText("UNKNOWN", rect.Min.X + 8, rect.Max.Y - 8);
    //                 }
    //             }
    //         }
    //     };
    //     img.src = "data:image/png;base64," + resp.image
    // };

    render = () => {
        const {classes, faceInfo} = this.props;
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.props.w} height={this.props.h}/>
            </div>
        )
    }
}


export default withStyles(styles)(FaceCanvas);