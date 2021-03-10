import React from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper';
import grey from '@material-ui/core/colors/grey';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import apiConfig from './apiConfig'

const backgroundColor = grey[300];

const styles = theme => ({
  root: {
    backgroundColor: backgroundColor,
    height: '100vh'
  },
  card: {
     display: 'flex',
     maxWidth:1000,
     marginLeft: 'auto',
//     verticalAlign: 'middle',
     position: 'absolute',
     marginTop: '30px',
alignItems: 'center',
    justifyContent: 'center'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    textAlign: 'center'
  },
  cover: {
    flex: '1 0 auto',
    width: 400,
    height: 600
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  comments:{
   width: '100%'
  },
  heading: {
//      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
  },
  secondaryHeading: {
//      fontSize: theme.typography.pxToRem(15),
     // color: theme.palette.text.secondary,
  },
});

class Movie extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        movie: null,
        expanded: false,
        content:"",
        subject:""
      };
      this.handleChange = this.onHandleChange.bind(this);
      this.handleContentChange = this.onHandleContentChange.bind(this);
      this.handleSubjectChange = this.onHandleSubjectChange.bind(this);
      this.handleSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const {name} = this.props.match.params
        axios.get(apiConfig + '/api/movies/' + encodeURIComponent(name))
            .then(
                response => this.setState({movie: response.data})
            )
            .catch(
                error => console.log(error)
            )
    }

  onHandleChange(event) {
    this.setState(state => ({
      expanded: state.expanded === event? false : event
    }));
  }

  onHandleContentChange(event) {
      this.setState(state => ({
        content: event.target.value
      }));
  }

    onHandleSubjectChange(event) {
        this.setState(state => ({
          subject: event.target.value
        }));
    }

    onSubmit(){
        const {movie, subject, content} = this.state;
        const currentDate = new Date().toLocaleDateString();
        const viewObj = {
            subject: subject,
            content: content,
            date: currentDate
        }
        let dupReviews = JSON.parse(JSON.stringify(movie.reviews))
        dupReviews.splice(0, 0, viewObj);
        axios.post(
            apiConfig + '/api/movies/reviews',
            {
                "title": movie.title,
                "overview": movie.overview,
                "releaseDate": movie.releaseDate,
                "originalLanguage": movie.originalLanguage,
                "genres": movie.genres,
                "posterPath": movie.posterPath,
                "videoPath": movie.videoPath,
                "reviews": dupReviews
            }
            )
            .then(
                response => this.setState({movie: response.data})
            )
            .catch(
                error => console.log(error)
        )
    }

    render() {
        const { classes } = this.props;
        const {movie, expanded, content, subject} = this.state;
        return (
            <div className={classes.root}>
                {movie?
                    <Card className={classes.card}>
                          <div className={classes.details}>
                            <CardMedia
                                className={classes.cover}
                                image={movie.posterPath}
                                title={movie.title}
                            />
                          </div>
                          <CardContent className={classes.content}>
                              <Typography component="h5" variant="h5">
                                {movie.title}
                              </Typography>
                              <Typography variant="subtitle1" color="textSecondary">
                                {movie.releaseDate}  |   {movie.originalLanguage.toUpperCase()}
                              </Typography>
                              {movie.genres.map((genre) => (
                                <Typography variant="subtitle1" color="textSecondary" key={genre}>
                                    {genre}
                                </Typography>
                              ))}
                              <Typography variant="subtitle1" color="textSecondary">
                                {movie.overview}
                              </Typography>
                           </CardContent>
                        </Card>
                    :
                    <div>Loading</div>
                }
            <div>
                <Typography component="h5" variant="h5">Comments</Typography>
                <TextField
                      id="subject"
                      label="Subject"
                      defaultValue="Default Value"
                      variant="outlined"
                      value={subject}
                      onChange={this.handleSubjectChange.bind(this)}
                />
                <TextField
                      id="content"
                      label="Content"
                      multiline
                      rows={4}
                      defaultValue="Default Value"
                      variant="outlined"
                      value={content}
                      onChange={this.handleContentChange.bind(this)}
                />
                <Button onClick={this.handleSubmit}>Submit</Button>
            </div>
            <div className={classes.comments}>
                {movie && movie.reviews.map((review) => (
                  <Accordion expanded={expanded === review.subject} onChange={this.handleChange.bind(this, review.subject)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Typography className={classes.heading}>{review.date}</Typography>
                      <Typography className={classes.secondaryHeading}>{review.subject}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {review.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
            </div>
        </div>


        );
    }
}

export default withStyles(styles)(withRouter(Movie));