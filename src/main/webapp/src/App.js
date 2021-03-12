import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Movies from "./components/movies";
import Movie from "./components/movie";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  footer: {
    textAlign: "center",
    marginTop: "100px"
  }
}));

function App() {
  const classes = useStyles();

  const handleHome = event => {
    window.location.href = "/";
  };
  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="home"
            onClick={handleHome}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            2020 TOP40 Movies
          </Typography>
        </Toolbar>
      </AppBar>
      <Router>
        <Switch>
          <Route exact path="/">
            <Movies />
          </Route>
          <Route path="/movies/:name" exact component={Movie} />
        </Switch>
      </Router>
      <div className={classes.footer}>
        <Divider />
        <Typography variant="subtitle1" color="caption">
          Contact
        </Typography>
        <Typography variant="subtitle2" color="textPrimary">
          Luyao Wang luyaoww@uw.edu
        </Typography>
        <Typography variant="subtitle2" color="textPrimary">
          Liwen Fan liwenfan@uw.edu
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          © 2021 2021 TOP40 Movies. All rights reserved
        </Typography>
      </div>
    </React.Fragment>
  );
}

export default App;
