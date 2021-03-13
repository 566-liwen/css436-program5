import React from "react";
import axios from "axios";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { withRouter, Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

//import { makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import apiConfig from "./apiConfig";

// style
const styles = theme => ({
  root: {
    //flexGrow: 1,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignContent: "center"
    // height: "70vh"
  },
  gridList: {
    width: "70%",
    height: "50%",
    flexWrap: "nowrap",
    display: "flex",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    //transform: 'translateZ(0)',
    overflowY: "hidden",
    overflowX: "scroll",
    margin: "20px"
  },
  paper: {
    //textAlign: 'center',
    /*padding: theme.spacing(1),
        ,
        color: theme.palette.text.secondary,*/
  },
  card: {
    display: "flex",

    overflow: "visible",
    minHeight: "300px",
    maxWidth: "200px",
    justifyContent: "center"
  },
  cardContent: {
    display: "flex",
    flex: "10 auto"
  },
  media: {
    display: "flex",
    //backgroundSize: "contain",
    // height: "140px",
    // width: "90px",
    //width: "100%",
    width: "200px",
    height: "100%",
    justifyContent: "center"
    //alignContent: 'center',
  },
  cardAction: {
    height: "100%"
  },
  text: {
    marginTop: "50px",
    marginBottom: "80px",
    textAlign: "center"
  },
  text2: {
    color: "#283593",
    marginBottom: "30px"
  },
  text3: {
    color: "#7986cb"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  genres: {
    textAlign: "center"
  }
});

class Movies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      genres: [],
      selectedGenre: "All"
    };
    this.handleGenreChange = this.onHandleGenreChange.bind(this);
  }

  componentDidMount() {
    const genre = this.state.selectedGenre;
    axios
      .get(apiConfig + "/api/movies/genres/" + genre.toLowerCase())
      .then(response =>
        this.setState({
          movies: response.data.movies,
          genres: response.data.genres
        })
      )
      .catch(error => console.log(error));
  }

  onHandleGenreChange(event) {
    if (!event.target.value) return;
    const genre = event.target.value;
    axios
      .get(apiConfig + "/api/movies/genres/" + genre.toLowerCase())
      .then(response =>
        this.setState({
          movies: response.data.movies,
          genres: response.data.genres,
          selectedGenre: genre
        })
      )
      .catch(error => console.log(error));
  }

  render() {
    const { movies, selectedGenre, genres } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.text}>
          <Typography variant="h3" component="h3" className={classes.text2}>
            Top 40 Movies You Probably Missed in 2020
          </Typography>

          <Typography variant="h5" component="h5" className={classes.text3}>
            Due to the pandemic in 2020, we all miss the feeling of watching
            movies in the theater.
          </Typography>
          <Typography variant="h5" component="h5" className={classes.text3}>
            Here are the 40 top-rated movies in 2020 in case you missed them.
          </Typography>
          <Typography variant="h5" component="h5" className={classes.text3}>
            Explore, share, and have fun!
          </Typography>
        </div>
        <div className={classes.genres}>
          <FormControl variant="filled" className={classes.formControl}>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              Genre
            </InputLabel>
            <Select
              native
              value={selectedGenre}
              onChange={this.handleGenreChange.bind(this)}
              inputProps={{
                name: "age",
                id: "filled-age-native-simple"
              }}
            >
              {genres.map(genre => (
                <option value={genre} key={genre}>
                  {genre}
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={classes.root}>
          <GridList className={classes.gridList}>
            {movies.map(movie => (
              <Card className={classes.card} key={movie.title}>
                <Link to={"movies/" + encodeURIComponent(movie.title)}>
                  <CardActionArea className={classes.cardAction}>
                    <CardMedia
                      className={classes.media}
                      image={movie.posterPath}
                      title="moviePoster"
                    />
                    <CardContent className={classes.cardContent} />
                  </CardActionArea>
                </Link>
              </Card>
            ))}
          </GridList>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Movies));
