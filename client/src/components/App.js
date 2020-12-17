import React, { Component } from 'react';

import logo from './logo.svg';

import './App.scss';

import {Search} from './search/search';
import Leaderboard from './leaderboard/leaderboard';
import SearchPage from './searchpage/searchpage';
import PlayerData from './playerdata/playerdata';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom';

class App extends Component {


  render() {
    return (
      <Router>
      <Switch>
        <Route path="/" exact component={SearchPage}/>
        <Route path="/playerdata" component={PlayerData}/>
      </Switch>
  </Router>
    );
  }
}

export default App;
