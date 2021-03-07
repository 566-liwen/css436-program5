import React from 'react';
import axios from 'axios';
import { withRouter, Link } from 'react-router-dom'

import apiConfig from './apiConfig'

class Movie extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        movie: null
      };
    }

    componentDidMount() {
        const {name} = this.props.match.params
        axios.get(apiConfig + '/api/movies/' + name)
            .then(
                response => this.setState({movie: response.data})
            )
            .catch(
                error => console.log(error)
            )
    }

    render() {
        const movie = this.state.movie;
        return (
            <div>
              {movie?
                <div>
                  <p>Info: {movie.name} + {movie.description}</p>
                </div>
                :
                <div>
                    <p>loading...</p>
                </div>
              }
            </div>
        );
    }
}

export default withRouter(Movie);