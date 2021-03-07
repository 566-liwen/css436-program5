import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Movies from './components/movies';
import Movie from './components/movie';

function App() {

  return (
//    <div className="App">
//        <MainMovies/>
//        <p>
//            Movies
//        </p>
//    </div>
    <Router>
        <Switch>
            <Route exact path="/">
                <Movies />
            </Route>
            <Route
                path='/movies/:name'
                exact
                component={Movie}
            />
        </Switch>
    </Router>
  );
}

export default App;
