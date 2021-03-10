import React from 'react';
import axios from 'axios';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withRouter, Link } from 'react-router-dom'
import { withStyles } from '@material-ui/styles';

import apiConfig from './apiConfig'

const styles = theme => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class Movies extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        movies: []
      };
//      this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        console.log(apiConfig);
        axios.get(apiConfig + '/api/movies')
            .then(
                response => this.setState({movies: response.data})
            )
            .catch(
                error => console.log(error)
            )
    }

    render() {
        const { classes } = this.props;
        const movies = this.state.movies;
        return (
            <GridList cellHeight={160}  cols={3}>
              {movies.map((movie) => (
                <Card className={classes.root} key={movie.title}>
                    <Link to={'movies/' + encodeURIComponent(movie.title)}>
                      <CardActionArea>
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="h2">
                            {movie.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" component="p">
                            {movie.overview}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Link>
                </Card>
              ))}
            </GridList>
        );
    }
}

export default withStyles(styles)(withRouter(Movies));