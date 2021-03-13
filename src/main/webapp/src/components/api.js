import React from "react";
import axios from "axios";
import { withRouter, Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";
import Paper from "@material-ui/core/Paper";
import grey from "@material-ui/core/colors/grey";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";

import apiConfig from "./apiConfig";

const backgroundColor = grey[300];

const styles = theme => ({
  root: {},
  text: { padding: "20px" },
  text2: {
    color: "#283593",
    marginBottom: "30px"
  },
  text3: {
    color: "#7986cb"
  },
  text4: {
    color: "#283593"
  }
});

class Api extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { classes } = this.props;
    const text1 = "GET /api/movies/genres/{genre}";
    const text2 = "GET /api/movies/{movie_name}";
    const text3 = "POST /api/movies/reviews";
    const text11 =
      "[GET] http://ec2-52-42-101-9.us-west-2.compute.amazonaws.com:8080/api/movies/genres/romance";
    const text12 =
      "[GET] http://ec2-52-42-101-9.us-west-2.compute.amazonaws.com:8080/api/movies/Honest Thief";
    const text13 =
      "[POST] http://ec2-52-42-101-9.us-west-2.compute.amazonaws.com:8080/api/movies/reviews";
    const text21 = "{movies: list_of_movie_objs, genres: list_of_geres}";
    const text22 =
      "{title: characters, overview:characters, releaseDate:characters, originalLanguage: characters, genres: list, posterPath: characters, videoPath:characters, reviews:list}";
    return (
      <React.Fragment>
        <Container fixed className={classes.root}>
          <Paper elevation={3}>
            <div className={classes.text}>
              <Typography variant="h3" component="h3" className={classes.text2}>
                API
              </Typography>
              <Divider />
              <Typography variant="caption" className={classes.text3}>
                Get movies by genre
              </Typography>
              <Typography variant="h6" component="h6" className={classes.text4}>
                {text1}
              </Typography>
              <Typography variant="caption" className={classes.text3}>
                Example: {text11}
              </Typography>
              <div>
                <Typography variant="caption" className={classes.text3}>
                  Responses schema: {text21}
                </Typography>
              </div>
              <Divider />
              <Typography variant="caption" className={classes.text3}>
                Get movie by name
              </Typography>
              <Typography variant="h6" component="h6" className={classes.text4}>
                {text2}
              </Typography>
              <Typography variant="caption" className={classes.text3}>
                Example: {text12}
              </Typography>
              <div>
                <Typography variant="caption" className={classes.text3}>
                  Responses schema: {text22}
                </Typography>
              </div>
              <Divider />
              <Typography variant="caption" className={classes.text3}>
                Post a review for a movie
              </Typography>
              <Typography variant="h6" component="h6" className={classes.text4}>
                [Hidden] {text3}
              </Typography>
              <Typography variant="caption" className={classes.text3}>
                Example: {text13}
              </Typography>
              <Divider />
            </div>
          </Paper>
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Api));
