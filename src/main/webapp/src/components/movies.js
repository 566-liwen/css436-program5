import React from 'react';
import axios from 'axios';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { withRouter, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles'

//import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';


import apiConfig from './apiConfig'

// style
const styles = theme => ({
    root: {
        //flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    gridList: {
        width: '70vw',
        flexWrap: 'nowrap',
        display: 'flex',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        //transform: 'translateZ(0)',
        overflowY:'hidden',
        overflowX: 'scroll',
    },
    paper: {
        textAlign: 'center'
        /*padding: theme.spacing(1),
        ,
        color: theme.palette.text.secondary,*/
    },
    card: {
        overflow: 'visible'
    }
});


/*function FormRow() {

        const movies = this.state.movies;
        return (
        <div>
            {movies.map((movie) => (
                <Grid item xs={4}>
                   <Card key={movie.name}>
                       <Link to={'movies/' + movie.title}>
                         <CardActionArea>
                           <CardContent>
                             <Typography gutterBottom variant="h5" component="h2">
                               {movie.name}
                             </Typography>
                             <Typography variant="body2" color="textSecondary" component="p">
                               {movie.description}
                             </Typography>
                           </CardContent>
                         </CardActionArea>
                       </Link>
                   </Card>
                </Grid>
            ))}
        </div>

          *//*<React.Fragment>
            <Grid item xs={4}>
              <Paper className={classes.paper}>item</Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>item</Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.paper}>item</Paper>
            </Grid>
          </React.Fragment>*//*
        );
    }*/


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
        const movies = this.state.movies;
        const { classes } = this.props;
        /*function FormRow() {
            return (

                {movies.map((movie) => (
                    <Grid item xs={4}>
                       <Card key={movie.name}>
                           <Link to={'movies/' + movie.name}>
                             <CardActionArea>
                               <CardContent>
                                 <Typography gutterBottom variant="h5" component="h2">
                                   {movie.name}
                                 </Typography>
                                 <Typography variant="body2" color="textSecondary" component="p">
                                   {movie.description}
                                 </Typography>
                               </CardContent>
                             </CardActionArea>
                           </Link>
                       </Card>
                    </Grid>
                ))}

                *//*
                <React.Fragment>
                    <Grid item xs={4}>
                      <Paper className={classes.paper}>item</Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper className={classes.paper}>item</Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper className={classes.paper}>item</Paper>
                    </Grid>
                </React.Fragment>
                *//*
            );
        }*/

        return (
            <div className={classes.root}>
            <GridList className={classes.gridList}>
              {movies.map((movie) => (
                <Card className={classes.card} key={movie.title}>
                    <Link to={'movies/' + encodeURIComponent(movie.title)}>
                      <CardActionArea >
                        <CardContent >
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
            </div>

            /*<Grid container spacing={1}>

              <Grid container item xs={12} spacing={3}>
                <FormRow />
              </Grid>
              <Grid container item xs={12} spacing={3}>
                <FormRow />
              </Grid>
              <Grid container item xs={12} spacing={3}>
                <FormRow />
              </Grid>

            </Grid>*/
        );
    }
}

export default withStyles(styles)(withRouter(Movies));
//export default withStyles(styles, (withRouter(Movies)));