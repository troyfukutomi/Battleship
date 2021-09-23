import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import WelcomePage from './components/Welcome/WelcomePage';
import GamePage from './components/Game/GamePage';

function App() {
  return (
    <div>
     <BrowserRouter>
      <Switch>
        <Route exact path= "/" component={WelcomePage} />
        <Route exact path= "/play" component={GamePage} />
      </Switch>
     </BrowserRouter>
    </div>
  );
}

export default App;
