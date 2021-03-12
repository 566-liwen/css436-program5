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
  margin: {
    margin: "20px"
  },
  infocard: {
    display: "flex",
    minHeight: "400px",
    margin: "20px"
  },
  infodetails: {
    display: "flex",
    flexDirection: "column"
  },
  infocontent: {
    flex: "1 0 auto"
  },
  infocover: {
    backgroundSize: "contain",
    width: "400px",
    height: "400px"
  },
  videocard: {
    minHeight: "145px"
  },
  nytreviewbtn: {
    float: "right",
    margin: "10px"
  },
  inputreivew: {
    marginTop: "10px",
    width: "95%"
  },
  inputreviewoutter: {
    textAlign: "center"
  },
  floatright: {
    float: "right"
  },
  video: {
    height: "400px"
  },
  textPadding: {
    margin: "10px",
    paddingLeft: "20px"
  },
  nodata: {
    // margin: "10px",
    // paddingLeft: "20px",
    // textAlign: "center"
  },
  root: {
    // backgroundColor: backgroundColor
    // height: "100vh"
  },
  card: {
    // display: "flex",
    // maxWidth: 1000,
    // marginLeft: "auto",
    // position: "absolute",
    // marginTop: "30px",
    // alignItems: "center",
    // justifyContent: "center"
  },
  details: {
    // display: "flex",
    // flexDirection: "column"
  },
  content: {
    //textAlign: "center"
  },
  cover: {
    // flex: "1 0 auto",
    // width: 400,
    // height: 600
  },
  playIcon: {
    // height: 38,
    // width: 38
  },
  comments: {
    // width: "100%"
  },
  heading: {
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
});

