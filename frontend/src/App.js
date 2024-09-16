import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import Dashboard from './dashboard/Dashboard';
import Main from './faqManagement/Main';

class App extends Component {

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <BrowserRouter>
          <Switch>
            <Route path="/" component={Dashboard} exact />
            <Route path="/FAQmanagement" component={Main} exact />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    );
  }

}
export default App;
