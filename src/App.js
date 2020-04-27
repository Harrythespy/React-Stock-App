import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './Components/Nav';
import Stock from './Components/Stock';
import Home from './Components/Home';
import StockDetail from './Components/StockDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/stock" component={Stock}/>
          <Route path="/history" component={StockDetail}/>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