class Movie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      expanded: false,
      content: "",
      subject: "",
      nytimesReview: null,
      contentError: false
    };
    this.handleChange = this.onHandleChange.bind(this);
    this.handleContentChange = this.onHandleContentChange.bind(this);
    this.handleSubjectChange = this.onHandleSubjectChange.bind(this);
    this.handleSubmit = this.onSubmit.bind(this);
    this.handleLearnMore = this.onHandleLearnMore.bind(this);
    this.handleHome = this.onHandleHome.bind(this);
  }

  componentDidMount() {
    const { name } = this.props.match.params;
    // axios
    //   .get(apiConfig + "/api/movies/" + encodeURIComponent(name))
    //   .then(
    //     //response => this.setState({ movie: response.data })
    //     const movie = response.data;
    //     axios.get(apiConfig + "/api/movies/nytimesreview")
    //   )
    //   .catch(error => console.log(error));

    axios
      .all([
        axios.get(apiConfig + "/api/movies/" + encodeURIComponent(name)),
        axios.get(
          apiConfig + "/api/movies/nytimesreview/" + encodeURIComponent(name)
        )
      ])
      .then(
        axios.spread((responseA, responseB) => {
          this.setState({
            movie: responseA.data,
            nytimesReview: responseB.data
          });
        })
      )
      .catch(errors => {
        //todo
      });
  }

  onHandleHome() {
    window.location.href = "/";
  }

  onHandleChange(event) {
    this.setState(state => ({
      expanded: state.expanded === event ? false : event
    }));
  }

  onHandleContentChange(event) {
    const content = event.target.value;
    let subject = content;
    if (content.length > 20) {
      subject = content.substring(0, 20) + "...";
    }
    this.setState(state => ({
      content: content,
      subject: subject,
      contentError: false
    }));
  }

  onHandleSubjectChange(event) {
    this.setState(state => ({
      subject: event.target.value
    }));
  }

  onHandleLearnMore() {
    const { nytimesReview } = this.state;
    if (!nytimesReview || !nytimesReview.url) return;
    var win = window.open(nytimesReview.url, "_blank");
    win.focus();
  }

  onSubmit() {
    const { movie, subject, content, contentError } = this.state;
    if (content == null || content == "") {
      this.setState({ contentError: true });
      return;
    }
    const currentDate = new Date().toLocaleDateString();
    const viewObj = {
      subject: subject,
      content: content,
      date: currentDate
    };
    let dupReviews = JSON.parse(JSON.stringify(movie.reviews));
    dupReviews.splice(0, 0, viewObj);
    axios
      .post(apiConfig + "/api/movies/reviews", {
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.releaseDate,
        originalLanguage: movie.originalLanguage,
        genres: movie.genres,
        posterPath: movie.posterPath,
        videoPath: movie.videoPath,
        reviews: dupReviews
      })
      .then(response => this.setState({ movie: response.data }))
      .catch(error => console.log(error));
  }

  render() {
    const { classes } = this.props;
    const {
      movie,
      expanded,
      content,
      subject,
      nytimesReview,
      contentError
    } = this.state;
    return (
      <React.Fragment>
        <Container fixed className={classes.root}>
          {movie ? (
            <Card className={classes.infocard}>
              <CardMedia
                className={classes.infocover}
                image={movie.posterPath}
                title={movie.title}
              />
              <div className={classes.infodetails}>
                <CardContent className={classes.infocontent}>
                  <Typography component="h5" variant="h5">
                    {movie.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {movie.releaseDate} | {movie.originalLanguage.toUpperCase()}
                  </Typography>
                  <Divider />
                  {movie.genres.map(genre => (
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      key={genre}
                    >
                      - {genre}
                    </Typography>
                  ))}
                  <Divider />
                  <Typography variant="subtitle1" color="textPrimary">
                    {movie.overview}
                  </Typography>
                </CardContent>
              </div>
            </Card>
          ) : (
            <Card className={classes.infocard && classes.margin}>
              <div className={classes.infodetails}>
                <CardContent className={classes.infocontent}>
                  <Typography variant="h5" color="h5">
                    No Movie Information Found
                  </Typography>
                </CardContent>
              </div>
            </Card>
          )}
          {movie && movie.videoPath ? (
            <Card className={classes.videocard && classes.margin}>
              <CardMedia
                className={classes.content && classes.video}
                component="iframe"
                image={
                  "https://www.youtube.com/embed/" +
                  movie.videoPath.split("=")[1]
                }
                title={movie.title}
                autoPlay
              />
            </Card>
          ) : (
            <Card className={classes.videocard && classes.margin}>
              <div className={classes.infodetails}>
                <CardContent className={classes.infocontent}>
                  <Typography variant="h5" color="h5">
                    No Movie Trailer Found
                  </Typography>
                </CardContent>
              </div>
            </Card>
          )}
          {nytimesReview ? (
            <Card className={classes.card && classes.margin}>
              <CardContent className={classes.content}>
                <Typography component="subtitle1" variant="caption">
                  New York Times Movie Review
                </Typography>
                <Divider />
                <Typography component="h5" variant="h5">
                  {nytimesReview.headline}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  - By {nytimesReview.byline}
                </Typography>
                <Typography variant="subtitle1" color="textPrimary">
                  {nytimesReview.summary}
                </Typography>
                <Button
                  className={classes.nytreviewbtn}
                  variant="contained"
                  color="primary"
                  onClick={this.handleLearnMore}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className={classes.card && classes.margin}>
              <CardContent className={classes.content}>
                <Typography component="subtitle1" variant="caption">
                  New York Times Movie Review
                </Typography>
                <Divider />
                <Typography variant="subtitle1" color="textSecondary">
                  Currently, no review from New York Times.
                </Typography>
              </CardContent>
            </Card>
          )}
          <Card className={classes.card && classes.margin}>
            {movie ? (
              <Typography
                component="h5"
                variant="h5"
                className={classes.textPadding}
              >
                Share your thoughts about {movie.title}
              </Typography>
            ) : (
              <Typography
                component="h5"
                variant="h5"
                className={classes.textPadding}
              >
                Share your thoughts
              </Typography>
            )}
            <div className={classes.inputreviewoutter}>
              {contentError ? (
                <TextField
                  id="content"
                  error
                  className={classes.inputreivew}
                  label="Write your critic review"
                  helperText="Can not be empty."
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={content}
                  labelWidth={60}
                  onChange={this.handleContentChange.bind(this)}
                />
              ) : (
                <TextField
                  id="content"
                  className={classes.inputreivew}
                  label="Write your critic review"
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  value={content}
                  labelWidth={60}
                  onChange={this.handleContentChange.bind(this)}
                />
              )}
            </div>
            <Button
              className={classes.nytreviewbtn}
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          </Card>
          {movie && movie.reviews.length > 0 ? (
            <Card className={classes.comments && classes.margin}>
              <Typography
                component="h5"
                variant="h5"
                className={classes.textPadding}
              >
                Critic Reivews
              </Typography>
              {movie &&
                movie.reviews.map(review => (
                  <Accordion
                    key={review.subject + review.date}
                    expanded={expanded === review.subject}
                    onChange={this.handleChange.bind(this, review.subject)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>
                        {review.date}
                      </Typography>
                      <Typography className={classes.secondaryHeading}>
                        {review.subject}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{review.content}</Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </Card>
          ) : (
            <Card className={classes.card && classes.margin}>
              <CardContent className={classes.content}>
                <Typography component="subtitle1" variant="caption">
                  Critic Reviews
                </Typography>
                <Divider />
                <Typography variant="subtitle1" color="textSecondary">
                  Currently, no critic review.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(Movie));
