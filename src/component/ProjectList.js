import React from 'react';
import api from "../api/Api";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import navigationService from "../service/NavigationService";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Typography from "@material-ui/core/Typography/Typography";
import Paper from "@material-ui/core/Paper";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {withStyles} from "@material-ui/core";

const styles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
    container: {
        margin: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing(3, 2),
        marginTop: theme.spacing.unit * 2,
    },
});

class ProjectList extends React.Component {
    state = {
        projects: [],
        loading: false,
        openAddProjectDialog: false,
    };

    componentDidMount = () => {
        this.loadProjects();
    };

    loadProjects = () => {
        const _this = this;
        this.setState({loading: true}, function () {
            api.get("/projects").then(resp => {
                _this.setState({projects: resp});
            }).finally(() => {
                _this.setState({loading: false});
            })
        })
    };

    handleAddProjectClick = () => {
        this.setState({openAddProjectDialog: true});
    };

    handleCloseAddProjectDialog = () => {
        this.setState({openAddProjectDialog: false})
    };

    handleAddProject = () => {
        if (this.state.newProjectName === "") {
            alert("invalid project name")
            return
        }
        const _this = this;
        this.setState({loading: true}, function () {
            api.post("/projects", {
                name: _this.state.newProjectName
            }).then(resp => {
                _this.setState({openAddProjectDialog: false, newProjectName: ""}, _this.loadProjects);
            }).finally(() => {
                _this.setState({loading: false});
            })
        });

    };

    onTextChange = (event) => {
        this.setState({newProjectName: event.target.value});
    };

    isInvalidInput = () => {
        return this.state.newProjectName !== ""
    };

    onProjectClick = (p) => {
        navigationService.goToProject(p.projectId)
    };

    render = () => {
        const {classes} = this.props;
        const {loading, projects, openAddProjectDialog} = this.state;

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Smart Working Desk
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div className={classes.container}>
                    {loading && <LinearProgress variant={"indeterminate"}/>}
                    {!loading && projects &&
                    <Paper className={classes.paper}>
                        <Typography variant={'h6'}
                                    className={classes.label}
                        >
                            My Desks
                        </Typography>
                        <List>
                            {projects.map(p =>
                                <ListItem key={`project-list-item-${p.id}`} button
                                          onClick={() => {
                                              this.onProjectClick(p)
                                          }}>
                                    <ListItemText primary={p.name} secondary={p.projectId}/>
                                </ListItem>
                            )
                            }
                        </List>
                    </Paper>
                    }
                    <Button color='primary'
                            variant='contained'
                            className={classes.button}
                            onClick={this.handleAddProjectClick}>
                        Add New Desk
                    </Button>
                    <Dialog open={openAddProjectDialog}
                            fullWidth
                            onClose={this.handleCloseAddProjectDialog}>
                        <DialogTitle>Add New Project</DialogTitle>
                        <DialogContent>
                            <TextField
                                onChange={this.onTextChange}
                                autoFocus
                                margin="dense"
                                label="Project Name"
                                fullWidth
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleCloseAddProjectDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.handleAddProject}
                                    color="primary"
                            >
                                Add
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(ProjectList);