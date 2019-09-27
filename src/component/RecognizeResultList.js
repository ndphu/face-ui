import React from 'react';
import {withStyles} from "@material-ui/core";
import GridList from "@material-ui/core/GridList/GridList";
import GridListTile from "@material-ui/core/GridListTile/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar/GridListTileBar";
import FaceCanvas from "./FaceCanvas";

const styles = (theme) => ({
    gridList: {
        justifyContent: 'center',
    },
    gridListTile: {
        maxWidth: 320,
        maxHeight: 240,
    },
    root: {
        textAlign: 'center',
    }
});

class RecognizeResultList extends React.Component {
    render = () => {
        const {classes, result} = this.props;
        return (
            <div className={classes.root}>
                {result && result.length > 0 &&
                <GridList className={classes.gridList}
                          cellHeight={240}>
                    {result.map((resp, idx) => (
                        <GridListTile key={`grid-list-item-${idx}`} className={classes.gridListTile}>
                            <FaceCanvas faceInfo={resp} w={320} h={240}/>
                            <GridListTileBar
                                title={`${resp.faceDetailsList ? resp.faceDetailsList.length : 0} ${(resp.faceDetailsList && resp.faceDetailsList.length === 1) ? 'face' : 'faces'}`}
                            />
                        </GridListTile>
                    ))}
                </GridList>
                }
            </div>
        )
    }
}


export default withStyles(styles)(RecognizeResultList);