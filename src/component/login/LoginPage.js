import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField/TextField';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid/Grid';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/Typography/Typography';
import {isValidEmail} from '../../utils/StringUtils';
import Paper from '@material-ui/core/Paper';
import navigationService from '../../service/NavigationService';
import authService from '../../service/AuthService';

const styles = theme => ({
    registerForm: {
        padding: theme.spacing.unit * 2,
        justifyContent: 'center',
    },
    formContainer: {
        padding: theme.spacing.unit * 2,
    },
    progressBar: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    buttonContainer: {
        marginTop: theme.spacing.unit,
    },
    button: {
        marginTop: theme.spacing.unit,
    }

});

class LoginPage extends React.Component {
    state = {};

    login = () => {
        const {email, password} = this.state;
        this.setState({loading: true, loginError: null,}, function () {
            authService.loginWithEmail(email, password).then(() => {
                this.setState({loading: false}, function () {
                    navigationService.goToDesks();
                });
            }).catch((err) => {
                console.log('login fail', err);
                this.setState({loginError: err, loading: false});
            });
        });
    };

    register = () => {
        navigationService.goToRegister();
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    invalidInput = () => {
        return !(isValidEmail(this.state.email) && this.state.password && this.state.password.length > 0);
    };

    render = () => {
        const {classes} = this.props;
        const {loading, loginError} = this.state;
        const loginForm = (
            <Paper className={classes.formContainer}>
                <Typography variant={'h4'} gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Email"
                    value={this.state.email}
                    onChange={this.handleChange('email')}
                    margin="dense"
                    variant="outlined"
                    autoFocus
                    required
                    fullWidth
                />
                <TextField
                    label="Password"
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    margin="dense"
                    variant="outlined"
                    type="password"
                    autoComplete={false}
                    fullWidth
                />
                <div className={classes.buttonContainer}>
                    <Button variant={'contained'}
                            color={'primary'}
                            onClick={this.login}
                            className={classes.button}
                            fullWidth
                            disabled={this.invalidInput() || loading}>
                        Login
                    </Button>
                    <Button variant={'outlined'}
                            color={'primary'}
                            fullWidth
                            className={classes.button}
                            onClick={this.register}>
                        Register
                    </Button>
                </div>
                {loading &&
                <LinearProgress variant={'indeterminate'}
                                className={classes.progressBar}/>
                }
                {loginError &&
                <Typography color={"secondary"}
                            className={classes.progressBar}
                >
                    {loginError.message}
                    {loginError.error}
                </Typography>
                }
            </Paper>
        );
        return (
            <div>
                <Grid container className={classes.registerForm}>
                    {loginForm}
                </Grid>
            </div>
        );
    }
}

LoginPage.propTypes = {};

export default withStyles(styles)(LoginPage);
