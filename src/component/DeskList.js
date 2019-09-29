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
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3, 2),
    marginTop: theme.spacing(2),
  },
});

class DeskList extends React.Component {
  state = {
    desks: [],
    loading: false,
    openAddDeskDialog: false,
  };

  componentDidMount = () => {
    this.loadDesks();
  };

  loadDesks = () => {
    const _this = this;
    this.setState({loading: true}, function () {
      api.get("/desks").then(resp => {
        _this.setState({desks: resp});
      }).finally(() => {
        _this.setState({loading: false});
      })
    })
  };

  handleAddDesk = () => {
    this.setState({openAddDeskDialog: true});
  };

  handleCloseAddDeskDialog = () => {
    this.setState({openAddDeskDialog: false})
  };

  handleAddDeskClick = () => {
    if (this.state.newDeskName === "") {
      alert("Invalid Desk Name");
      return
    }
    const _this = this;
    this.setState({loading: true}, function () {
      api.post("/desks", {
        name: _this.state.newDeskName
      }).then(resp => {
        _this.setState({openAddDeskDialog: false, newDeskName: ""}, _this.loadDesks);
      }).finally(() => {
        _this.setState({loading: false});
      })
    });

  };

  onTextChange = (event) => {
    this.setState({newDeskName: event.target.value});
  };

  onDeskClick = (d) => {
    navigationService.goToDesk(d.deskId)
  };

  render = () => {
    const {classes} = this.props;
    const {loading, desks, openAddDeskDialog} = this.state;

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
          {!loading && desks &&
          <Paper className={classes.paper}>
            <Typography variant={'h6'}
                        className={classes.label}
            >
              My Desks
            </Typography>
            <List>
              {desks.map(desk =>
                <ListItem key={`desk-list-item-${desk.id}`} button
                          onClick={() => {
                            this.onDeskClick(desk);
                          }}>
                  <ListItemText primary={desk.name} secondary={desk.deskId}/>
                </ListItem>
              )
              }
            </List>
          </Paper>
          }
          <Button color='primary'
                  variant='contained'
                  className={classes.button}
                  onClick={this.handleAddDesk}>
            Add New Desk
          </Button>
          <Dialog open={openAddDeskDialog}
                  fullWidth
                  onClose={this.handleCloseAddDeskDialog}>
            <DialogTitle>Add New Desk</DialogTitle>
            <DialogContent>
              <TextField
                onChange={this.onTextChange}
                autoFocus
                margin="dense"
                label="Desk's Name"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseAddDeskDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleAddDeskClick}
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

export default withStyles(styles)(DeskList);